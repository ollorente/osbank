import gql from 'graphql-tag'
import { provider } from "./apollo.provider"

class EstimateProvider {
  async create(data) {
    const estimate = gql `
      mutation {
        estimateCreate(input: data) {
          id
          name
          amount
          itemId
          monthId
          year
          isActive
          createdAt
          updatedAt
        }
      }
    `

    return await estimate
  }

  async get(id) {
    const data = gql ``

    return await provider.defaultClient.mutate({})
  }

  async list(l, p) {
    const data = gql ``

    return await provider.defaultClient.mutate({})
  }

  async remove(id) {
    const data = gql ``

    return await provider.defaultClient.mutate({})
  }

  async update(id, data) {
    const data = gql ``

    return await provider.defaultClient.mutate({})
  }
}

export default new EstimateProvider();