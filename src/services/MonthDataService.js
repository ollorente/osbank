// @ts-check
import http from "./http-common";

class MonthDataService {
  /**
   * @param {any} data
   */
  create(data) {
    return http.post(`/months`, data);
  }

  /**
   * @param {any} month
   */
  get(month) {
    return http.get(`/months/${month}`);
  }

  /**
   * @param {number} l
   * @param {number} p
   */
  list(l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return http.get(`/months?limit=${limit}&page=${page}`);
  }

  /**
   * @param {any} month
   */
  remove(month) {
    return http.delete(`/months/${month}`);
  }

  /**
   * @param {any} month
   * @param {any} data
   */
  update(month, data) {
    return http.put(`/months/${month}`, data);
  }
}

export default new MonthDataService();
