// @ts-check
import http from "./http-common";

class EstimateDataService {
  /**
   * @param {any} data
   */
  create(data) {
    return http.post(`/estimates`, data);
  }

  /**
   * @param {any} estimate
   */
  get(estimate) {
    return http.get(`/estimates/${estimate}`);
  }

  /**
   * @param {number} l
   * @param {number} p
   */
  list(l, p) {
    const limit = l ?? 10;
    const page = p ?? 1;

    return http.get(`/estimates?limit=${limit}&page=${page}`);
  }

  /**
   * @param {any} estimate
   */
  remove(estimate) {
    return http.delete(`/estimates/${estimate}`);
  }

  /**
   * @param {any} estimate
   * @param {any} data
   */
  update(estimate, data) {
    return http.put(`/estimates/${estimate}`, data);
  }
}

export default new EstimateDataService();
