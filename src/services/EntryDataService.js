// @ts-check
import http from "./http-common";

class EntryDataService {
  /**
   * @param {any} data
   */
  create(data) {
    return http.post(`/entries`, data);
  }

  /**
   * @param {any} entry
   */
  get(entry) {
    return http.get(`/entries/${entry}`);
  }

  /**
   * @param {number} l
   * @param {number} p
   */
  list(l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return http.get(`/entries?isActive=true&_limit=${limit}&_page=${page}&_sort=createdAt&_order=desc&_expand=month`);
  }

  /**
   * @param {any} entry
   */
  remove(entry) {
    return http.delete(`/entries/${entry}`);
  }

  /**
   * @param {any} entry
   * @param {any} data
   */
  update(entry, data) {
    return http.put(`/entries/${entry}`, data);
  }
}

export default new EntryDataService();
