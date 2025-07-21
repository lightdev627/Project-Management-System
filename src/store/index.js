import { createStore } from "vuex";

export default createStore({
  state: {
    user: null,
    siteUsers: [],
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setSiteUsers(state, payload) {
      state.siteUsers = payload;
    },
  },
  actions: {},
  getters: {},
});