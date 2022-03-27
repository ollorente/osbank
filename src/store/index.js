// @ts-check
import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      token: null,
      user: null,
    };
  },
  getters: {
    isToken: state => state.token,
    isUser: state => state.user,
  },
  actions: {
    async auth ({ commit }, payload) {
      try {
        localStorage.setItem("token", payload);

        commit("SET_TOKEN", payload); 
      } catch (error) {
        if (error) return
      }
    },

    currentUser({ commit }) {
      const user = sessionStorage.getItem("user");

      commit("SET_CURRENT_USER", user);
    },

    currentToken({ commit }) {
      const token = localStorage.getItem("token") ? true : false;

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
    SET_TOKEN: (state, token) => (state.token, token),
  },
});

export default store;
