<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { addItem } from "../actions/addItem";

const searchText = ref("");
const tasks = ref([
  {
    key: "1",
    selected: false,
    project: "123123123",
    phase: "epic",
    task: "MF111-1",
    subtask: "sdf",
    description: "TO DO",
    groups: "",
    architecture: "",
    isEditing: false,
  },
  {
    key: "2",
    selected: false,
    project: "123123123",
    phase: "task",
    task: "MF111-2",
    subtask: "123wwd",
    description: "TO DO",
    groups: "",
    architecture: "",
    isEditing: false,
  },
  {
    key: "3",
    selected: false,
    project: "123123123",
    phase: "task",
    task: "MF111-3",
    subtask: "gfjghfg",
    description: "IN PROGRESS",
    groups: "",
    architecture: "",
    isEditing: false,
  },
  {
    key: "4",
    selected: false,
    project: "123123123",
    phase: "task",
    task: "MF111-4",
    subtask: "132",
    description: "IN PROGRESS",
    groups: "",
    architecture: "",
    isEditing: false,
  },
]);

// Add newTask for add form
const newTask = ref({
  project: "",
  phase: "",
  task: "",
  subtask: "",
  description: "",
  groups: "",
  architecture: "",
});
const showAddForm = ref(false);

const columns = [
  { name : "selected", align: "center", label: "", field: "selected", style: "width: 10px" },
  { name : "project", align: "left", label: "Project Name", field: "Project", style: "width: 100px" },
  { name : "phase", align: "left", label: "Phase", field: "phase", style: "width: 100px" },
  { name : "task", align: "left", label: "Task", field: "task", style: "width: 100px" },
  { name : "subtask", align: "left", label: "SubTask", field: "subtask", style: "width: 100px" },
  { name : "description", align: "left", label: "Description", field: "description", style: "width: 200px" },
  { name : "groups", align: "left", label: "Groups", field: "groups", style: "width: 150px" },
  { name : "architecture", align: "left", label: "Architecture", field: "architecture", style: "width: 100px" },
];

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10
})

const editingRowKey = ref(null);
const editingColName = ref(null);

const filteredTasks = computed(() => {
  if (!searchText.value) return tasks.value;

  return tasks.value.filter(
    (task) =>
      task.phase.toLowerCase().includes(searchText.value.toLowerCase()) ||
      task.task.toLowerCase().includes(searchText.value.toLowerCase()) ||
      task.subtask.toLowerCase().includes(searchText.value.toLowerCase()) ||
      task.description.toLowerCase().includes(searchText.value.toLowerCase()) ||
      task.groups.toLowerCase().includes(searchText.value.toLowerCase()) ||
      task.architecture.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

const hasSelectedRows = computed(() => {
  return tasks.value.some((task) => task.selected);
});

const handleSearch = (value) => {
  searchText.value = value;
};

// Validation for required fields
function isFieldInvalid(field, record) {
  return ["project", "phase", "task", "subtask"].includes(field) && (!record[field] || record[field].trim() === "");
}

function isRowValid(record) {
  return ["project", "phase", "task", "subtask"].every(f => record[f] && record[f].trim() !== "");
}

const addNewRow = () => {
  showAddForm.value = true;
  // Reset newTask
  newTask.value = {
    project: "",
    phase: "",
    task: "",
    subtask: "",
    description: "",
    groups: "",
    architecture: "",
  };
};

function saveNewTask() {
  if (!isRowValid(newTask.value)) return;
  const newKey = Date.now().toString();
  tasks.value.push({
    key: newKey,
    selected: false,
    ...newTask.value,
    isEditing: false,
  });
  showAddForm.value = false;
}

function cancelNewTask() {
  showAddForm.value = false;
}

const deleteSelectedRows = () => {
  tasks.value = tasks.value.filter((task) => !task.selected);
};

const startEditing = (record, colName) => {
  // Cancel any other editing rows first
  tasks.value.forEach((task) => {
    if (task !== record) {
      task.isEditing = false;
    }
  });

  record.isEditing = true;
  record.originalData = { ...record };
  editingRowKey.value = record.key;
  editingColName.value = colName;
  // Quasar's autofocus will handle focusing the correct input
  nextTick(() => {});
};

const saveRow = (record) => {
  if (!isRowValid(record)) return;
  record.isEditing = false;
  delete record.originalData;
  editingRowKey.value = null;
  editingColName.value = null;
};

const handleKeyDown = (event, record) => {
  if (event.key === "Enter") {
    saveRow(record);
  } else if (event.key === "Escape") {
    // Cancel editing and restore original data if it exists
    if (record.originalData) {
      Object.assign(record, record.originalData);
      delete record.originalData;
    }
    record.isEditing = false;
    editingRowKey.value = null;
    editingColName.value = null;
  }
};

const cancelAllEditing = () => {
  tasks.value.forEach((task) => {
    if (task.isEditing) {
      // Optionally restore original data if needed
      if (task.originalData) {
        Object.assign(task, task.originalData);
        delete task.originalData;
      }
      task.isEditing = false;
    }
  });
  editingRowKey.value = null;
  editingColName.value = null;
};

const handleGlobalClick = (event) => {
  const editingRow = event.target.closest('.editing-row');
  if (!editingRow) {
    cancelAllEditing();
  }
};

onMounted(() => {
  document.addEventListener('click', handleGlobalClick, true);
});

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick, true);
});

</script>

<template>
  <q-card class="tasklist-body">
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 3rem 0;
      "
    >
      <div style="flex: 1; max-width: 300px">
        <q-input white dense outlined rounded placeholder="Search tasks..." @search="handleSearch" style="width: 100%" v-model="searchText" class="q-ml-md">
          <template v-slot:append>
            <q-icon v-if="text === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="text = ''" />
          </template>
        </q-input>
      </div>
      <div>
        <q-btn color="primary" @click="addNewRow" style="margin-right: 8px">
          <q-icon left name="navigation" />
          <div>Add</div>
        </q-btn>
        <q-btn
          color="red"
          @click="deleteSelectedRows"
          :disabled="!hasSelectedRows"
        >
          <q-icon left name="directions" />
          <div>Delete</div>
        </q-btn>
      </div>
    </div>

    <!-- Add Task Form -->
    <div v-if="showAddForm" class="q-pa-md" style="background: #f9f9f9; border-radius: 8px; margin-bottom: 1rem;">
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <q-input v-for="field in ['project','phase','task','subtask','description','groups','architecture']"
          :key="field"
          v-model="newTask[field]"
          :label="field.charAt(0).toUpperCase() + field.slice(1)"
          dense outlined :error="isFieldInvalid(field, newTask)"
          :error-message="isFieldInvalid(field, newTask) ? 'Required' : ''"
          style="min-width: 120px; max-width: 180px;"
        />
      </div>
      <div class="q-mt-md">
        <q-btn color="primary" @click="saveNewTask" :disable="!isRowValid(newTask)">Save</q-btn>
        <q-btn flat @click="cancelNewTask" class="q-ml-sm">Cancel</q-btn>
      </div>
    </div>

    <!-- Table -->
    <q-table
      :columns="columns"
      :rows="filteredTasks"
      row-key="name"
      bordered
      size="small"
      separator="horizontal"
      style="border: 1px solid #ececec;"
      :pagination="pagination"
    >
      <template v-slot:body="props">
        <q-tr :props="props" :key="props.row.key" :class="{ 'editing-row': props.row.isEditing }">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <template v-if="col.name === 'selected'">
              <q-checkbox v-model="props.row.selected" />
            </template>
            <template v-else-if="['project', 'phase', 'task', 'subtask', 'description', 'groups', 'architecture'].includes(col.name)">
              <template v-if="props.row.isEditing">
                <q-input
                  ref="inputField"
                  dense
                  :autofocus="editingRowKey === props.row.key && editingColName === col.name"
                  @keydown="(e) => handleKeyDown(e, props.row)"
                  outlined
                  v-model="props.row[col.name]"
                  :error="isFieldInvalid(col.name, props.row)"
                  :error-message="isFieldInvalid(col.name, props.row) ? 'Required' : ''"
                />
              </template>
              <template v-else>
                <span
                  @dblclick="startEditing(props.row, col.name)"
                  style="cursor: pointer; display: block; padding: 4px"
                >
                  {{ props.row[col.name] !== '' ? props.row[col.name] : '\u00A0' }}
                </span>
              </template>
            </template>
            <template v-else>
              <q-td :props="props">
                <span
                  @dblclick.stop="startEditing(props.row, col.name)"
                  style="cursor: pointer; display: block; padding: 4px"
                >
                  {{ props.row[col.name] !== '' ? props.row[col.name] : '\u00A0' }}
                </span>
              </q-td>
            </template>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-card>
</template>

<style lang="scss" scoped>
.tasklist-body {
  margin: 2rem;
  padding: 2rem;
  background: #ffffff;
  min-height: 80vh;
  border-radius: 15px;
}
</style>
