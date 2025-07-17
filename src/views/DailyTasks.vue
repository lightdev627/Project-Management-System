<template>
  <a-card bordered style="margin-bottom: 20px">
    <!-- Header Bar with Datepicker -->
    <div class="kanban-header-bar">
      <div class="kanban-header-actions">
        <input type="date" v-model="selectedDate" class="kanban-datepicker" />
      </div>
    </div>
    <div class="kanban-board">
      <!-- Add Board Button on Upper Left -->
      <div class="kanban-column kanban-add-board kanban-add-board-top">
        <button
          class="kanban-create-btn kanban-create-btn-large"
          @click="addBoard"
        >
          <span class="plus">+</span> Add Board
        </button>
      </div>
      <div
        class="kanban-column"
        v-for="(column, colIdx) in columns"
        :key="column.id"
      >
        <div class="kanban-header">
          <div class="kanban-header-left">
            <span
              v-if="!column.editing"
              class="kanban-title"
              @click="editBoardTitle(colIdx)"
              >{{ column.title }}</span
            >
            <input
              v-else
              v-model="column.title"
              ref="boardTitleInputs"
              @blur="saveBoardTitle(colIdx)"
              @keyup.enter="saveBoardTitle(colIdx)"
              class="kanban-title-input"
              @mousedown.stop
            />
            <span v-if="column.tasks.length" class="kanban-count">{{
              column.tasks.length
            }}</span>
            <span v-if="column.id === 'done'" class="kanban-done-check"
              >✔️</span
            >
          </div>
          <div class="kanban-header-right">
            <button
              class="kanban-create-btn kanban-add-task-btn-small"
              @click="toggleAddTask(colIdx)"
              :class="{ active: column.showingAddTask }"
            >
              <span class="plus">+</span>
            </button>
            <a-dropdown trigger="click">
              <a class="ant-dropdown-link" @click.prevent>
                <span style="font-size: 18px; margin-left: 8px">⋮</span>
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="editBoardTitle(colIdx)"
                    >Edit Title</a-menu-item
                  >
                  <a-menu-item
                    @click="deleteBoard(colIdx)"
                    v-if="columns.length > 1"
                    >Delete Board</a-menu-item
                  >
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>

        <!-- Inline Add Task Section -->
        <div v-if="column.showingAddTask" class="kanban-add-task-inline">
          <div class="kanban-add-task-select-row">
            <select
              v-model="column.selectedTaskId"
              class="kanban-add-task-select"
              style="width: 220px"
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
                <span
                  v-if="!task.editing"
                  class="kanban-card-title"
                  @click="editTask(colIdx, index)"
                  >{{ task.title }}</span
                >
                <input
                  v-else
                  v-model="task.title"
                  ref="taskTitleInputs"
                  @blur="saveTaskEdit(colIdx, index)"
                  @keyup.enter="saveTaskEdit(colIdx, index)"
                  class="kanban-title-input"
                  @mousedown.stop
                />
                <a-dropdown trigger="click">
                  <a class="ant-dropdown-link" @click.prevent>
                    <span style="font-size: 18px; margin-left: 8px">⋮</span>
                  </a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="editTask(colIdx, index)"
                        >Edit</a-menu-item
                      >
                      <a-menu-item @click="deleteTask(colIdx, index)"
                        >Delete</a-menu-item
                      >
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
              <div class="kanban-card-meta">
                <span v-if="!task.editing" class="kanban-card-id">{{
                  task.code
                }}</span>
                <input
                  v-else
                  v-model="task.code"
                  ref="taskCodeInputs"
                  @blur="saveTaskEdit(colIdx, index)"
                  @keyup.enter="saveTaskEdit(colIdx, index)"
                  class="kanban-title-input"
                  style="width: 80px; margin-left: 8px"
                  @mousedown.stop
                />
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </a-card>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import draggable from "vuedraggable";

const selectedDate = ref(new Date().toISOString().substr(0, 10));

const columns = reactive([
  {
    id: "todo",
    title: "TO DO",
    editing: false,
    tasks: [],
    showingAddTask: false,
    selectedTaskId: "",
  },
  {
    id: "inprogress",
    title: "IN PROGRESS",
    editing: false,
    tasks: [],
    showingAddTask: false,
    selectedTaskId: "",
  },
  {
    id: "done",
    title: "DONE",
    editing: false,
    tasks: [],
    showingAddTask: false,
    selectedTaskId: "",
  },
]);

// Temporary task list for selection
const availableTasks = ref([
  { id: 1, title: "Design UI", code: "T-101" },
  { id: 2, title: "Setup Backend", code: "T-102" },
  { id: 3, title: "Write Docs", code: "T-103" },
  { id: 4, title: "Testing", code: "T-104" },
]);

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
  });
}
function deleteBoard(colIdx) {
  if (columns.length > 1) columns.splice(colIdx, 1);
}
function editBoardTitle(colIdx) {
  columns.forEach((col, idx) => {
    if (idx !== colIdx) col.editing = false;
  });
  columns[colIdx].editing = true;
  nextTick(() => {
    const input = document.querySelectorAll(".kanban-title-input")[colIdx];
    if (input) input.focus();
  });
}
function saveBoardTitle(colIdx) {
  columns[colIdx].editing = false;
}

// Task Editing
function editTask(colIdx, taskIdx) {
  columns.forEach((col, cIdx) => {
    col.tasks.forEach((task, tIdx) => {
      if (!(cIdx === colIdx && tIdx === taskIdx)) task.editing = false;
    });
  });
  columns[colIdx].tasks[taskIdx].editing = true;
  nextTick(() => {
    const input = document.querySelectorAll(".kanban-title-input")[
      colIdx + 3 + taskIdx
    ];
    if (input) input.focus();
  });
}
function saveTaskEdit(colIdx, taskIdx) {
  columns[colIdx].tasks[taskIdx].editing = false;
}
function deleteTask(colIdx, taskIdx) {
  columns[colIdx].tasks.splice(taskIdx, 1);
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

  const task = availableTasks.value.find(
    (t) => t.id === columns[colIdx].selectedTaskId
  );
  if (task) {
    // Prevent duplicate in the same board
    const exists = columns[colIdx].tasks.some((t) => t.id === task.id);
    if (!exists) {
      columns[colIdx].tasks.push({
        ...task,
        editing: false,
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

function onDragEnd() {
  // Optionally show a message or handle persistence
}

// End editing on outside click
function handleClickOutside(event) {
  // Board titles
  columns.forEach((col, colIdx) => {
    if (col.editing) {
      const input = document.querySelectorAll(".kanban-title-input")[colIdx];
      if (input && !input.contains(event.target)) {
        saveBoardTitle(colIdx);
      }
    }
    // Tasks
    col.tasks.forEach((task, taskIdx) => {
      if (task.editing) {
        const input = document.querySelectorAll(".kanban-title-input")[
          colIdx + 3 + taskIdx
        ];
        if (input && !input.contains(event.target)) {
          saveTaskEdit(colIdx, taskIdx);
        }
      }
    });
  });
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<style lang="scss">
.kanban-header-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1.5rem 2rem 0 2rem;
}
.kanban-add-board-top {
  min-width: 220px;
  max-width: 220px;
  background: transparent;
  box-shadow: none;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0 0 2rem 0;
}
.kanban-create-btn-large {
  padding: 0.7rem 1.5rem;
  font-size: 1.1rem;
  border-radius: 0.7rem;
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
.kanban-create-btn-small {
  padding: 0.3rem 0.7rem;
  font-size: 1.1rem;
  min-width: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e3f2fd; /* lighter blue */
  color: #1976d2;
  border: none;
  box-shadow: none;
  transition: background 0.2s;
  &:hover {
    background: #bbdefb;
  }
}
.kanban-add-task-btn-small {
  padding: 0.3rem 0.7rem;
  font-size: 1.1rem;
  min-width: 0;
  width: 32px;
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
.kanban-board {
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  background: #fff; /* white background */
  min-height: 80vh;
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
  position: relative;
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
  width: 220px;
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
  border: 1px solid #e3f2fd;
  border-radius: 0.4rem;
  padding: 0.1rem 0.5rem;
}
</style>
