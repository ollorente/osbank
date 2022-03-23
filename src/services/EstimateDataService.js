// @ts-check
import http from "./http-common";

class EstimateDataService {
  /**
   * @param {any} data
   */
  async create(data) {
    return await http.post(`/estimates`, data);
  }

  /**
   * @param {string} estimate
   */
  async get(estimate) {
    return await http.get(`/estimates/${estimate}`);
  }

  /**
   * @param {number} l
   * @param {number} p
   */
  async list(l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return await http.get(
      `/estimates?isActive=true&limit=${limit}&page=${page}&sort=year&sort=monthId&order=asc`
    );
  }

  /**
   * @param {string} estimate
   */
  async remove(estimate) {
    return await http.delete(`/estimates/${estimate}`);
  }

  /**
   * @param {string} estimate
   * @param {any} data
   */
  async update(estimate, data) {
    return await http.put(`/estimates/${estimate}`, data);
  }
}

export default new EstimateDataService();
