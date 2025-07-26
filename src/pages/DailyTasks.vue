<script setup>
import {
  reactive,
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick,
  computed,
  watch
} from "vue";
import draggable from "vuedraggable";

import { useDailytaskStore } from "../store";
import { getItem } from "../actions/getItem";
import { addItem } from "../actions/addItem";
import { deleteItem } from "../actions/deleteItem";
import { editItem } from "../actions/editItem";
import LoadingSpinner from "../components/LoadingSpinner.vue";

const dailytaskStore = useDailytaskStore();

const boardTitleInputs = ref([]);
const selectedDate = ref(new Date().toISOString().substr(0, 10));

const defaultColumns = [
  {
    id: "todo",
    title: "TO DO",
    editing: false,
    tasks: [],
    showingAddTask: false,
    selectedTaskId: "",
    menu: false,
  },
  {
    id: "inprogress",
    title: "IN PROGRESS",
    editing: false,
    tasks: [],
    showingAddTask: false,
    selectedTaskId: "",
    menu: false,
  },
  {
    id: "done",
    title: "DONE",
    editing: false,
    tasks: [],
    showingAddTask: false,
    selectedTaskId: "",
    menu: false,
  },
];

const columns = reactive([]);

const availableSubtasks = ref([]);

const dragInfo = ref(null);
const loading = ref(true);
const miniLoading = ref({}); // { [colId]: boolean } for per-board mini spinners

onMounted(async () => {
  loading.value = true;
  const fields1 = ["ID", "date", "task_ids"];
  const fields2 = ["ID", "project_name", "phase", "task", "sub_task"];
  const fields3 = ["ID", "Title", "date", "board", "task_ids"];
  await Promise.all([
    getItem("Schedules", fields1).then(res => {
      dailytaskStore.setSchedule(res);
    }),
    getItem("Tasks", fields2).then(res => {
      dailytaskStore.setAllTasks(res);
    }),
    getItem("Boards", fields3).then(res => {
      dailytaskStore.setAllBoards(res);
    })
  ])

  if (selectedDate.value) {
    watchCallback(selectedDate.value);
  }
  loading.value = false;
});

watch(
  () => dailytaskStore.availableTasks,
  (source) => {
    availableSubtasks.value = source
  },
  {immediate: true, deep: true}
)

watch(
  () => selectedDate.value,
  (source) => {
    watchCallback(source);
  },
  {immediate: true, deep: true}
)

function watchCallback(source) {
  const scheduleItem = dailytaskStore.schedule.find(item => item.date.includes(source));
  if (scheduleItem) {
    const IDarr = scheduleItem.task_ids.split(',');
    const taskArr = IDarr.map(item => dailytaskStore.allTasks.find(each => each.ID == item).task);
    dailytaskStore.setAvailableTasks(taskArr);
  } else {

  }

  if(dailytaskStore.allBoards.length != 0) {
    if(!dailytaskStore.allBoards.find(item => item.date.includes(source))) {
      Promise.all(
        defaultColumns.map(column => {
          return addItem("Boards", {date: source, board: column.title, task_ids: ''}).then(res => {
            dailytaskStore.addBoard({ID: res.ID, date: source, board: column.title, task_ids: []})
          })
        })
      ).then(() => {
        const defaultOrder = defaultColumns.map(col => col.title);
        const newColumns = dailytaskStore.allBoards
          .filter(item => item.date.includes(source))
          .map(item => {
            return {
              id: item.ID,
              title: item.board,
              editing: false,
              tasks: Array.isArray(item.task_ids)
                ? item.task_ids
                : (item.task_ids ? item.task_ids.split(',').filter(Boolean).map(id => {
                    const task = dailytaskStore.allTasks.find(t => t.ID == id);
                    return task ? { id: task.ID, title: task.sub_task, code: task.phase } : { id };
                  }) : []),
              showingAddTask: false,
              selectedTaskId: "",
              menu: false
            }
          })
          .sort((a, b) => defaultOrder.indexOf(a.title) - defaultOrder.indexOf(b.title));
        columns.splice(0, columns.length, ...newColumns);
      })
    } else {
      const defaultOrder = defaultColumns.map(col => col.title);
      const newColumns = dailytaskStore.allBoards
        .filter(item => item.date.includes(source))
        .map(item => {
          return {
            id: item.ID,
            title: item.board,
            editing: false,
            tasks: Array.isArray(item.task_ids)
              ? item.task_ids
              : (item.task_ids ? item.task_ids.split(',').filter(Boolean).map(id => {
                  const task = dailytaskStore.allTasks.find(t => t.ID == id);
                  return task ? { id: task.ID, title: task.sub_task, code: task.phase } : { id };
                }) : []),
            showingAddTask: false,
            selectedTaskId: "",
            menu: false
          }
        })
        .sort((a, b) => defaultOrder.indexOf(a.title) - defaultOrder.indexOf(b.title));
      columns.splice(0, columns.length, ...newColumns);
    }
  }
}

const availableTasks = computed(() => {
  const usedIds = new Set();
  columns.forEach((col) => {
    col.tasks.forEach((task) => usedIds.add(task.id));
  });
  return availableSubtasks.value.filter((task) => !usedIds.has(task.id));
});

function addBoard() {
  loading.value = true;
  addItem("Boards", {date: selectedDate.value, board: "New Board", task_ids: ''}).then(res => {
    dailytaskStore.addBoard({ID: res.ID, date: selectedDate.value, board: "New Board", task_ids: []});
    columns.push({
      id: res.ID,
      title: "New Board",
      editing: false,
      tasks: [],
      showingAddTask: false,
      selectedTaskId: "",
      menu: false,
    });
  }).finally(() => {
    loading.value = false;
  });
}
function deleteBoard(colIdx) {
  if (columns.length > 1) {
    const colId = columns[colIdx].id;
    miniLoading.value[colId] = true;
    deleteItem("Boards", [colId]).then(res => {
      columns.splice(colIdx, 1);
    }).finally(() => {
      miniLoading.value[colId] = false;
    });
  }
}

function saveBoardTitle(colIdx) {
  columns[colIdx].editing = false;
}

function startEditTitle(colIdx) {
  columns[colIdx].editing = true;
  nextTick(() => {
    const input = boardTitleInputs.value[colIdx];
    if (input) {
      input.focus();
      input.select();
    }
  });
}

function toggleAddTask(colIdx) {
  columns[colIdx].showingAddTask = !columns[colIdx].showingAddTask;
  if (columns[colIdx].showingAddTask) {
    columns[colIdx].selectedTaskId = availableTasks.value.length
      ? availableTasks.value[0].id
      : "";
  }
}

function confirmAddTask(colIdx) {
  if (!columns[colIdx].selectedTaskId) return;

  const task = availableSubtasks.value.find((t) => t.id === columns[colIdx].selectedTaskId);
  if (task) {
    const exists = columns[colIdx].tasks.some((t) => t.id === task.id);
    if (!exists) {
      columns[colIdx].tasks.push({
        ...task,
      });
      const colId = columns[colIdx].id;
      miniLoading.value[colId] = true;
      editItem("Boards", colId, { task_ids: columns[colIdx].tasks.map(item => item.id).join(',') })
        .then(res => {
          dailytaskStore.updateBoard(colId, columns[colIdx].tasks.map(item => item.id))
        })
        .finally(() => {
          miniLoading.value[colId] = false;
        });
    }
  }

  columns[colIdx].showingAddTask = false;
  columns[colIdx].selectedTaskId = "";
}

function cancelAddTask(colIdx) {
  columns[colIdx].showingAddTask = false;
  columns[colIdx].selectedTaskId = "";
}

function deleteTask(colIdx, taskIdx) {
  const colId = columns[colIdx].id;
  miniLoading.value[colId] = true;
  columns[colIdx].tasks.splice(taskIdx, 1);
  editItem("Boards", colId, { task_ids: columns[colIdx].tasks.map(item => item.id).join(',') }).then(res => {
    dailytaskStore.updateBoard(colId, columns[colIdx].tasks.map(item => item.id));
  }).finally(() => {
    miniLoading.value[colId] = false;
  });
}

function handleClickOutside(event) {
  columns.forEach((col, colIdx) => {
    if (col.editing) {
      const input = document.querySelectorAll(".kanban-title-input")[colIdx];
      if (input && !input.contains(event.target)) {
        saveBoardTitle(colIdx);
      }
    }
  });
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

function onDragStart(originColIdx) {
  return (event) => {
    dragInfo.value = {
      originColIdx,
      originBoard: columns[originColIdx],
      originTaskIdx: event.oldIndex,
      task: columns[originColIdx].tasks[event.oldIndex]
    };
  };
}
function onTaskAdd(destColIdx) {
  return (event) => {
    const origin = dragInfo.value;

    editItem("Boards", columns[origin?.originColIdx].id, {task_ids: columns[origin?.originColIdx].tasks.map(item => item.id).join(',')}).then(res => {
      dailytaskStore.updateBoard(columns[origin?.originColIdx].id, columns[origin?.originColIdx].tasks.map(item => item.id));
    })

    editItem("Boards", columns[destColIdx].id, {task_ids: columns[destColIdx].tasks.map(item => item.id).join(',')}).then(res => {
      dailytaskStore.updateBoard(columns[destColIdx].id, columns[destColIdx].tasks.map(item => item.id));
    })
  };
}
function onDragEnd(destColIdx) {
  return (event) => {
    dragInfo.value = null;
  };
}
</script>

<template>
  <LoadingSpinner :showing="loading" text="Loading daily tasks...">
    <q-card class="daily-tasks-body">
      <div class="kanban-header-bar">
        <button
          class="kanban-create-btn kanban-create-btn-large"
          @click="addBoard"
          :disabled="loading"
        >
          <span class="plus">+</span> Add Board
        </button>
        <div class="kanban-header-actions">
          <input type="date" v-model="selectedDate" class="kanban-datepicker" />
        </div>
      </div>
      <div class="kanban-board">
        <div
          class="kanban-column"
          v-for="(column, colIdx) in columns"
          :key="column.id"
        >
          <div class="kanban-header">
            <div class="kanban-header-left">
              <span
                v-if="!column.editing" class="kanban-title" @dblclick="startEditTitle(colIdx)"
                >{{ column.title }}</span>
              <input
                v-else
                :ref="el => boardTitleInputs[colIdx] = el"
                class="kanban-title-input"
                v-model="column.title"
                @blur="saveBoardTitle(colIdx)"
                @keyup.enter="saveBoardTitle(colIdx)"
                :style="{ width: '210px' }"
              />
              <span v-if="Array.isArray(column.tasks) && column.tasks.length" class="kanban-count">{{ column.tasks.length }}</span>
              <q-spinner-pie v-if="miniLoading[column.id]" size="18px" color="primary" class="mini-spinner" />
            </div>
            <div class="kanban-header-right">
              <q-btn flat dense round icon="add" @click="toggleAddTask(colIdx)" :disable="miniLoading[column.id]" />
              <q-btn flat dense round icon="delete" @click="deleteBoard(colIdx)" :disable="miniLoading[column.id]" />
            </div>
          </div>

          <div>
            <div v-if="column.showingAddTask" class="kanban-add-task-inline">
              <div class="kanban-add-task-select-row">
                <select
                  v-model="column.selectedTaskId"
                  class="kanban-add-task-select"
                >
                  <option value="">Select a task...</option>
                  <option
                    v-for="task in availableTasks"
                    :key="task.id"
                    :value="task.id"
                    :title="task.title"
                  >
                    {{ task.title.length > 25 ? task.title.slice(0, 25) + '…' : task.title }} ({{ task.code }})
                  </option>
                </select>
              </div>
              <div class="kanban-add-task-buttons">
                <button
                  class="kanban-add-task-confirm-btn"
                  @click="confirmAddTask(colIdx)"
                  :disabled="!column.selectedTaskId || miniLoading[column.id]"
                >
                  Add
                </button>
                <button
                  class="kanban-add-task-cancel-btn"
                  @click="cancelAddTask(colIdx)"
                  :disabled="miniLoading[column.id]"
                >
                  Cancel
                </button>
              </div>
            </div>

            <draggable
              v-model="column.tasks"
              group="tasks"
              :animation="200"
              item-key="id"
              class="kanban-tasks"
              @start="(event) => onDragStart(colIdx)(event)"
              @add="(event) => onTaskAdd(colIdx)(event)"
              @end="(event) => onDragEnd(colIdx)(event)"
            >
              <template #item="{ element: task, index }">
                <div class="kanban-card">
                  <div class="kanban-card-title-row">
                    <span class="kanban-card-title" :title="task.title">{{ task.title }}</span>
                    <q-btn flat dense round icon="delete" color="negative" @click="deleteTask(colIdx, index)" :disable="miniLoading[column.id]" />
                  </div>
                  <div class="kanban-card-meta">
                    <span class="kanban-card-id">{{ task.code }}</span>
                  </div>
                </div>
              </template>
              <template #footer>
                <div v-if="!column.tasks.length" class="kanban-empty-placeholder">
                  Drop tasks here
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </q-card>
  </LoadingSpinner>
</template>

<style lang="scss" scoped>
.daily-tasks-body {
  margin: 2rem;
  padding: 1rem;
  background: #ffffff;
  min-height: 80vh;
  border-radius: 15px;
}
.kanban-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem 0 2rem;
}
.kanban-add-board-bar {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 0 2rem 2rem;
}
.kanban-board {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  display: flex;
  gap: 2rem;
  padding: 2rem 1rem 1rem 1rem;
  background: #fff;
  min-height: 80vh;
  white-space: nowrap;
}
.kanban-column {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px 0 rgba(25, 118, 210, 0.08); /* blue shadow */
  padding: 1.5rem 1rem 2rem 1rem;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  min-height: 500px;
  max-height: 700px;
  position: relative;
  flex-shrink: 0;
}
/* Optional: Hide scrollbar for webkit browsers */
.kanban-board::-webkit-scrollbar {
  height: 10px;
}
.kanban-board::-webkit-scrollbar-thumb {
  background: #e3f2fd;
  border-radius: 5px;
}
.kanban-board::-webkit-scrollbar-track {
  background: #fff;
}
.kanban-create-btn-large {
  padding: 0.7rem 1.5rem;
  font-size: 1.1rem;
  border-radius: 0.7rem;
  cursor: pointer;
  background: #e3f2fd;
  color: #1976d2;
  border: none;
  font-weight: 700;
  box-shadow: none;
  transition: background 0.2s;
  &:hover {
    background: #bbdefb;
  }
  .plus {
    font-size: 1.3rem;
    font-weight: 700;
    margin-right: 0.5rem;
  }
}
.kanban-datepicker {
  font-size: 1rem;
  padding: 0.3rem 0.7rem;
  border-radius: 0.5rem;
  border: 1px solid #bbdefb; /* light blue */
}

.kanban-add-task-btn-small {
  padding: 0.3rem 0.7rem;
  font-size: 1.1rem;
  min-width: 0;
  width: 32px;
  cursor: pointer;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e3f2fd; /* lighter blue */
  color: #1976d2;
  border: none;
  box-shadow: none;
  transition: all 0.2s;
  &:hover {
    background: #bbdefb;
  }
  &.active {
    background: #1976d2;
    color: #fff;
  }
  .plus {
    font-size: 1.2rem;
    font-weight: 700;
  }
}
.kanban-add-board-btn {
  margin-left: 0.5rem;
}
.kanban-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  color: #1976d2;
}
.kanban-header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.kanban-header-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.kanban-title {
  letter-spacing: 1px;
  cursor: pointer;
}
.kanban-count {
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 1rem;
  padding: 0.1rem 0.7rem;
  font-size: 0.9rem;
  margin-left: 0.3rem;
}
.kanban-done-check {
  color: #1976d2;
  font-size: 1.2rem;
  margin-left: 0.5rem;
}
.kanban-tasks {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 600px;
  overflow-y: auto;
}
.kanban-card {
  background: #f5faff;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px 0 rgba(25, 118, 210, 0.04);
  padding: 1rem 1rem 0.7rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  transition: box-shadow 0.2s;
  position: relative;
  border: 1.5px solid #e3f2fd;
  &:hover {
    box-shadow: 0 6px 24px 0 rgba(25, 118, 210, 0.13);
    border-color: #1976d2;
  }
}
.kanban-card-title-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  justify-content: space-between;
}
.kanban-card-title {
  font-size: 1.08rem;
  font-weight: 600;
  color: #1976d2;
  cursor: pointer;
  display: inline-block;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
.kanban-card-meta {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 0.97rem;
  color: #1976d2;
}
.kanban-card-id {
  background: #e3f2fd;
  border-radius: 0.7rem;
  padding: 0.1rem 0.6rem;
  font-size: 0.93rem;
}
.kanban-add-task-inline {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #f8fbff;
  border-radius: 0.8rem;
  padding: 1rem;
  border: 1px solid #e3f2fd;
}
.kanban-add-task-select-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  margin-bottom: 0.8rem;
}
.kanban-add-task-select {
  font-size: 1rem;
  padding: 0.5rem 0.8rem;
  border-radius: 0.5rem;
  border: 1px solid #e3f2fd;
  width: 180px;
  background: #fff;
  color: #1976d2;
}
.kanban-add-task-buttons {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}
.kanban-add-task-confirm-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.3rem 0.9rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  flex: 1;
  &:hover {
    background: #1565c0;
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.kanban-add-task-cancel-btn {
  background: #f5faff;
  color: #1976d2;
  border: none;
  border-radius: 0.5rem;
  padding: 0.3rem 0.9rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  flex: 1;
  &:hover {
    background: #e3f2fd;
  }
}
.kanban-title-input {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1976d2;
  border: 1px solid #fde3f3;
  border-radius: 0.4rem;
  padding: 0.1rem 0.5rem;
  max-width: 180px;
}
.kanban-empty-placeholder {
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b0b0b0;
  font-style: italic;
  border: 2px dashed #e3f2fd;
  border-radius: 0.7rem;
  background: #f8fbff;
  margin: 0.5rem 0;
}
.mini-spinner {
  margin-left: 0.5rem;
  vertical-align: middle;
}
</style>
