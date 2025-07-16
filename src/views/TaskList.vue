
<template>
  <div class="tasklist-container">
    <div class="tasklist-header">
      <h2>Task List</h2>
      <button class="add-btn" @click="addTask">+ Add Task</button>
    </div>
    <table class="tasklist-table">
      <thead>
        <tr>
          <th>Phase</th>
          <th>Task</th>
          <th>SubTask</th>
          <th>Description</th>
          <th>Groups</th>
          <th>Architecture</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, idx) in tasks" :key="task.id">
          <td>
            <input v-model="task.Phase" class="task-input" placeholder="Phase" />
          </td>
          <td>
            <input v-model="task.Task" class="task-input" placeholder="Task" />
          </td>
          <td>
            <input v-model="task.SubTask" class="task-input" placeholder="SubTask" />
          </td>
          <td>
            <input v-model="task.Description" class="task-input" placeholder="Description" />
          </td>
          <td>
            <input v-model="task.Groups" class="task-input" placeholder="Groups" />
          </td>
          <td>
            <input v-model="task.Architecture" class="task-input" placeholder="Architecture" />
          </td>
          <td>
            <button class="delete-btn" @click="deleteTask(idx)">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

let nextId = 1
const tasks = reactive([
  { id: nextId++, Phase: '', Task: '', SubTask: '', Description: '', Groups: '', Architecture: '' },
])

function addTask() {
  tasks.push({ id: nextId++, Phase: '', Task: '', SubTask: '', Description: '', Groups: '', Architecture: '' })
}
function deleteTask(idx) {
  tasks.splice(idx, 1)
}
</script>

<style lang="scss">
.tasklist-container {
  max-width: 1200px;
  margin: 2rem auto;
  background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(80, 80, 180, 0.10);
  padding: 2rem 2.5rem 2.5rem 2.5rem;
}
.tasklist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.add-btn {
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  padding: 0.6rem 1.4rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px 0 rgba(80, 80, 180, 0.08);
  &:hover {
    background: #4f46e5;
  }
}
.tasklist-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.7rem;
  background: transparent;
}
.tasklist-table th {
  background: #6366f1;
  color: #fff;
  font-weight: 700;
  padding: 0.8rem 0.5rem;
  border-radius: 0.5rem 0.5rem 0 0;
  font-size: 1.05rem;
}
.tasklist-table td {
  background: #fff;
  padding: 0.7rem 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px 0 rgba(80, 80, 180, 0.04);
  vertical-align: middle;
}
.task-input {
  width: 100%;
  padding: 0.4rem 0.7rem;
  border: 1.5px solid #e0e7ff;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: #f3f4f6;
  transition: border 0.2s;
  &:focus {
    border-color: #6366f1;
    outline: none;
    background: #fff;
  }
}
.delete-btn {
  background: #f44336;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 0.8rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #b91c1c;
  }
}
</style>