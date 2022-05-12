// @ts-check
import { FETCH } from './http-common'

class UserDataService {
  async auth (data) {
    // @ts-ignore
    return await FETCH({
      query: `mutation Auth($input: UserDataInput!) {
        auth(input: $input) {
          token
          user {
            id
            name
            isActive
            createdAt {
              _
            }
          }
        }
      }`,
      variables: {
        input: data
      }
    })
  }

  async me () {
    // @ts-ignore
    return await FETCH({
      query: `query Me {
        me {
          id
          phone
          name
          email
          total
          estimate
          expense
          isActive
          isLock
          createdAt {
            _
          }
          updatedAt {
            _
          }
        }
      }`,
      variables: {}
    })
  }

  async create (data) {
    // @ts-ignore
    return await FETCH({
      query: `mutation CreateUser($input: UserCreateInput!) {
        userCreate(input: $input) {
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
      query: `query GetUser($id: ID!) {
        user(id: $id) {
          id
          phone
          name
          email
          total
          estimate
          expense
          isActive
          isLock
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
      query: `query GetUsers($options: Options) {
        users(options: $options) {
          id
          name
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
      query: `mutation RemoveUser($id: ID!) {
        userRemove(id: $id)
      }`,
      variables: {
        id: id
      }
    })
  }

  async update (id, data) {
    // @ts-ignore
    return await FETCH({
      query: `mutation UpdateUser($id: ID!, $input: UserUpdateInput!) {
        userUpdate(id: $id, input: $input) {
          id
        }
      }`,
      variables: {
        id: id,
        input: data
      }
    })
  }
}

export default new UserDataService()
