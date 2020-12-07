import BaseService from "./base_service";

export default class UnidadService extends BaseService {

  constructor(item) {
    super(item);
    this.tableName = "Unidades";
  }

}