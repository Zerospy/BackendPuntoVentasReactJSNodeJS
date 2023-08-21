const currency = require("currency.js");
const { getManager, getConnection, EntityManager } = require("typeorm");
const { TransactionId } = require("../entity/TransactionId");
const { TransactionDetails } = require("../entity/TransactionDetails");
const { Product } = require("../entity/Product");
const { CheckoutSale, DeleteSale } = require("../dtos/sale");
const { Customer } = require("../entity/Customer");
const { CreditTransactionsPointer } = require("../entity/CreditTransactionsPointer");
const { CreditTransactions, CreditTransactionsType } = require("../entity/CreditTransactions");
const { TransactionHeader, TransactionStatus, SalesType } = require("../entity/TransactionHeader");
const Messages = require("./messages");

class SalesService {
  async initTransaction(userId = "admin") {
    let returnId = null;

    const id = this.getIdPrefix();
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    // Nueva transacción:
    await queryRunner.startTransaction();

    try {
      const count = await queryRunner.manager.count(TransactionId, { id });

      if (count > 0) {
        await queryRunner.manager.increment(TransactionId, { id }, "count", 1);

        const transactionId = await queryRunner.manager.findOne(TransactionId, id);

        returnId = Number(`${transactionId.id}${transactionId.count}`);
      } else {
        const transactionId = this.getNewTransactionId(userId);

        await queryRunner.manager.insert(TransactionId, transactionId);

        returnId = Number(`${id}1`);
      }

      const transactionHeader = this.getnewTransHeader(returnId, userId);

      await queryRunner.manager.insert(TransactionHeader, transactionHeader);
      await queryRunner.commitTransaction();

      return returnId;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  async openTransaction(userId = "admin", transactionId) {
    const transactionHeader = await this.fetchFinishedTransactionHeader(transactionId);

    if (!transactionHeader) {
      throw Messages.TRANSACTION_ID_NOT_FOUND;
    }

    transactionHeader.transactionStatus = TransactionStatus.Pending;
    transactionHeader.updatedBy = userId;

    await getManager().save(transactionHeader);

    return transactionId;
  }

  async updateCart(cartItem, userId = "admin") {
    const transactionHeader = await this.fetchInProcessTransactionHeader(cartItem.id);

    if (!transactionHeader) {
      throw Messages.TRANSACTION_ID_NOT_FOUND;
    }

    const product = await getManager().findOne(Product, {
      id: cartItem.productId
    });

    // Verificar si el precio ingresado es correcto o no.
    const isValidPrice =
      currency(product.sellingPrice)
        .multiply(cartItem.qty)
        .subtract(cartItem.discount).value === cartItem.price;

    if (isValidPrice === false) {
      throw Messages.INVALID_PRICE;
    }

    cartItem.sellingPrice = currency(product.sellingPrice).multiply(cartItem.qty).value;
    cartItem.costPrice = currency(product.costPrice).multiply(cartItem.qty).value;
    cartItem.createdBy = userId;
    cartItem.updatedBy = userId;

    await getManager().save(cartItem);

    transactionHeader.transactionStatus = TransactionStatus.Pending;

    await getManager().save(transactionHeader);

    return Messages.ADDED_TO_CART;
  }

  async removeItemFromCart(id, productId) {
    const transactionHeader = this.fetchInProcessTransactionHeader(id);

    if (!transactionHeader) {
      throw Messages.TRANSACTION_ID_NOT_FOUND;
    }

    return await getManager().delete(TransactionDetails, {
      id,
      productId
    });
  }

  async emptyCart(transactionId) {
    const transactionHeader = await this.fetchInProcessTransactionHeader(transactionId);

    if (!transactionHeader) {
      throw Messages.TRANSACTION_ID_NOT_FOUND;
    }

    await getManager()
      .createQueryBuilder()
      .delete()
      .from(TransactionDetails)
      .where("id = :id", { id: transactionId })
      .execute();

    return Messages.CART_EMPTIED;
  }

  async deleteSale(userId = "admin", saleDetails) {
    const transactionHeader = await this.fetchFinishedTransactionHeader(saleDetails.transactionId);

    if (!transactionHeader) {
      throw Messages.TRANSACTION_ID_NOT_FOUND;
    }

    if (transactionHeader.salesType === SalesType.CounterSale) {
      return await this.deleteCounterSale(saleDetails.transactionId);
    } else {
      return await this.deleteCreditSale(userId, saleDetails);
    }
  }

  async checkoutSale(userId = "admin", saleDetails, isCreditSale = false) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    // Nueva transacción:
    await queryRunner.startTransaction();

    try {
      if (isCreditSale === true) {
        saleDetails.saleType = SalesType.CreditSale;
        await this.saveCreditSale(queryRunner.manager, userId, saleDetails);
      } else {
        saleDetails.saleType = SalesType.CounterSale;
        await this.saveSale(queryRunner.manager, userId, saleDetails);
      }

      queryRunner.commitTransaction();

      return Messages.SALE_COMPLETED_SUCCESS;
    } catch (error) {
      queryRunner.rollbackTransaction();
      throw error;
    }
  }

  async deleteCreditSale(userId, saleDetails) {
    const { transactionId, amountPaid, customerId } = saleDetails;

    const transactionHeader = await this.fetchFinishedTransactionHeader(transactionId);

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    // Nueva transacción:
    await queryRunner.startTransaction();

    try {
      const previousTransaction = await queryRunner.manager.findOne(
        CreditTransactions,
        {
          customerId,
          transactionId,
          isReverted: false
        }
      );

      const pointer = await queryRunner.manager.findOne(
        CreditTransactionsPointer,
        { customerId }
      );

      if (!previousTransaction || !pointer) {
        throw Messages.NO_DATA_FOUND;
      }

      // Verificar que la tabla de punteros tenga la última actualización del cliente.
      await this.verifyTheBalanceIsLatest(queryRunner.manager, pointer);

      //===========================
      // Current CreditTransaction
      //===========================
      const current = new CreditTransactions();
      current.customerId = saleDetails.customerId;
      current.amountPaid = previousTransaction.billAmount;
      current.balance = 0;
      current.billAmount = previousTransaction.billAmount;
      current.transactionId = previousTransaction.transactionId;
      current.totalDebt = currency(pointer.balanceAmount)
        .subtract(currency(previousTransaction.billAmount))
        .add(amountPaid).value;
      current.isReverted = false;
      current.paidDate = new Date();
      current.type = CreditTransactionsType.SaleRevertPayment;
      current.createdBy = userId;
      current.updatedBy = userId;

      const res = await queryRunner.manager.save(current);

      //==========================
      // CreditTransactionsPointer
      //==========================
      pointer.seqPointer = res.id;
      pointer.updatedBy = userId;
      pointer.balanceAmount = current.totalDebt;

      await queryRunner.manager.save(pointer);

      //===========================
      // Previous CreditTransaction
      //===========================
      previousTransaction.isReverted = true;
      previousTransaction.updatedBy = userId;

      await queryRunner.manager.save(previousTransaction);

      //==========================
      // TransactionHeader
      //==========================
      transactionHeader.isActive = false;

      await queryRunner.manager.save(transactionHeader);

      queryRunner.commitTransaction();

      return Messages.SALE_DELETED;
    } catch (error) {
      queryRunner.rollbackTransaction();
      throw error;
    }
  }

  async deleteCounterSale(id) {
    await getManager()
      .createQueryBuilder()
      .delete()
      .from(TransactionDetails)
      .where("id = :id", { id })
      .execute();

    return Messages.SALE_DELETED;
  }

  async saveCreditSale(manager, userId, saleDetails) {
    const count = await manager.count(Customer, { id: saleDetails.customerId });

    if (count !== 1) {
      throw Messages.INVALID_CUSTOMER;
    }

    const { billAmount, amountPaid } = await this.saveSale(
      manager,
      userId,
      saleDetails
    );

    const currentBalance = currency(billAmount).subtract(amountPaid).value;

    const currentTransaction = new CreditTransactions();
    currentTransaction.customerId = saleDetails.customerId;
    currentTransaction.amountPaid = amountPaid;
    currentTransaction.billAmount = billAmount;
    currentTransaction.isReverted = false;
    currentTransaction.type = CreditTransactionsType.Sale;
    currentTransaction.paidDate = new Date();
    currentTransaction.createdBy = userId;
    currentTransaction.updatedBy = userId;
    currentTransaction.transactionId = saleDetails.transactionId;
    currentTransaction.balance = currentBalance;

    const previousTransaction = await manager.findOne(CreditTransactions, {
      customerId: saleDetails.customerId,
      transactionId: saleDetails.transactionId,
      isReverted: false
    });

    let pointer = await manager.findOne(CreditTransactionsPointer, {
      customerId: saleDetails.customerId
    });

    // Verificar que la tabla de punteros tenga la última actualización del cliente.
    await this.verifyTheBalanceIsLatest(manager, pointer);

    // CASO:
    // No hay transacción de crédito anterior y nueva entrada de venta.
    if (!pointer && !previousTransaction) {
      currentTransaction.totalDebt = currentBalance;
    }

    // CASO:
    // Tiene transacción de crédito anterior y nueva entrada de venta.
    if (pointer && !previousTransaction) {
      currentTransaction.totalDebt = currentBalance + pointer.balanceAmount;
    }

    // CASO:
    // Tiene transacción de crédito anterior y actualización de venta existente.
    if (pointer && previousTransaction) {
      const previousBalance = await this.revertThePreviousCreditTransaction(
        manager,
        previousTransaction,
        pointer.balanceAmount,
        userId
      );

      currentTransaction.totalDebt = currentBalance + previousBalance;
      previousTransaction.isReverted = true;

      // Revertir la transacción anterior.
      await manager.save(CreditTransactions, previousTransaction);
    }

    const res = await manager.save(CreditTransactions, currentTransaction);

    if (!pointer) {
      pointer = new CreditTransactionsPointer();
      pointer.createdBy = userId;
      pointer.customerId = saleDetails.customerId;
    }
    pointer.balanceAmount = currentTransaction.totalDebt;
    pointer.seqPointer = res.id;
    pointer.updatedBy = userId;

    await manager.save(CreditTransactionsPointer, pointer);
  }

  async revertThePreviousCreditTransaction(
    manager,
    previousCreditTransaction,
    currentDebt,
    userId
  ) {
    const ct = new CreditTransactions();
    ct.customerId = previousCreditTransaction.customerId;
    ct.amountPaid = currency(previousCreditTransaction.billAmount).subtract(
      previousCreditTransaction.amountPaid
    ).value;
    ct.balance = 0;
    ct.totalDebt = currency(currentDebt).subtract(ct.amountPaid).value;
    ct.createdBy = userId;
    ct.updatedBy = userId;
    ct.isReverted = true;
    ct.type = CreditTransactionsType.SaleRevertPayment;
    ct.paidDate = new Date();

    await manager.save(CreditTransactions, ct);

    return ct.totalDebt;
  }

  // Este método se utiliza para verificar que la tabla de punteros tenga la última actualización.
  // TODO: Manejar en lugar de lanzar excepción.
  async verifyTheBalanceIsLatest(manager, pointer) {
    if (!pointer) {
      return true;
    }

    const count = await manager
      .createQueryBuilder(CreditTransactions, "ct")
      .where("ct.id >= :id", { id: pointer.seqPointer })
      .getCount();

    if (count !== 1) {
      throw Messages.BALANCE_MISMATCH;
    }
    return true;
  }

  async saveSale(manager, userId, saleDetails) {
    const transactionHeader = await this.fetchInProcessTransactionHeader(
      saleDetails.transactionId
    );

    if (!transactionHeader) {
      throw Messages.TRANSACTION_ID_NOT_FOUND;
    }

    let { totalPrice, totalDiscount, netTotalPrice } = await manager
      .createQueryBuilder(TransactionDetails, "td")
      .select("SUM(td.price)", "totalPrice")
      .addSelect("SUM(td.sellingPrice)", "netTotalPrice")
      .addSelect("SUM(td.discount)", "totalDiscount")
      .where("td.id = :id", { id: saleDetails.transactionId })
      .getRawOne();

    totalPrice = currency(totalPrice).value;
    netTotalPrice = currency(netTotalPrice).value;
    totalDiscount = currency(totalDiscount).value;

    transactionHeader.transactionStatus = TransactionStatus.Done;
    transactionHeader.taxPercentageString = saleDetails.taxPercentageString;
    transactionHeader.tax = saleDetails.tax;
    transactionHeader.discountOnTotal = currency(saleDetails.totalDiscount).value;
    transactionHeader.discountOnItems = totalDiscount;
    // Total de todos los productos sin descuento ni impuestos.
    transactionHeader.netAmount = currency(netTotalPrice).value;
    // Total de netAmount + impuesto + descuento.
    transactionHeader.billAmount = currency(totalPrice)
      .add(saleDetails.tax)
      .subtract(saleDetails.totalDiscount).value;

    transactionHeader.amountPaid = currency(saleDetails.amountPaid).value;
    transactionHeader.updatedBy = userId;
    transactionHeader.salesType = saleDetails.saleType;

    return manager.save(transactionHeader);
  }

  // MÉTODOS DE UTILIDAD
  async fetchInProcessTransactionHeader(cartItemId) {
    return await getManager()
      .createQueryBuilder(TransactionHeader, "th")
      .where(
        "th.id = :id AND isActive = 1 AND th.transactionStatus NOT IN (2)",
        {
          id: cartItemId,
          status: [TransactionStatus.Done]
        }
      )
      .getOne();
  }

  async fetchFinishedTransactionHeader(cartItemId) {
    return await getManager()
      .createQueryBuilder(TransactionHeader, "th")
      .where(
        "th.id = :id AND isActive = 1 AND th.transactionStatus IN (:...status)",
        {
          id: cartItemId,
          status: [TransactionStatus.Done]
        }
      )
      .getOne();
  }

  getnewTransHeader(id, userId, salesType = SalesType.CounterSale) {
    const transactionHeader = new TransactionHeader();
    transactionHeader.id = id;
    transactionHeader.billAmount = 0;
    transactionHeader.discountOnItems = 0;
    transactionHeader.discountOnTotal = 0;
    transactionHeader.netAmount = 0;
    transactionHeader.amountPaid = 0;
    transactionHeader.tax = 0;
    transactionHeader.taxPercentageString = "";
    transactionHeader.salesType = salesType;
    transactionHeader.transactionStatus = TransactionStatus.Init;
    transactionHeader.createdBy = userId;
    transactionHeader.updatedBy = userId;
    transactionHeader.isActive = true;

    return transactionHeader;
  }

  getNewTransactionId(userId) {
    const id = this.getIdPrefix();

    const transactionId = new TransactionId();
    transactionId.id = id;
    transactionId.count = 1;
    transactionId.createdBy = userId;
    transactionId.updatedBy = userId;

    return transactionId;
  }

  getIdPrefix() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const strDay = day.toString().length > 1 ? day : `0${day}`;
    const strMonth = month.toString().length > 1 ? month : `0${month}`;

    return `${year}${strMonth}${strDay}`;
  }
}

module.exports = SalesService;
