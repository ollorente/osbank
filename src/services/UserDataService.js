// @ts-check
import http from "./http-common";

class UserDataService {
  /**
   * @param {any} data
   */
  async auth(data) {
    return await http.post(`/users/auth`, data);
  }

  /**
   * @param {any} data
   */
  async create(data) {
    return await http.post(`/users`, data);
  }

  /**
   * @param {String} user
   */
  async get(user) {
    return await http.get(`/users`);
  }

  /**
   * @param {number} l
   * @param {number} p
   */
  async list(l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return await http.get(`/users/all?limit=${limit}&page=${page}`);
  }

  async remove() {
    return await http.delete(`/users`);
  }

  /**
   * @param {any} data
   */
  async update(data) {
    return await http.put(`/users`, data);
  }

  /**
   * @param {String} user
   * @param {number} l
   * @param {number} p
   */
  async entries(user, l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return await http.get(`/users/${user}/entries?limit=${limit}&page=${page}`);
  }

  /**
   * @param {String} user
   * @param {number} l
   * @param {number} p
   */
  async estimates(user, l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return await http.get(`/users/${user}/estimates?limit=${limit}&page=${page}`);
  }

  /**
   * @param {String} user
   * @param {number} l
   * @param {number} p
   */
  async expenses(user, l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return await http.get(`/users/${user}/expenses?limit=${limit}&page=${page}`);
  }

  /**
   * @param {String} user
   * @param {number} l
   * @param {number} p
   */
  async items(user, l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return await http.get(`/users/${user}/items?limit=${limit}&page=${page}`);
  }
}

export default new UserDataService();
