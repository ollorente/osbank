// @ts-check
import http from "./http-common";

class ItemDataService {
  /**
   * @param {any} data
   */
  create(data) {
    return http.post(`/items`, data);
  }

  /**
   * @param {any} item
   */
  get(item) {
    return http.get(`/items/${item}`);
  }

  /**
   * @param {number} l
   * @param {number} p
   */
  list(l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return http.get(`/items?isActive=true&_limit=${limit}&_page=${page}&_sort=name&_order=asc`);
  }

  /**
   * @param {any} item
   */
  remove(item) {
    return http.delete(`/items/${item}`);
  }

  /**
   * @param {any} item
   * @param {any} data
   */
  update(item, data) {
    return http.patch(`/items/${item}`, data);
  }
}

export default new ItemDataService();
