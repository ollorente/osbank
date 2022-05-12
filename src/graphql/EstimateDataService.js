// @ts-check
import { FETCH } from './http-common'

class EstimateDataService {
  async create (data) {
    // @ts-ignore
    return await FETCH({
      query: `mutation CreateEstimate($input: EstimateCreateInput!) {
        estimateCreate(input: $input) {
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
      query: `query GetEstimate($id: ID!) {
        estimate(id: $id) {
          id
          name
          amount
          item {
            id
            name
          }
          month {
            name
            order
          }
          year
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
      query: `query GetEstimates($options: Options) {
        estimates(options: $options) {
          id
          name
          amount
          item {
            id
            name
          }
          month {
            name
            order
          }
          year
          isActive
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
      query: `mutation RemoveEstimate($id: ID!) {
        estimateRemove(id: $id)
      }`,
      variables: {
        id: id
      }
    })
  }

  async update (id, data) {
    // @ts-ignore
    return await FETCH({
      query: `mutation UpdateEstimate($id: ID!, $input: EstimateUpdateInput!) {
        estimateUpdate(id: $id, input: $input) {
          id
        }
      }`,
      variables: {
        id: id,
        input: data
      }
    })
  }

  async listByName (id, data) {
    // @ts-ignore
    return await FETCH({
      query: `query GetEstimatesByName($id: String!, $options: Options) {
        estimatesByName(id: $id, options: $options) {
          id
          name
          amount
          item {
            id
            name
          }
          month {
            name
            order
          }
          year
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
        id: id,
        options: {
          limit: data.limit,
          page: data.page
        }
      }
    })
  }
}

export default new EstimateDataService()
