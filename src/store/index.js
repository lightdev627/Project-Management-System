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

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    total: [],
    projects: [],
    phases: [],
    tasks: [],
    sub_tasks: [],
    loading: false,
    selectedProject: "",
    selectedPhase: "",
    selectedYear: new Date().getFullYear(),
    selectedMonth: new Date().getMonth(),
    selectedWeek: null,
    scheduleData: [],
    filteredTasks: [],
    selectedTasks: [],
  }),
  actions: {
    
    setTotal (payload) {
      this.total = payload;
    },
    setProjects (payload) {
      this.projects = payload;
    },
    setPhases (payload) {
      this.phases = payload;
    },
    setTasks (payload) {
      this.tasks = payload;
    },
    setSubTasks (payload) {
      this.sub_tasks = payload;
    },
    setLoading(val) {
      this.loading = val;
    },
    setSelectedProject(project) {
      this.selectedProject = project;
      this.updateFilteredTasks();
    },
    setSelectedPhase(phase) {
      this.selectedPhase = phase;
      this.updateFilteredTasks();
    },
    setSelectedYear(year) {
      this.selectedYear = year;
    },
    setSelectedMonth(month) {
      this.selectedMonth = month;
    },
    setSelectedWeek(week) {
      this.selectedWeek = week;
    },
    updateFilteredTasks() {
      if (!this.selectedProject || !this.selectedPhase) {
        this.filteredTasks = [];
        return;
      }
      
      const filtered = this.total.filter(item => 
        item.project_name === this.selectedProject && 
        item.phase === this.selectedPhase
      );
      
      this.filteredTasks = [...new Set(filtered.map(item => item.task))];
    },
    getSubTasksForTask(taskName) {
      if (!this.selectedProject || !this.selectedPhase) {
        return [];
      }
      
      const filtered = this.total.filter(item => 
        item.project_name === this.selectedProject && 
        item.phase === this.selectedPhase &&
        item.task === taskName
      );
      
      return [...new Set(filtered.map(item => item.sub_task))];
    },
    addScheduleData(ID, date, taskIds) {
      const formatDate = new Date(date).toISOString().slice(0, 10);
      this.scheduleData.push({ ID, date: formatDate, taskIds });
    },
    editScheduleData(ID, date, taskIds) {
      this.scheduleData = this.scheduleData.filter(item => item.ID !== ID);
      const formatDate = new Date(date).toISOString().slice(0, 10);
      this.scheduleData.push({ID, date: formatDate, taskIds});
    },
    removeScheduleData(date, taskId) {
      const index = this.scheduleData.findIndex(item => 
        item.date === date && item.taskId === taskId
      );
      if (index !== -1) {
        this.scheduleData.splice(index, 1);
      }
    },
    getScheduleDataForDate(date) {
      return this.scheduleData.filter(item => item.date === date);
    },
    clearScheduleData() {
      this.scheduleData = [];
    },
    isTaskSelectedForDate(date, taskId) {
      return this.scheduleData.some(item => 
        item.date === date && item.taskId === taskId
      );
    }
  }
})

export const useTimelineStore = defineStore('timeline', {
  state: () => ({
    timelineList: []
  }),
  actions: {
    setList(payload) {
      this.timelineList = payload
    },
    addLine(payload) {
      this.timelineList.push(payload);
    },
    editLine(payload) {
      const editedLine = this.timelineList.find(item => item.ID == payload.ID);
      editedLine = payload;
    },
    deleteLine(payload) {
      this.timelineList = this.timelineList.filter(item => payload.indexOf(item.ID) === -1);
    }
  }
})

export const useSunburstStore = defineStore('sunburst', {
  state: () => ({
    progressingData: [],
    taskData: []
  }),
  actions: {
    setProgressing(payload) {
      this.progressingData = payload
    },
    setTaskData(payload) {
      this.taskData = payload
    }
  }
})

export const useDailytaskStore = defineStore('dailytask', {
  state: () => ({
    schedule: [],
    allTasks: [],
    allBoards: [],
    availableTasks: [],
  }),
  actions: {
    setAvailableTasks(payload) {
      this.availableTasks = this.allTasks.filter(item => payload.includes(item.task)).map(item => {return {id: item.ID, title: item.sub_task, code: item.phase}});
    },
    setSchedule (payload) {
      this.schedule = payload
    },
    setAllTasks(payload) {
      this.allTasks = payload
    },
    setAllBoards(payload) {
      this.allBoards = payload;
    },
    addBoard(payload) {
      this.allBoards.push(payload)
    },
    updateBoard(id, task_ids) {
      const updated = this.allBoards.find(item => item.ID == id);
      updated.task_ids = task_ids.join(',');
    }
  }
})