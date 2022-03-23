// @ts-check
import http from "./http-common";

class TotalDataService {
  /**
   * @param {any} data
   */
  async create(data) {
    return await http.post(`/totals`, data);
  }

  /**
   * @param {string} total
   */
  async get(total) {
    return await http.get(`/totals/${total}`);
  }

  /**
   * @param {string} total
   */
  async remove(total) {
    return await http.delete(`/totals/${total}`);
  }

  /**
   * @param {string} total
   * @param {any} data
   */
  async update(total, data) {
    return await http.patch(`/totals/${total}`, data);
  }
}

export default new TotalDataService();
