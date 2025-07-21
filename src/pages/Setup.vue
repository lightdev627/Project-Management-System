<template>
  <div class="setup-dashboard">
      <div
        v-for="(column, colIdx) in columns"
        :key="colIdx"
        class="dashboard-column"
        ref="dashboardColumns"
      >
        <div class="dashboard-header">{{ column.title }}</div>
        <ul v-if="column.title !== 'KEY'" class="dashboard-list">
          <li
            v-for="(item, i) in column.items"
            :key="i"
            class="dashboard-list-item"
          >
            <span>{{ item }}</span>
            <div class="delete-area">
              <template
                v-if="
                  confirmDelete &&
                  confirmDelete.col === colIdx &&
                  confirmDelete.idx === i
                "
              >
                <span class="popconfirm">
                  <span class="popconfirm-text">Are you sure?</span>
                  <span class="popconfirm-btn-row">
                    <button
                      class="popconfirm-btn yes"
                      @click="confirmDeleteItem(colIdx, i)"
                    >
                      Yes
                    </button>
                    <button class="popconfirm-btn no" @click="cancelDelete">
                      No
                    </button>
                  </span>
                </span>
              </template>
              <template v-else>
                <button
                  class="delete-btn"
                  @click="showDeleteConfirm(colIdx, i)"
                  title="Delete"
                >
                  ❌
                </button>
              </template>
            </div>
          </li>
          <!-- Inline add for non-KEY cards -->
          <li v-if="showAddInput[colIdx]" class="dashboard-list-item add-item">
            <div class="add-input-container">
              <input
                v-model="newItems[colIdx]"
                @keyup.enter="addItem(colIdx)"
                class="inline-add-input"
                type="text"
                :placeholder="'Add new ' + column.title.slice(0, -1)"
                autofocus
              />
              <div class="inline-buttons">
                <button class="inline-confirm-btn" @click="addItem(colIdx)">
                  Add
                </button>
                <button class="inline-cancel-btn" @click="cancelAdd(colIdx)">
                  Cancel
                </button>
              </div>
            </div>
          </li>
        </ul>
        <!-- Special two-column layout for KEY card -->
        <div v-else class="dashboard-list key-list">
          <div
            v-for="(row, rowIdx) in keyRows"
            :key="'row-' + rowIdx"
            class="key-row"
          >
            <div class="key-col">
              <div class="key-item">
                <span>{{ row.left || "" }}</span>
              </div>
            </div>
            <div class="key-col">
              <div class="key-item">
                <span>{{ row.right || "" }}</span>
              </div>
            </div>
            <div class="delete-area">
              <template
                v-if="
                  confirmDelete &&
                  confirmDelete.col === colIdx &&
                  confirmDelete.idx === rowIdx
                "
              >
                <span class="popconfirm">
                  <span class="popconfirm-text">Are you sure?</span>
                  <span class="popconfirm-btn-row">
                    <button
                      class="popconfirm-btn yes"
                      @click="confirmDeleteKeyRow(rowIdx)"
                    >
                      Yes
                    </button>
                    <button class="popconfirm-btn no" @click="cancelDelete">
                      No
                    </button>
                  </span>
                </span>
              </template>
              <template v-else>
                <button
                  class="delete-btn"
                  @click="showDeleteKeyRowConfirm(colIdx, rowIdx)"
                  title="Delete"
                >
                  ❌
                </button>
              </template>
            </div>
          </div>
          <!-- Inline add for KEY card -->
          <div v-if="showAddInput[colIdx]" class="dashboard-list-item add-item">
            <div class="add-input-container">
              <div class="key-col">
                <input
                  v-model="newKeyCol1"
                  @keyup.enter="addKeyRow"
                  class="inline-add-input"
                  type="text"
                  placeholder="Left column"
                  autofocus
                />
              </div>
              <div class="key-col">
                <input
                  v-model="newKeyCol2"
                  @keyup.enter="addKeyRow"
                  class="inline-add-input"
                  type="text"
                  placeholder="Right column"
                />
              </div>
              <div class="inline-buttons">
                <button class="inline-confirm-btn" @click="addKeyRow">Add</button>
                <button class="inline-cancel-btn" @click="cancelAdd(colIdx)">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Add button row -->
        <div class="add-item-row">
          <template v-if="!showAddInput[colIdx]">
            <button class="show-add-btn" @click="showAdd(colIdx)">+ Add</button>
          </template>
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const columns = ref([
  {
    title: "Stages",
    items: [
      "Planning",
      "BCAC_Phase_1",
      "BCAC_Phase_2",
      "Procurement",
      "BCAC_Phase_3",
      "Development",
      "Deployment",
      "BCAC_Phase_4",
      "Sustainment",
      "BCAC_Phase_5",
      "Decommissioning",
    ],
  },
  {
    title: "PROJECTS MEMBERS",
    items: [
      "Norman Whitehead",
      "Bob Dasika",
      "Jaydeep Patel",
      "Gale Wallace",
      "Ricardo James",
      "Shilpa Vadlamudi",
      "Tommeka Johnson",
    ],
  },
  {
    title: "STATUS",
    items: [
      "ON TIME",
      "COMPLETED",
      "ON GOING",
      "AT RISK",
      "DELAYED",
      "LATE",
      "PENDING",
      "NOT STARTED",
    ],
  },
  {
    title: "KEY",
    items: [
      "New Task",
      "In Progress Task",
      "Done",
      "Deadline",
      "Event",
      "Meeting",
      "Cancelled",
      "Migrated",
      "Finance",
      "Human Resources",
      "Operations",
      "Logistics",
      "IT",
      "Strategy and Planning",
      "Sales",
      "Marketing",
    ],
  },
  {
    title: "MONTHS",
    items: [
      "JANUARY",
      "FEBRUARY",
      "MARCH",
      "APRIL",
      "MAY",
      "JUNE",
      "JULY",
      "AUGUST",
      "SEPTEMBER",
      "OCTOBER",
      "NOVEMBER",
      "DECEMBER",
    ],
  },
  {
    title: "YEARS",
    items: ["2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032"],
  },
  {
    title: "NOTES TYPE",
    items: [
      "From Client Meeting",
      "From Team Meeting",
      "Reminders",
      "Minutes of the Meeting",
      "Personal",
      "Brain Dump",
      "Ideas",
    ],
  },
]);

const newItems = ref(Array(columns.value.length).fill(""));
const showAddInput = ref(Array(columns.value.length).fill(false));
const confirmDelete = ref(null); // { col: colIdx, idx: itemIdx }

// For KEY card add
const newKeyCol1 = ref("");
const newKeyCol2 = ref("");

function showAdd(colIdx) {
  showAddInput.value = showAddInput.value.map((v, i) => i === colIdx);
  newItems.value[colIdx] = "";
  if (columns.value[colIdx].title === "KEY") {
    newKeyCol1.value = "";
    newKeyCol2.value = "";
  }
}

function cancelAdd(colIdx) {
  showAddInput.value[colIdx] = false;
  newItems.value[colIdx] = "";
  if (columns.value[colIdx].title === "KEY") {
    newKeyCol1.value = "";
    newKeyCol2.value = "";
  }
}

function addItem(colIdx) {
  const value = newItems.value[colIdx]?.trim();
  if (value) {
    columns.value[colIdx].items.push(value);
    newItems.value[colIdx] = "";
    showAddInput.value[colIdx] = false;
  }
}

// For KEY card: add as one row
function addKeyRow() {
  const keyCol = columns.value.find((c) => c.title === "KEY");
  if (!keyCol) return;
  const val1 = newKeyCol1.value.trim();
  const val2 = newKeyCol2.value.trim();
  if (val1) keyCol.items.push(val1);
  if (val2) keyCol.items.push(val2);
  newKeyCol1.value = "";
  newKeyCol2.value = "";
  const keyIdx = columns.value.findIndex((c) => c.title === "KEY");
  showAddInput.value[keyIdx] = false;
}

function showDeleteConfirm(colIdx, itemIdx) {
  confirmDelete.value = { col: colIdx, idx: itemIdx };
}

function cancelDelete() {
  confirmDelete.value = null;
}

function confirmDeleteItem(colIdx, itemIdx) {
  columns.value[colIdx].items.splice(itemIdx, 1);
  confirmDelete.value = null;
}

// For KEY card: delete entire row
function showDeleteKeyRowConfirm(colIdx, rowIdx) {
  confirmDelete.value = { col: colIdx, idx: rowIdx };
}

function confirmDeleteKeyRow(rowIdx) {
  const keyColObj = columns.value.find((c) => c.title === "KEY");
  if (!keyColObj) return;
  const half = Math.ceil(keyColObj.items.length / 2);
  // Remove both items from the row
  if (rowIdx < half) {
    keyColObj.items.splice(rowIdx, 1);
    if (rowIdx < keyColObj.items.length) {
      keyColObj.items.splice(rowIdx, 1);
    }
  } else {
    const rightIdx = rowIdx - half;
    if (rightIdx < keyColObj.items.length - half) {
      keyColObj.items.splice(half + rightIdx, 1);
    }
  }
  confirmDelete.value = null;
}

function handleClickOutside(event) {
  if (
    !event.target.closest(".delete-area") &&
    !event.target.closest(".add-item") &&
    !event.target.closest(".add-key-row")
  ) {
    confirmDelete.value = null;
  }
}
onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

// For KEY card: create rows from items
const keyRows = computed(() => {
  const keyCol = columns.value.find((c) => c.title === "KEY");
  if (!keyCol) return [];
  const half = Math.ceil(keyCol.items.length / 2);
  const leftItems = keyCol.items.slice(0, half);
  const rightItems = keyCol.items.slice(half);
  const maxRows = Math.max(leftItems.length, rightItems.length);
  const rows = [];
  for (let i = 0; i < maxRows; i++) {
    rows.push({
      left: leftItems[i] || "",
      right: rightItems[i] || "",
    });
  }
  return rows;
});
</script>

<style lang="scss" scoped>
.setup-dashboard {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  gap: 2rem;
  padding: 2rem;
  background: #ffffff;
  min-height: 80vh;
  border-radius: 15px;
}
.dashboard-column {
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 10px 0 rgba(80, 112, 255, 0.1),
    0 1.5px 4px 0 rgba(0, 0, 0, 0.04);
  min-width: 170px;
  max-width: 280px;
  padding: 1.5rem 0.5rem 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: 1.5px solid #e0e7ff;
  min-height: 400px; /* reduced height for a less tall board */
}
.dashboard-header {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: #4f46e5;
  margin-bottom: 0.8rem;
  text-align: center;
  text-transform: uppercase;
  border-bottom: 2px solid #e0e7ff;
  padding-bottom: 0.5rem;
}
.dashboard-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.dashboard-list-item {
  font-size: 0.8rem;
  color: #334155;
  padding: 0.45rem 0.2rem;
  border-bottom: 1px dashed #e5e7eb;
  text-align: center;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.dashboard-list-item:last-child {
  border-bottom: none;
}
.dashboard-list-item:hover {
  background: #f1f5f9;
}
.delete-area {
  position: relative;
  display: flex;
  align-items: center;
}
.delete-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 1rem;
  cursor: pointer;
  padding: 0 0.3rem;
  border-radius: 50%;
  line-height: 1;
}
.popconfirm {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  border: 1px solid #e0e7ff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px 0 rgba(80, 112, 255, 0.1);
  padding: 0.3rem 0.7rem;
  font-size: 0.7rem;
  color: #334155;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  min-width: 110px;
}
.popconfirm-text {
  margin-bottom: 0.2rem;
  text-align: center;
  font-size: 0.7rem;
}
.popconfirm-btn-row {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
.popconfirm-btn {
  background: none;
  border: none;
  font-size: 0.7rem;
  font-weight: 600;
  border-radius: 0.3rem;
  padding: 0.15rem 0.5rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.popconfirm-btn.yes {
  color: #fff;
  background: #4f46e5;
}
.popconfirm-btn.yes:hover {
  background: #6366f1;
}
.popconfirm-btn.no {
  color: #64748b;
  background: #f1f5f9;
}
.popconfirm-btn.no:hover {
  background: #e0e7ff;
  color: #334155;
}
.add-item-row {
  display: flex;
  gap: 0.4rem;
  margin-top: 1.1rem;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
}
.add-input-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}
.inline-add-input {
  width: 100%;
  padding: 0.35rem 0.6rem;
  border: 1px solid #c7d2fe;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  outline: none;
  transition: border 0.2s;
  box-sizing: border-box;
}
.inline-add-input:focus {
  border-color: #6366f1;
}
.inline-buttons {
  display: flex;
  gap: 0.3rem;
  justify-content: center;
}
.inline-confirm-btn {
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 0.3rem;
  padding: 0.2rem 0.4rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-right: 5px;
}
.inline-confirm-btn:hover {
  background: #059669;
}
.inline-cancel-btn {
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 0.3rem;
  padding: 0.2rem 0.4rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.inline-cancel-btn:hover {
  background: #dc2626;
}
.show-add-btn {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 0.5rem;
  padding: 0.35rem 0.9rem;
  transition: background 0.2s, color 0.2s;
}
.show-add-btn:hover {
  background: #eef2ff;
  color: #4338ca;
}
/* KEY card two-column layout */
.key-list {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-bottom: 0.5rem;
}
.key-row {
  display: flex;
  border-bottom: 1px dashed #e5e7eb;
  flex-direction: row;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  position: relative;
}
.key-col {
  display: flex;
  flex-direction: column;
  min-width: 90px;
}
.key-item {
  font-size: 0.8rem;
  color: #334155;
  padding: 0.25rem 0.2rem;
  border-bottom: 1px dashed #e5e7eb;
  text-align: left;
  white-space: nowrap;
  min-height: 1.5rem;
  display: flex;
  align-items: center;
}
.key-item:last-child {
  border-bottom: none;
}
.add-key-row {
  border: 1px dashed #c7d2fe;
  border-radius: 0.5rem;
  padding: 0.5rem;
  background: #f8fafc;
}
</style>
