// @ts-check
import http from "./http-common";

class ExpenseDataService {
  /**
   * @param {any} data
   */
  create(data) {
    return http.post(`/expenses`, data);
  }

  /**
   * @param {any} expense
   */
  get(expense) {
    return http.get(`/expenses/${expense}`);
  }

  /**
   * @param {number} l
   * @param {number} p
   */
  list(l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return http.get(`/expenses?limit=${limit}&page=${page}`);
  }

  /**
   * @param {any} expense
   */
  remove(expense) {
    return http.delete(`/expenses/${expense}`);
  }

  /**
   * @param {any} expense
   * @param {any} data
   */
  update(expense, data) {
    return http.put(`/expenses/${expense}`, data);
  }
}

export default new ExpenseDataService();
