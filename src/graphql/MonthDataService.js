// @ts-check
import { FETCH } from './http-common'

class MonthDataService {
  async create (data) {
    // @ts-ignore
    return await FETCH({
      query: `mutation CreateMonth($input: MonthCreateInput!) {
        monthCreate(input: $input) {
          id
        }
      }`,
      variables: {
        input: data
      }
    })
  }

  async get (id) {
    // @ts-ignore
    return await FETCH({
      query: `query GetMonth($id: ID!) {
        month(id: $id) {
          id
          name
          order
          start
          end
          isActive
          createdAt {
            _
          }
          updatedAt {
            _
          }
        }
      }`,
      variables: {
        id: id
      }
    })
  }

  async list (data) {
    // @ts-ignore
    return await FETCH({
      query: `query GetMonths($options: Options) {
        months(options: $options) {
          name
          order
        }
      }`,
      variables: {
        options: {
          limit: data.limit,
          page: data.page
        }
      }
    })
  }

  async remove (id) {
    // @ts-ignore
    return await FETCH({
      query: `mutation removeMonth($id: ID!) {
        monthRemove(id: $id)
      }`,
      variables: {
        id: id
      }
    })
  }

  async update (id, data) {
    // @ts-ignore
    return await FETCH({
      query: `mutation UpdateMonth($id: ID!, $input: MonthUpdateInput!) {
        monthUpdate(id: $id, input: $input) {
          name
          order
        }
      }`,
      variables: {
        id: id,
        input: data
      }
    })
  }
}

export default new MonthDataService()
