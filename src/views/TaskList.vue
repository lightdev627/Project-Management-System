<template>
  <a-card class="tasklist-body">
    <!-- Header with search and buttons -->
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      "
    >
      <div style="flex: 1; max-width: 300px">
        <a-input-search
          v-model:value="searchText"
          placeholder="Search tasks..."
          @search="handleSearch"
          style="width: 100%"
        />
      </div>
      <div>
        <a-button type="primary" @click="addNewRow" style="margin-right: 8px">
          <template #icon><plus-outlined /></template>
          Add
        </a-button>
        <a-button
          type="danger"
          @click="deleteSelectedRows"
          :disabled="!hasSelectedRows"
        >
          <template #icon><delete-outlined /></template>
          Delete
        </a-button>
      </div>
    </div>

    <!-- Table -->
    <a-table
      :columns="columns"
      :data-source="filteredTasks"
      row-key="key"
      bordered
      size="small"
      :pagination="false"
      style="border-bottom: 1px solid #ececec"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'select'">
          <a-checkbox v-model:checked="record.selected" />
        </template>
        <template v-else-if="column.dataIndex === 'phase'">
          <template v-if="record.isEditing || record.isNew">
            <a-input
              v-model:value="record.phase"
              @keydown="(e) => handleKeyDown(e, record)"
              ref="phaseInput"
            />
          </template>
          <template v-else>
            <span
              @dblclick="startEditing(record)"
              style="cursor: pointer; display: block; padding: 4px"
            >
              {{ record.phase }}
            </span>
          </template>
        </template>
        <template v-else-if="column.dataIndex === 'task'">
          <template v-if="record.isEditing || record.isNew">
            <a-input
              v-model:value="record.task"
              @keydown="(e) => handleKeyDown(e, record)"
            />
          </template>
          <template v-else>
            <span
              @dblclick="startEditing(record)"
              style="cursor: pointer; display: block; padding: 4px"
            >
              {{ record.task }}
            </span>
          </template>
        </template>
        <template v-else-if="column.dataIndex === 'subtask'">
          <template v-if="record.isEditing || record.isNew">
            <a-input
              v-model:value="record.subtask"
              @keydown="(e) => handleKeyDown(e, record)"
            />
          </template>
          <template v-else>
            <span
              @dblclick="startEditing(record)"
              style="cursor: pointer; display: block; padding: 4px"
            >
              {{ record.subtask }}
            </span>
          </template>
        </template>
        <template v-else-if="column.dataIndex === 'description'">
          <template v-if="record.isEditing || record.isNew">
            <a-input
              v-model:value="record.description"
              @keydown="(e) => handleKeyDown(e, record)"
            />
          </template>
          <template v-else>
            <span
              @dblclick="startEditing(record)"
              style="cursor: pointer; display: block; padding: 4px"
            >
              {{ record.description }}
            </span>
          </template>
        </template>
        <template v-else-if="column.dataIndex === 'groups'">
          <template v-if="record.isEditing || record.isNew">
            <a-input
              v-model:value="record.groups"
              @keydown="(e) => handleKeyDown(e, record)"
            />
          </template>
          <template v-else>
            <span
              @dblclick="startEditing(record)"
              style="cursor: pointer; display: block; padding: 4px"
            >
              {{ record.groups }}
            </span>
          </template>
        </template>
        <template v-else-if="column.dataIndex === 'architecture'">
          <template v-if="record.isEditing || record.isNew">
            <a-input
              v-model:value="record.architecture"
              @keydown="(e) => handleKeyDown(e, record)"
            />
          </template>
          <template v-else>
            <span
              @dblclick="startEditing(record)"
              style="cursor: pointer; display: block; padding: 4px"
            >
              {{ record.architecture }}
            </span>
          </template>
        </template>
        <template v-else>
          <span
            @dblclick="startEditing(record)"
            style="cursor: pointer; display: block; padding: 4px"
          >
            {{ record[column.dataIndex] }}
          </span>
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons-vue";

const searchText = ref("");
const tasks = ref([
  {
    key: "1",
    selected: false,
    phase: "epic",
    task: "MF111-1",
    subtask: "sdf",
    description: "TO DO",
    groups: "",
    architecture: "",
    isEditing: false,
    isNew: false,
  },
  {
    key: "2",
    selected: false,
    phase: "task",
    task: "MF111-2",
    subtask: "123wwd",
    description: "TO DO",
    groups: "",
    architecture: "",
    isEditing: false,
    isNew: false,
  },
  {
    key: "3",
    selected: false,
    phase: "task",
    task: "MF111-3",
    subtask: "gfjghfg",
    description: "IN PROGRESS",
    groups: "",
    architecture: "",
    isEditing: false,
    isNew: false,
  },
  {
    key: "4",
    selected: false,
    phase: "task",
    task: "MF111-4",
    subtask: "132",
    description: "IN PROGRESS",
    groups: "",
    architecture: "",
    isEditing: false,
    isNew: false,
  },
]);

const columns = [
  { title: "", dataIndex: "select", width: 20 },
  { title: "Phase", dataIndex: "phase", width: 80 },
  { title: "Task", dataIndex: "task", width: 100 },
  { title: "SubTask", dataIndex: "subtask", width: 150 },
  { title: "Description", dataIndex: "description", width: 120 },
  { title: "Groups", dataIndex: "groups", width: 140 },
  { title: "Architecture", dataIndex: "architecture", width: 100 },
];

// Computed properties
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

// Methods
const handleSearch = (value) => {
  searchText.value = value;
};

const addNewRow = () => {
  // Cancel any existing editing first
  tasks.value.forEach((task) => {
    task.isEditing = false;
    task.isNew = false;
  });

  const newKey = Date.now().toString();
  const newRow = {
    key: newKey,
    selected: false,
    phase: "",
    task: "",
    subtask: "",
    description: "",
    groups: "",
    architecture: "",
    isEditing: true,
    isNew: true,
  };
  tasks.value.push(newRow);

  // Focus on the first input field after a brief delay to ensure DOM is updated
  setTimeout(() => {
    const firstInput = document.querySelector(".ant-table input");
    if (firstInput) {
      firstInput.focus();
    }
  }, 100);
};

const deleteSelectedRows = () => {
  tasks.value = tasks.value.filter((task) => !task.selected);
};

const startEditing = (record) => {
  // Cancel any other editing rows first
  tasks.value.forEach((task) => {
    if (task !== record) {
      task.isEditing = false;
      task.isNew = false;
    }
  });

  record.isEditing = true;
  record.originalData = { ...record };
};

const saveRow = (record) => {
  record.isEditing = false;
  record.isNew = false;
  delete record.originalData;
};

// Click outside handler
const handleClickOutside = (event) => {
  const editingRow = tasks.value.find((task) => task.isEditing || task.isNew);
  if (editingRow) {
    // Check if click is outside the table or on a different row
    const tableElement = event.target.closest(".ant-table");
    if (!tableElement) {
      // Click is outside the table, save the editing row
      saveRow(editingRow);
    } else {
      // Check if click is on a different row
      const clickedRow = event.target.closest("tr");
      if (clickedRow) {
        const rowKey = clickedRow.getAttribute("data-row-key");
        if (rowKey !== editingRow.key) {
          // Click is on a different row, save the editing row
          saveRow(editingRow);
        }
      }
    }
  }
};

// Handle Enter key to save and Tab key to navigate
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
    record.isNew = false;
  }
};

// Add and remove event listeners
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style lang="scss" scoped>
.tasklist-body {
  padding: 2rem;
  background: #ffffff;
  min-height: 80vh;
  border-radius: 15px;
}
.a-table {
  th,
  td {
    text-align: center;
    vertical-align: middle;
  }
}

.ant-table-cell {
  padding: 8px !important;
}
</style>
