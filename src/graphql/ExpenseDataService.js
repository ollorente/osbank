// @ts-check
import { FETCH } from './http-common'

class ExpenseDataService {
  async create (data) {
    // @ts-ignore
    return await FETCH({
      query: `mutation CreateExpense($input: ExpenseCreateInput!) {
        expenseCreate(input: $input) {
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
      query: `query GetExpense($id: ID!) {
       expense(id: $id) {
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
      query: `query GetExpense($options: Options) {
        expenses(options: $options) {
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
      query: `mutation RemoveExpense($id: ID!) {
        expenseRemove(id: $id)
      }`,
      variables: {
        id: id
      }
    })
  }

  async update (id, data) {
    // @ts-ignore
    return await FETCH({
      query: `mutation UpdateExpense($id: ID!, $input: ExpenseUpdateInput!) {
       expenseUpdate(id: $id, input: $input) {
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
      query: `query GetExpense($id: String!, $options: Options) {
        expensesByName(id: $id, options: $options) {
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

export default new ExpenseDataService()
