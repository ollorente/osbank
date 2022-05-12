// @ts-check
import { FETCH } from './http-common'

class EntryDataService {
  async create (data) {
    // @ts-ignore
    return await FETCH({
      query: `mutation CreateEntry($input: EntryCreateInput!) {
        entryCreate(input: $input) {
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
      query: `query getEntry($id: ID!) {
        entry(id: $id) {
          id
          amount
          detail
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
      query: `query GetEntries($options: Options) {
        entries(options: $options) {
          id
          amount
          detail
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
      query: `mutation RemoveEntry($id: ID!) {
        entryRemove(id: $id)
      }`,
      variables: {
        id: id
      }
    })
  }

  async update (id, data) {
    // @ts-ignore
    return await FETCH({
      query: `mutation UpdateEntry($id: ID!, $input: EntryUpdateInput!) {
        entryUpdate(id: $id, input: $input) {
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
      query: `query GetEntriesByName($id: String!, $options: Options) {
        entriesByName(id: $id, options: $options) {
          id
          amount
          detail
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

export default new EntryDataService()
