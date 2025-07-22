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
    taskList: [
      {
        key: "1",
        project_name: "123123123",
        selected: false,
        position: "epic",
        task: "MF111-1",
        sub_task: "sdf",
        description: "TO DO",
        groups: "",
        architecture: "",
        isEditing: false,
        isNew: false,
      },
      {
        key: "2",
        project_name: "123123123",
        selected: false,
        position: "task",
        task: "MF111-2",
        sub_task: "123wwd",
        description: "TO DO",
        groups: "",
        architecture: "",
        isEditing: false,
        isNew: false,
      },
      {
        key: "3",
        project_name: "123123123",
        selected: false,
        position: "task",
        task: "MF111-3",
        sub_task: "gfjghfg",
        description: "IN PROGRESS",
        groups: "",
        architecture: "",
        isEditing: false,
        isNew: false,
      },
      {
        key: "4",
        project_name: "123123123",
        selected: false,
        position: "task",
        task: "MF111-4",
        sub_task: "132",
        description: "IN PROGRESS",
        groups: "",
        architecture: "",
        isEditing: false,
        isNew: false,
      },
    ],
  }),
  actions: {
    setTasks (payload) {
      this.taskList = payload;
    },
    addTask (payload) {
      this.taskList.push(payload);
    },
    deleteTasks(payload) {
      this.taskList = this.taskList.filter(item => item.ID !== payload);
    }
  }
})