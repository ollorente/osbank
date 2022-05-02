const token = 'Bearer ' + localStorage.getItem('token') // eslint-disable-line

const state = {
  authStatus: false,
  token: token || null,
  user: {}
}

const getters = {
  authStatus: state => state.authStatus,
  isAuth: state => !!state.token,
  user: state => state.user
}

const actions = {
  registerUser ({ commit }, userData) {
    commit('LOGIN_USER', userData)
    commit('SET_TOKEN', 'userDatatoken')
  }
}

const mutations = {
  LOGIN_USER (state, payload) {
    state.user = payload.user
    state.authStatus = true
  },
  SET_TOKEN (state, payload) {
    state.token = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
}
