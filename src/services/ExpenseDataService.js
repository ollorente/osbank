// @ts-check
import http from "./http-common";

class ExpenseDataService {
  /**
   * @param {any} data
   */
  async create(data) {
    return await http.post(`/expenses`, data);
  }

  /**
   * @param {string} expense
   */
  async get(expense) {
    return await http.get(`/expenses/${expense}`);
  }

  /**
   * @param {number} l
   * @param {number} p
   */
  async list(l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return await http.get(`/expenses?limit=${limit}&page=${page}`);
  }

  /**
   * @param {string} expense
   */
  async remove(expense) {
    return await http.delete(`/expenses/${expense}`);
  }

  /**
   * @param {string} expense
   * @param {any} data
   */
  async update(expense, data) {
    return await http.put(`/expenses/${expense}`, data);
  }
}

export default new ExpenseDataService();
