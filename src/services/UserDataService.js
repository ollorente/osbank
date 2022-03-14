// @ts-check
import http from "./http-common";

class UserDataService {
  /**
   * @param {any} data
   */
  auth(data) {
    return http.post(`/users/auth`, data);
  }

  /**
   * @param {any} data
   */
  create(data) {
    return http.post(`/users`, data);
  }

  /**
   * @param {any} user
   */
  get(user) {
    return http.get(`/users/${user}`);
  }

  /**
   * @param {number} l
   * @param {number} p
   */
  list(l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return http.get(`/users?limit=${limit}&page=${page}`);
  }

  /**
   * @param {any} user
   */
  remove(user) {
    return http.delete(`/users/${user}`);
  }

  /**
   * @param {any} user
   * @param {any} data
   */
  update(user, data) {
    return http.put(`/users/${user}`, data);
  }
}

export default new UserDataService();
