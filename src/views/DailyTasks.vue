
<template>
  <div class="kanban-board">
    <div class="kanban-column" v-for="(column, colIdx) in columns" :key="column.id">
      <div class="kanban-header">
        <span class="kanban-title">{{ column.title }}</span>
        <span v-if="column.tasks.length" class="kanban-count">{{ column.tasks.length }}</span>
        <span v-if="column.id === 'done'" class="kanban-done-check">✔️</span>
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
              <div class="kanban-card-title">{{ task.title }}</div>
              <a-avatar size="small" style="background-color: #6366f1; margin-left: auto;">
                {{ task.user }}
              </a-avatar>
              <a-dropdown>
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
              <span class="kanban-card-id">{{ task.code }}</span>
            </div>
            <div class="kanban-steps">
              <div v-for="(step, sIdx) in task.steps" :key="step.id" class="kanban-step">
                <span>{{ step.text }}</span>
                <a @click="editStep(colIdx, index, sIdx)" style="margin-left: 8px;">✏️</a>
                <a @click="deleteStep(colIdx, index, sIdx)" style="margin-left: 4px; color: #f5222d;">🗑️</a>
              </div>
              <a @click="addStep(colIdx, index)" class="kanban-add-step">+ Add Step</a>
            </div>
          </div>
        </template>
      </draggable>
      <button v-if="column.id === 'todo'" class="kanban-create-btn" @click="addTask">
        <span class="plus">+</span> Create
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import draggable from 'vuedraggable'
import { message, Modal } from 'ant-design-vue'

const columns = reactive([
  {
    id: 'todo',
    title: 'TO DO',
    tasks: [
      { id: 1, title: '123wwd', code: 'MF111-2', user: 'LD', steps: [ { id: 1, text: 'Step 1' } ] },
    ],
  },
  {
    id: 'inprogress',
    title: 'IN PROGRESS',
    tasks: [
      { id: 2, title: 'gfjghfg', code: 'MF111-3', user: 'LD', steps: [] },
      { id: 3, title: '132', code: 'MF111-4', user: 'LD', steps: [] },
    ],
  },
  {
    id: 'done',
    title: 'DONE',
    tasks: [],
  },
])

function onDragEnd() {
  // Optionally show a message or handle persistence
}

function addTask() {
  columns[0].tasks.push({
    id: Date.now(),
    title: 'New Task',
    code: `MF111-${Math.floor(Math.random()*1000)}`,
    user: 'LD',
    steps: [],
  })
}

function editTask(colIdx, taskIdx) {
  // To be implemented: open modal to edit task
}
function deleteTask(colIdx, taskIdx) {
  columns[colIdx].tasks.splice(taskIdx, 1)
}
function addStep(colIdx, taskIdx) {
  columns[colIdx].tasks[taskIdx].steps.push({ id: Date.now(), text: 'New Step' })
}
function editStep(colIdx, taskIdx, stepIdx) {
  // To be implemented: open modal to edit step
}
function deleteStep(colIdx, taskIdx, stepIdx) {
  columns[colIdx].tasks[taskIdx].steps.splice(stepIdx, 1)
}
</script>

<style lang="scss">
.kanban-board {
  display: flex;
  gap: 2rem;
  padding: 2rem 0;
  justify-content: center;
  background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
  min-height: 80vh;
}
.kanban-column {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px 0 rgba(80, 80, 180, 0.08);
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
  color: #4f46e5;
}
.kanban-title {
  letter-spacing: 1px;
}
.kanban-count {
  background: #e0e7ff;
  color: #6366f1;
  border-radius: 1rem;
  padding: 0.1rem 0.7rem;
  font-size: 0.9rem;
  margin-left: 0.3rem;
}
.kanban-done-check {
  color: #22c55e;
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
  background: #f3f4f6;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px 0 rgba(80, 80, 180, 0.04);
  padding: 1rem 1rem 0.7rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  transition: box-shadow 0.2s;
  position: relative;
  border: 1.5px solid #e0e7ff;
  &:hover {
    box-shadow: 0 6px 24px 0 rgba(80, 80, 180, 0.13);
    border-color: #6366f1;
  }
}
.kanban-card-title {
  font-size: 1.08rem;
  font-weight: 600;
  color: #3730a3;
}
.kanban-card-meta {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 0.97rem;
  color: #6366f1;
}
.kanban-card-id {
  background: #e0e7ff;
  border-radius: 0.7rem;
  padding: 0.1rem 0.6rem;
  font-size: 0.93rem;
}
.kanban-card-avatar {
  background: #6366f1;
  color: #fff;
  border-radius: 50%;
  width: 1.7rem;
  height: 1.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  margin-left: auto;
}
.kanban-create-btn {
  margin-top: 0.7rem;
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px 0 rgba(80, 80, 180, 0.08);
  &:hover {
    background: #4f46e5;
  }
  .plus {
    font-size: 1.3rem;
    font-weight: 700;
  }
}
.kanban-card-title-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.kanban-steps {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.kanban-step {
  background: #e0e7ff;
  border-radius: 0.5rem;
  padding: 0.2rem 0.7rem;
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  color: #3730a3;
}
.kanban-add-step {
  color: #6366f1;
  font-size: 0.97rem;
  cursor: pointer;
  margin-top: 0.2rem;
  &:hover {
    text-decoration: underline;
  }
}
</style>