const { getManager } = require("typeorm");

class CrudServices {
  constructor() {
    this.classType = null;
    this.alias = null;
  }

  setEntity(classType) {
    this.classType = classType;
    this.alias = this.classType.name.toLowerCase();
  }

  async fetchAll() {
    return await getManager().find(this.classType);
  }

  async fetchPages(query) {
    const recordsToSkip = (query.page - 1) * query.perPage;

    if (query.search) {
      return await getManager()
        .createQueryBuilder(this.classType, this.alias)
        .where(`${this.alias}.id like :id`, { id: `%${query.search}%` })
        .skip(recordsToSkip)
        .take(query.perPage)
        .getMany();
    } else {
      return await getManager()
        .createQueryBuilder(this.classType, this.alias)
        .skip(recordsToSkip)
        .take(query.perPage)
        .getMany();
    }
  }

  async fetchById(id) {
    return await getManager()
      .createQueryBuilder(this.classType, this.alias)
      .where(`${this.alias}.id = :id`, { id })
      .getOne();
  }

  async create(userId = "admin", entity) {
    entity.createdBy = userId;
    entity.updatedBy = userId;
    return await getManager().insert(this.classType, entity);
  }

  async updateById(userId = "admin", where, data) {
    try {
      data.updatedBy = userId;
      data.id = where.id;
      return await getManager().update(this.classType, { ...where }, data);
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT" && error.errno === 19) {
        throw {
          code: "SQLITE_CONSTRAINT",
          message: `Este registro no se puede actualizar porque tiene referencias con otras partes de datos. Por favor, asegúrate de que esas referencias sean eliminadas y prueba esta operación nuevamente.`
        };
      }
      throw error;
    }
  }

  async deleteById(id) {
    try {
      return await getManager().delete(this.classType, id);
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT" && error.errno === 19) {
        throw {
          code: "SQLITE_CONSTRAINT",
          message: `Este registro no se puede eliminar porque tiene referencias con otras partes de datos. Por favor, asegúrate de que esas referencias sean eliminadas y prueba esta operación nuevamente.`
        };
      }
      throw error;
    }
  }
}

module.exports = { CrudServices };
