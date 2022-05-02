import gql from 'graphql-tag'
import { provider } from './apollo.provider'

class EstimateProvider {
  async create (data) {
    const estimate = gql`
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

  async get (id) {
    const data = gql``

    return await provider.defaultClient.mutate(data)
  }

  async list (l, p) {
    const data = gql``

    return await provider.defaultClient.mutate(data)
  }

  async remove (id) {
    const data = gql``

    return await provider.defaultClient.mutate(data)
  }

  async update (id, info) {
    const data = gql``

    return await provider.defaultClient.mutate(data)
  }
}

export default new EstimateProvider()
