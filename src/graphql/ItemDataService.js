// @ts-check
import { FETCH } from './http-common'

class ItemDataService {
  async create (data) {
    // @ts-ignore
    return await FETCH({
      query: `mutation CreateItem($input: ItemCreateInput!) {
        itemCreate(input: $input) {
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
      query: `query GetItem($id: ID!) {
        item(id: $id) {
          id
          name
          icon
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
      query: `query GetItem($options: Options) {
        items(options: $options) {
          id
          name
          icon
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
      query: `mutation RemoveItem($id: ID!) {
        itemRemove(id: $id)
      }`,
      variables: {
        id: id
      }
    })
  }

  async update (id, data) {
    // @ts-ignore
    return await FETCH({
      query: `mutation UpdateItem($id: ID!, $input: ItemUpdateInput!) {
        itemUpdate(id: $id, input: $input) {
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
      query: `query GetItemsByName($id: String!, $options: Options) {
        itemsByName(id: $id, options: $options) {
          id
          name
          icon
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

export default new ItemDataService()
