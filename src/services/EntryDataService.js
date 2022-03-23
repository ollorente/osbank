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
    return await http.get(`/entries/${entry}?_expand=month`);
  }

  /**
   * @param {number} l
   * @param {number} p
   */
  async list(l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return await http.get(
      `/entries?isActive=true&limit=${limit}&page=${page}&sort=createdAt&order=desc&_expand=month`
    );
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
    return await http.patch(`/entries/${entry}`, data);
  }
}

export default new EntryDataService();
