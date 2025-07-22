import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    siteUserList: []
  }),
  actions: {
    setUser(payload) {
      this.currentUser = payload;
    },
    setSiteUsers(payload) {
      this.siteUserList = payload;
    },
  }
})

export const useTaskStore = defineStore('task', {
  state: () => ({
    taskList: [],
    loading: false
  }),
  actions: {
    setTasks (payload) {
      this.taskList = payload;
    },
    addTask (payload) {
      this.taskList.push(payload);
    },
    deleteTasks(payload) {
      this.taskList = this.taskList.filter(item => payload.indexOf(item.ID) === -1);
    },
    editTask (payload) {
      this.taskList.find(item => item.ID == payload.ID).project_name = payload.project_name;
      this.taskList.find(item => item.ID == payload.ID).position = payload.position;
      this.taskList.find(item => item.ID == payload.ID).task = payload.task;
      this.taskList.find(item => item.ID == payload.ID).sub_task = payload.sub_task;
      this.taskList.find(item => item.ID == payload.ID).description = payload.description;
      this.taskList.find(item => item.ID == payload.ID).groups = payload.groups;
      this.taskList.find(item => item.ID == payload.ID).architecture = payload.architecture;
    },
    setLoading(val) {
      this.loading = val;
    }
  }
})