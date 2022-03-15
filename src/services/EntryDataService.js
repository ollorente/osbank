// @ts-check
import http from "./http-common";

class EntryDataService {
  /**
   * @param {any} data
   */
  async create(data) {
    return await http.post(`/entries`, data);
  }

  /**
   * @param {string} entry
   */
  async get(entry) {
    return await http.get(`/entries/${entry}`);
  }

  /**
   * @param {number} l
   * @param {number} p
   */
  async list(l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return await http.get(`/entries?isActive=true&_limit=${limit}&_page=${page}&_sort=createdAt&_order=desc&_expand=month`);
  }

  /**
   * @param {string} entry
   */
  async remove(entry) {
    return await http.delete(`/entries/${entry}`);
  }

  /**
   * @param {string} entry
   * @param {any} data
   */
  async update(entry, data) {
    return await http.put(`/entries/${entry}`, data);
  }
}

export default new EntryDataService();
