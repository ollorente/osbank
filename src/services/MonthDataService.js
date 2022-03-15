// @ts-check
import http from "./http-common";

class MonthDataService {
  /**
   * @param {any} data
   */
  async create(data) {
    return await http.post(`/months`, data);
  }

  /**
   * @param {any} month
   */
  async get(month) {
    return await http.get(`/months/${month}`);
  }

  /**
   * @param {number} l
   * @param {number} p
   */
  async list(l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return await http.get(`/months?isActive=true&_limit=${limit}&_page=${page}&_sort=order&_order=asc`);
  }

  /**
   * @param {any} month
   */
  async remove(month) {
    return await http.delete(`/months/${month}`);
  }

  /**
   * @param {any} month
   * @param {any} data
   */
  async update(month, data) {
    return await http.put(`/months/${month}`, data);
  }

  /**
   * @param {any} month
   * @param {number} l
   * @param {number} p
   */
  async entries(month, l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return await http.get(`/months/${month}/entries?limit=${limit}&page=${page}`);
  }

  /**
   * @param {any} month
   * @param {number} l
   * @param {number} p
   */
  async estimates(month, l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return await http.get(`/months/${month}/estimates?limit=${limit}&page=${page}`);
  }

  /**
   * @param {any} month
   * @param {number} l
   * @param {number} p
   */
  async expenses(month, l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return await http.get(`/months/${month}/expenses?limit=${limit}&page=${page}`);
  }
}

export default new MonthDataService();
