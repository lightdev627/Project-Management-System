<template>
  <q-card class="daily-tasks-body">
    <!-- Header Bar with Datepicker -->
    <div class="kanban-header-bar">
      <button
        class="kanban-create-btn kanban-create-btn-large"
        @click="addBoard"
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
            <span v-if="column.tasks.length" class="kanban-count">{{
              column.tasks.length
            }}</span>
          </div>
          <div class="kanban-header-right">
            <q-btn flat dense round icon="add" @click="toggleAddTask(colIdx)" />
            <q-btn flat dense round icon="delete" @click="deleteBoard(colIdx)" />
          </div>
        </div>

        <div>
          <div v-if="column.showingAddTask" class="kanban-add-task-inline">
            <div class="kanban-add-task-select-row">
              <select
                v-model="column.selectedTaskId"
                class="kanban-add-task-select"
                style="width: 180px"
              >
                <option value="">Select a task...</option>
                <option
                  v-for="task in availableTasks"
                  :key="task.id"
                  :value="task.id"
                >
                  {{ task.title }} ({{ task.code }})
                </option>
              </select>
            </div>
            <div class="kanban-add-task-buttons">
              <button
                class="kanban-add-task-confirm-btn"
                @click="confirmAddTask(colIdx)"
                :disabled="!column.selectedTaskId"
              >
                Add
              </button>
              <button
                class="kanban-add-task-cancel-btn"
                @click="cancelAddTask(colIdx)"
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
            @end="onDragEnd"
          >
            <template #item="{ element: task, index }">
              <div class="kanban-card">
                <div class="kanban-card-title-row">
                  <span class="kanban-card-title">{{ task.title }}</span>
                  <q-btn flat dense round icon="delete" color="negative" @click="deleteTask(colIdx, index)" />
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
</template>

<script setup>
import {
  reactive,
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick,
  computed,
} from "vue";
import draggable from "vuedraggable";

const boardTitleInputs = ref([]);
const selectedDate = ref(new Date().toISOString().substr(0, 10));

const columns = reactive([
  {
    id: "todo",
    title: "TO DO",
    editing: false,
    tasks: [],
    showingAddTask: false,
    selectedTaskId: "",
    menu: false, // Added for Quasar menu
  },
  {
    id: "inprogress",
    title: "IN PROGRESS",
    editing: false,
    tasks: [],
    showingAddTask: false,
    selectedTaskId: "",
    menu: false, // Added for Quasar menu
  },
  {
    id: "done",
    title: "DONE",
    editing: false,
    tasks: [],
    showingAddTask: false,
    selectedTaskId: "",
    menu: false, // Added for Quasar menu
  },
]);

// Master list of all possible tasks
const allTasks = [
  { id: 1, title: "Design UI", code: "T-101" },
  { id: 2, title: "Setup Backend", code: "T-102" },
  { id: 3, title: "Write Docs", code: "T-103" },
  { id: 4, title: "Testing", code: "T-104" },
  { id: 5, title: "Testing1", code: "T-104" },
  { id: 6, title: "Testing2", code: "T-104" },
  { id: 7, title: "Testing3", code: "T-104" },
  { id: 8, title: "Testing4", code: "T-104" },
];

// Computed: tasks not present in any board
const availableTasks = computed(() => {
  const usedIds = new Set();
  columns.forEach((col) => {
    col.tasks.forEach((task) => usedIds.add(task.id));
  });
  return allTasks.filter((task) => !usedIds.has(task.id));
});

// Add Board
function addBoard() {
  const newId = `board-${Date.now()}`;
  columns.push({
    id: newId,
    title: "New Board",
    editing: false,
    tasks: [],
    showingAddTask: false,
    selectedTaskId: "",
    menu: false, // Added for Quasar menu
  });
}
function deleteBoard(colIdx) {
  if (columns.length > 1) columns.splice(colIdx, 1);
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

// Inline Add Task Logic
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

  const task = allTasks.find((t) => t.id === columns[colIdx].selectedTaskId);
  if (task) {
    // Prevent duplicate in the same board (shouldn't happen due to filtering, but safe)
    const exists = columns[colIdx].tasks.some((t) => t.id === task.id);
    if (!exists) {
      columns[colIdx].tasks.push({
        ...task,
      });
    }
  }

  // Reset the add task form
  columns[colIdx].showingAddTask = false;
  columns[colIdx].selectedTaskId = "";
}

function cancelAddTask(colIdx) {
  columns[colIdx].showingAddTask = false;
  columns[colIdx].selectedTaskId = "";
}

function deleteTask(colIdx, taskIdx) {
  columns[colIdx].tasks.splice(taskIdx, 1);
}

function onDragEnd() {
  // Optionally show a message or handle persistence
}

// End editing on outside click (only for board titles now)
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
</script>

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
  display: flex;
  gap: 2rem;
  padding: 2rem 1rem 1rem 1rem;
  background: #fff; /* white background */
  min-height: 80vh;
  overflow-x: auto;
  overflow-y: visible;
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
</style>
