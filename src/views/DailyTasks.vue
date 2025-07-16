
<template>
  <div>
    <!-- Header Bar with only Add Board Button -->
    <div class="kanban-header-bar">
      <div class="kanban-header-actions">
        <button class="kanban-create-btn kanban-create-btn-small kanban-add-board-btn" @click="addBoard">
          <span class="plus">+</span>
        </button>
      </div>
    </div>
    <!-- Datepicker centered above the board -->
    <div class="kanban-datepicker-row">
      <input type="date" v-model="selectedDate" class="kanban-datepicker" />
    </div>
    <div class="kanban-board">
      <div class="kanban-column" v-for="(column, colIdx) in columns" :key="column.id">
        <div class="kanban-header">
          <span v-if="!column.editing" class="kanban-title" @click="editBoardTitle(colIdx)">{{ column.title }}</span>
          <input v-else v-model="column.title" @blur="saveBoardTitle(colIdx)" @keyup.enter="saveBoardTitle(colIdx)" class="kanban-title-input" />
          <span v-if="column.tasks.length" class="kanban-count">{{ column.tasks.length }}</span>
          <span v-if="column.id === 'done'" class="kanban-done-check">✔️</span>
          <a-dropdown trigger="click">
            <a class="ant-dropdown-link" @click.prevent>
              <span style="font-size: 18px; margin-left: 8px;">⋮</span>
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="editBoardTitle(colIdx)">Edit Title</a-menu-item>
                <a-menu-item @click="deleteBoard(colIdx)" v-if="columns.length > 1">Delete Board</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
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
                <span v-if="!task.editing" class="kanban-card-title" @click="editTask(colIdx, index)">{{ task.title }}</span>
                <input v-else v-model="task.title" @blur="saveTaskEdit(colIdx, index)" @keyup.enter="saveTaskEdit(colIdx, index)" class="kanban-title-input" />
                <a-dropdown trigger="click">
                  <a class="ant-dropdown-link" @click.prevent>
                    <span style="font-size: 18px; margin-left: 8px;">⋮</span>
                  </a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="editTask(colIdx, index)">Edit</a-menu-item>
                      <a-menu-item @click="deleteTask(colIdx, index)">Delete</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
              <div class="kanban-card-meta">
                <span v-if="!task.editing" class="kanban-card-id">{{ task.code }}</span>
                <input v-else v-model="task.code" @blur="saveTaskEdit(colIdx, index)" @keyup.enter="saveTaskEdit(colIdx, index)" class="kanban-title-input" style="width: 80px; margin-left: 8px;" />
              </div>
            </div>
          </template>
        </draggable>
        <div class="kanban-add-task-inline">
          <button class="kanban-create-btn kanban-add-task-btn" @click="toggleAddTask(colIdx)">
            <span class="plus">+</span> Add Task
          </button>
          <div v-if="column.showAddTask" class="kanban-add-task-select-row">
            <select v-model="column.selectedTaskId" class="kanban-add-task-select">
              <option v-for="task in availableTasks" :key="task.id" :value="task.id">{{ task.title }} ({{ task.code }})</option>
            </select>
            <button class="kanban-create-btn kanban-add-task-confirm-btn" @click="confirmAddTaskInline(colIdx)">Add</button>
            <button class="kanban-create-btn kanban-add-task-cancel-btn" @click="toggleAddTask(colIdx)">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import draggable from 'vuedraggable'
import { message, Modal } from 'ant-design-vue'

const selectedDate = ref(new Date().toISOString().substr(0, 10))

const columns = reactive([
  {
    id: 'todo',
    title: 'TO DO',
    editing: false,
    tasks: [],
  },
  {
    id: 'inprogress',
    title: 'IN PROGRESS',
    editing: false,
    tasks: [],
  },
  {
    id: 'done',
    title: 'DONE',
    editing: false,
    tasks: [],
  },
])

// Temporary task list for selection
const availableTasks = ref([
  { id: 1, title: 'Design UI', code: 'T-101' },
  { id: 2, title: 'Setup Backend', code: 'T-102' },
  { id: 3, title: 'Write Docs', code: 'T-103' },
  { id: 4, title: 'Testing', code: 'T-104' },
])

// Add Board
function addBoard() {
  const newId = `board-${Date.now()}`
  columns.push({ id: newId, title: 'New Board', editing: false, tasks: [] })
}
function deleteBoard(colIdx) {
  if (columns.length > 1) columns.splice(colIdx, 1)
}
function editBoardTitle(colIdx) {
  columns[colIdx].editing = true
}
function saveBoardTitle(colIdx) {
  columns[colIdx].editing = false
}

// Task Editing
function editTask(colIdx, taskIdx) {
  columns[colIdx].tasks[taskIdx].editing = true
}
function saveTaskEdit(colIdx, taskIdx) {
  columns[colIdx].tasks[taskIdx].editing = false
}
function deleteTask(colIdx, taskIdx) {
  columns[colIdx].tasks.splice(taskIdx, 1)
}

// Add Task Modal Logic
const addTaskModalVisible = ref(false)
const addTaskTargetColIdx = ref(null)
const selectedTaskId = ref(null)

function openAddTaskModal(colIdx) {
  addTaskTargetColIdx.value = colIdx
  selectedTaskId.value = availableTasks.value.length ? availableTasks.value[0].id : null
  addTaskModalVisible.value = true
}
function confirmAddTask() {
  if (selectedTaskId.value == null) return
  const task = availableTasks.value.find(t => t.id === selectedTaskId.value)
  if (task && addTaskTargetColIdx.value !== null) {
    // Prevent duplicate in the same board
    const exists = columns[addTaskTargetColIdx.value].tasks.some(t => t.id === task.id)
    if (!exists) {
      columns[addTaskTargetColIdx.value].tasks.push({ ...task, editing: false })
    }
  }
  addTaskModalVisible.value = false
  addTaskTargetColIdx.value = null
  selectedTaskId.value = null
}
function cancelAddTask() {
  addTaskModalVisible.value = false
  addTaskTargetColIdx.value = null
  selectedTaskId.value = null
}

function onDragEnd() {
  // Optionally show a message or handle persistence
}
</script>

<style lang="scss">
.kanban-header-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1.5rem 2rem 0 2rem;
}
.kanban-header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.kanban-datepicker-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.5rem 0 0.5rem 0;
}
.kanban-datepicker {
  font-size: 1rem;
  padding: 0.3rem 0.7rem;
  border-radius: 0.5rem;
  border: 1px solid #bbdefb;
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
.kanban-add-board-btn {
  margin-left: 0.5rem;
}
.kanban-board {
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  justify-content: center;
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
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  color: #1976d2;
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
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.kanban-add-task-btn {
  background: #e3f2fd;
  color: #1976d2;
  border: none;
  border-radius: 0.7rem;
  padding: 0.5rem 1.1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: none;
  &:hover {
    background: #bbdefb;
  }
  .plus {
    font-size: 1.3rem;
    font-weight: 700;
  }
}
.kanban-add-task-select-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.kanban-add-task-select {
  font-size: 1rem;
  padding: 0.3rem 0.7rem;
  border-radius: 0.5rem;
  border: 1px solid #e3f2fd;
}
.kanban-add-task-confirm-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.3rem 0.9rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #1565c0;
  }
}
.kanban-add-task-cancel-btn {
  background: #f5faff;
  color: #1976d2;
  border: none;
  border-radius: 0.5rem;
  padding: 0.3rem 0.9rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
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