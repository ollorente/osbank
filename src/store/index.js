import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      token: null,
      user: null,
    };
  },
  actions: {
    currentUser({ commit }) {
      const user = sessionStorage.getItem("user");

      commit("SET_CURRENT_USER", user);
    },
    currentToken({ commit }) {
      const token = localStorage.getItem("token");

      commit("SET_CURRENT_TOKEN", token);
    },
  },
  mutations: {
    SET_CURRENT_USER(state, payload) {
      state.user = payload;
    },
    SET_CURRENT_TOKEN(state, payload) {
      state.token = payload;
    },
  },
});

export default store;
