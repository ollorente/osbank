// @ts-check
import http from "./http-common";

class ItemDataService {
  /**
   * @param {any} data
   */
  async create(data) {
    return await http.post(`/items`, data);
  }

  /**
   * @param {any} item
   */
  async get(item) {
    return await http.get(`/items/${item}`);
  }

  /**
   * @param {number} l
   * @param {number} p
   */
  async list(l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return await http.get(`/items?isActive=true&_limit=${limit}&_page=${page}&_sort=name&_order=asc`);
  }

  /**
   * @param {any} item
   */
  async remove(item) {
    return await http.delete(`/items/${item}`);
  }

  /**
   * @param {any} item
   * @param {any} data
   */
  async update(item, data) {
    return await http.patch(`/items/${item}`, data);
  }
}

export default new ItemDataService();
