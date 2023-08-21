const TRANSACTION_ID_NOT_FOUND = {
    code: "TRANSACTION_ID_NOT_FOUND",
    message: "se envió un ID de transacción no válido"
  };
  
  const NO_DATA_FOUND = {
    code: "NO_DATA_FOUND",
    message: "No se encontraron datos para esta transacción de venta a crédito."
  };
  
  const ADDED_TO_CART = {
    code: "ADDED_TO_CART",
    message: "Agregado al carrito exitosamente."
  };
  
  const INVALID_PRICE = {
    code: "INVALID_PRICE",
    message: "Hay un error en el total de precios."
  };
  
  const SALE_COMPLETED_SUCCESS = {
    code: "SALE_COMPLETED_SUCCESS",
    message: "Venta completada exitosamente."
  };
  
  const CART_EMPTIED = {
    code: "CART_EMPTIED",
    message: "Se han eliminado todos los elementos del carrito de la transacción actual."
  };
  
  const SALE_DELETED = {
    code: "SALE_DELETED",
    message: "La venta asociada con el ID de transacción ha sido eliminada exitosamente."
  };
  
  const INVALID_CUSTOMER = {
    code: "INVALID_CUSTOMER",
    message: "Se han proporcionado detalles de cliente inválidos."
  };
  
  const BALANCE_MISMATCH = {
    code: "BALANCE_MISMATCH",
    message: "Se ha producido una discrepancia en el saldo. No se pudo finalizar esta venta. Contacta al administrador."
  };
  
  module.exports = {
    TRANSACTION_ID_NOT_FOUND,
    NO_DATA_FOUND,
    ADDED_TO_CART,
    INVALID_PRICE,
    SALE_COMPLETED_SUCCESS,
    CART_EMPTIED,
    SALE_DELETED,
    INVALID_CUSTOMER,
    BALANCE_MISMATCH
  };
  