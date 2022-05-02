// @ts-check
import http from './http-common'

class ItemDataService {
  /**
   * @param {any} data
   */
  async create (data) {
    return await http.post('/items', data)
  }

  /**
   * @param {string} item
   */
  async get (item) {
    return await http.get(`/items/${item}`)
  }

  /**
   * @param {number} l
   * @param {number} p
   */
  async list (l, p) {
    const limit = l ?? 10
    const page = p ?? 1

    return await http.get(
      `/items?limit=${limit}&page=${page}&sort=name&order=asc`
    )
  }

  /**
   * @param {string} item
   */
  async remove (item) {
    return await http.delete(`/items/${item}`)
  }

  /**
   * @param {string} item
   * @param {any} data
   */
  async update (item, data) {
    return await http.patch(`/items/${item}`, data)
  }

  /**
   * @param {string} item
   * @param {number} l
   * @param {number} p
   */
  async estimates (item, l, p) {
    const limit = l ?? 10
    const page = p ?? 1

    return await http.get(
      `/items/${item}/estimates?limit=${limit}&page=${page}&sort=name&order=asc`
    )
  }

  /**
   * @param {string} item
   * @param {number} l
   * @param {number} p
   */
  async expenses (item, l, p) {
    const limit = l ?? 10
    const page = p ?? 1

    return await http.get(
      `/items/${item}/expenses?isActive=true&_limit=${limit}&_page=${page}&_sort=name&_order=asc`
    )
  }
}

export default new ItemDataService()
