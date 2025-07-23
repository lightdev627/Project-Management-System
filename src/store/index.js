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
    projectList: [],
    taskList: [],
    loading: false,
    miniLoading: false
  }),
  actions: {
    setProjects(payload) {
      this.projectList = payload
    },
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
      const editedTask = this.taskList.find(item => item.ID == payload.ID);
      editedTask.project_name = payload.project_name;
      editedTask.position = payload.position;
      editedTask.task = payload.task;
      editedTask.sub_task = payload.sub_task;
      editedTask.description = payload.description;
      editedTask.groups = payload.groups;
      editedTask.architecture = payload.architecture;
    },
    setLoading(val) {
      this.loading = val;
    },
    setMiniLoading(val) {
      this.miniLoading = val;
    }
  }
})

export const useProjectStore = defineStore('project', {
  state: () => ({
    setups: [],
    currentProject: null,
    loading: false,
  }),
  actions: {
    setProjects (payload) {
      this.setups = payload;
    },
    addProject (payload) {
      this.setups.push(payload);
      this.setCurrent(payload);
    },
    deleteProject () {

    },
    setCurrent (payload) {
      this.currentProject = payload;
    },
    editCurrent(payload) {
      const temp = this.setups.find(item => item.ID == payload.ID);
      temp[payload.key] = payload.value;
      this.setCurrent(temp);
    },
    setElements (elementName, data) {
      this[elementName] = data.split(',');
    },
    addElement(elementName, data) {
      this[elementName].push(data)
    },
    deleteElement(elementName, data) {
      this[elementName] = this[elementName].filter(item => item != data);
    },
    setLoading(val) {
      this.loading = val;
    },
  }
})

export const useNoteStore = defineStore('note', {
  state: () => ({
    projectList: [],
    typeList: [],
    currentType: "",
    noteList: [],
    loading: false,
  }),
  actions: {
    setProjectList (payload) {
      this.projectList = payload
    },
    setTypeList (payload) {
      this.typeList = payload;
      this.setCurrentType(payload[0]);
    },
    setCurrentType(payload) {
      this.currentType = payload;
    },
    setNoteList(payload) {
      this.noteList = payload
    },
    addNote (payload) {
      this.noteList.unshift(payload);
    },
    editNote(payload) {
      console.log("111",payload)
      console.log(this.noteList)
      const editedNote = this.noteList.find(item => item.ID == payload.ID);
      console.log("222",editedNote)
      editedNote.content = payload.content;
      editedNote.updated_date = payload.updated_date;
      console.log("333",this.noteList)
    },
    setLoading(val) {
      this.loading = val;
    },
  }
})

