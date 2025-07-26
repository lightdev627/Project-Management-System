<script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from "vue";
  import { useProjectStore } from "../store"
  import { addItem } from "../actions/addItem";
  import { getItem } from "../actions/getItem";
  import { editItem } from "../actions/editItem";
  import { deleteItem } from "../actions/deleteItem";
  import LoadingSpinner from '../components/LoadingSpinner.vue';

  const projectStore = useProjectStore();

  const current = ref({columns: [
    {
      title: 'phases',
      items: []
    },
    {
      title: 'members',
      items: []
    },
    {
      title: 'status',
      items: []
    },
    {
      title: 'KEY',
      items: []
    },
    {
      title: 'months',
      items: []
    },
    {
      title: 'years',
      items: []
    },
    {
      title: 'note_types',
      items: []
    },
  ]});
  const currentKeyRows = ref([]);

  const showAddInput = ref([]);
  const confirmDelete = ref(null);
  
  const newProjectName = ref("");
  const newItems = ref([]);
  const newKeyCol1 = ref("");
  const newKeyCol2 = ref("");

  function fetchProjects() {
    projectStore.setLoading(true);
    const fields = [
      "ID", "Title", "phases", "members", "status", "key_IDs", "months", "years", "note_types"
    ];
    getItem("Projects", fields).then(res => {
      projectStore.setProjects(res);
      projectStore.setCurrent(res[0]);
    }).finally(() => {
      projectStore.setLoading(false);
    });
  }

  fetchProjects();

  onMounted((fetchProjects));

  watch(
    () => projectStore.currentProject,
    (source) => {
      if(source) {
        current.value = {
          ProjectTitle: source.Title,
          columns: Object.keys(source).slice(2).map(item => {
            return {
              title: item == "key_IDs" ? "KEY" : item,
              items: source[item] ? source[item].split(",") : []
            }
          })
        };

      }
    },
    { immediate: true, deep: true }
  )
  watch(
    () => current.value.columns,
    (source) => {
      if(source) {
        newItems.value = Array(source.length).fill("");
        showAddInput.value = Array(source.length).fill(false);

        const keyCol = source.find((c) => c.title === "KEY");
        if (!keyCol) return [];
        const fields = ["ID", "key", "value"];
        
        getItem("Keys", fields).then(res => {
          currentKeyRows.value = res.filter(item => keyCol.items.indexOf(String(item.ID)) != -1 );
        })
      }
    },
    {immediate: true, deep: true}
  )

  function addProject() {
    const name = newProjectName.value.trim();
    if (!name || projectStore.setups.map(project => project.Title).includes(name)) return;
    projectStore.setLoading(true);
    addItem("Projects", { Title: name }).then(res => {
      projectStore.addProject({
        ID: res.ID,
        Title: res.Title,
        phases: res.phases,
        members: res.members,
        status: res.status,
        key_IDs: res.key_IDs,
        months: res.months,
        years: res.years,
        note_types: res.note_types,
      })
      newProjectName.value = "";
    }).finally(() => {
      projectStore.setLoading(false);
    });
  }

  function selectProject(event) {
    projectStore.setCurrent(projectStore.setups.find(item => item.Title == event.target.value));
  }

  function showAdd(colIdx) {
    showAddInput.value = showAddInput.value.map((v, i) => i === colIdx);
    newItems.value[colIdx] = "";
    if (current.value.columns[colIdx].title === "KEY") {
      newKeyCol1.value = "";
      newKeyCol2.value = "";
    }
  }

  function cancelAdd(colIdx) {
    showAddInput.value[colIdx] = false;
    newItems.value[colIdx] = "";
    if (current.value.columns[colIdx].title === "KEY") {
      newKeyCol1.value = "";
      newKeyCol2.value = "";
    }
  }

  function addElement(colIdx) {
    const value = newItems.value[colIdx]?.trim();
    if (value) {
      const keyName = Object.keys(projectStore.currentProject)[colIdx + 2];

      const currentValue = Object.values(projectStore.currentProject)[colIdx + 2];
      const parts = typeof currentValue === "string" ? currentValue.split(",") : [];
      parts.push(value);
      const valueName = parts.join(",");

      projectStore.setLoading(true);
      editItem("Projects", projectStore.currentProject.ID, { [keyName]: valueName }).then(res => {
        projectStore.editCurrent({
          ID: projectStore.currentProject.ID,
          key: keyName,
          value: valueName
        });
        newItems.value[colIdx] = "";
        showAddInput.value[colIdx] = false;
      }).finally(() => {
        projectStore.setLoading(false);
      });
    }
  }

  function addKeyRow() {
    const keyCol = current.value.columns.find((c) => c.title === "KEY");
    if (!keyCol) return;
    const val1 = newKeyCol1.value.trim();
    const val2 = newKeyCol2.value.trim();
    projectStore.setLoading(true);
    addItem("Keys", { key: val1, value: val2 }).then(res => {
      const currentValue = projectStore.currentProject["key_IDs"];
      const parts = typeof currentValue === "string" ? currentValue.split(",") : [];
      parts.push(res.ID);
      const valueName = parts.join(",");

      editItem("Projects", projectStore.currentProject.ID, {"key_IDs": valueName}).then(res => {
        projectStore.editCurrent({
          ID: projectStore.currentProject.ID,
          key: "key_IDs",
          value: valueName
        })
  
        currentKeyRows.value.push({
          ID: res.ID,
          key: val1,
          value: val2
        });
  
        newKeyCol1.value = "";
        newKeyCol2.value = "";
        const keyIdx = current.value.columns.findIndex((c) => c.title === "KEY");
        showAddInput.value[keyIdx] = false;
      }).finally(() => {
        projectStore.setLoading(false);
      });
    }).catch(() => {
      projectStore.setLoading(false);
    });
  }

  function showDeleteConfirm(colIdx, itemIdx) {
    confirmDelete.value = { col: colIdx, idx: itemIdx };
  }
  
  function confirmDeleteItem(colIdx, itemIdx) {
    const keyName = Object.keys(projectStore.currentProject)[colIdx + 2];
    
    const currentValue = Object.values(projectStore.currentProject)[colIdx + 2];
    const parts = typeof currentValue === "string" ? currentValue.split(",") : [];
    parts.splice(itemIdx, 1);
    const valueName = parts.join(",");
    projectStore.setLoading(true);
    editItem("Projects", projectStore.currentProject.ID, { [keyName]: valueName }).then(res => {
      projectStore.editCurrent({
        ID: projectStore.currentProject.ID,
        key: keyName,
        value: valueName
      });
      confirmDelete.value = null;
    }).finally(() => {
      projectStore.setLoading(false);
    });
  }

  function confirmDeleteKeyRow(rowIdx) {
    const keyColObj = current.value.columns.find((c) => c.title === "KEY");
    if (!keyColObj) return;
    
    projectStore.setLoading(true);
    deleteItem("Keys", [keyColObj.items[rowIdx]]).then(res => {
      const currentValue = projectStore.currentProject["key_IDs"];
      const parts = typeof currentValue === "string" ? currentValue.split(",") : [];
      parts.splice(rowIdx, 1);
      const valueName = parts.join(",");

      editItem("Projects", projectStore.currentProject.ID, {"key_IDs": valueName}).then(res => {
        projectStore.editCurrent({
          ID: projectStore.currentProject.ID,
          key: "key_IDs",
          value: valueName
        })
        confirmDelete.value = null;
      }).finally(() => {
        projectStore.setLoading(false);
      });
    }).catch(() => {
      projectStore.setLoading(false);
    });
  }

  function cancelDelete() {
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

  
</script>

<template>
  <LoadingSpinner :showing="projectStore.loading" text="Loading...">
    <div class="project-controls">
      <label for="project-select" class="project-label">Project:</label>
      <select id="project-select" :value="projectStore.currentProject ? projectStore.currentProject.Title : 'No projects'" @change="selectProject" class="project-select">
        <option v-for="project in projectStore.setups" :key="project.ID" :value="project.Title">{{ project.Title }}</option>
      </select>
      <input
        v-model="newProjectName"
        @keyup.enter="addProject"
        class="project-input"
        type="text"
        placeholder="New project name"
      />
      <button class="add-project-btn" @click="addProject">Add Project</button>
    </div>
    <div class="setup-dashboard">
      <div
        v-for="(column, colIdx) in current.columns"
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
          <li v-if="showAddInput[colIdx]" class="dashboard-list-item add-item">
            <div class="add-input-container">
              <input
                v-model="newItems[colIdx]"
                @keyup.enter="addElement(colIdx)"
                class="inline-add-input"
                type="text"
                :placeholder="'Add new ' + column.title.slice(0, -1)"
                autofocus
              />
              <div class="inline-buttons">
                <button class="inline-confirm-btn" @click="addElement(colIdx)">
                  Add
                </button>
                <button class="inline-cancel-btn" @click="cancelAdd(colIdx)">
                  Cancel
                </button>
              </div>
            </div>
          </li>
        </ul>
        <div v-else class="dashboard-list key-list">
          <div
            v-for="(row, rowIdx) in currentKeyRows"
            :key="'row-' + rowIdx"
            class="key-row"
          >
            <div class="key-col">
              <div class="key-item">
                <span>{{ row.key || "" }}</span>
              </div>
            </div>
            <div class="key-col">
              <div class="key-item">
                <span>{{ row.value || "" }}</span>
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
                  @click="showDeleteConfirm(colIdx, rowIdx)"
                  title="Delete"
                >
                  ❌
                </button>
              </template>
            </div>
          </div>
          <div v-if="showAddInput[colIdx]" class="dashboard-list-item add-item">
            <div class="add-input-container">
              <div class="key-col">
                <input
                  v-model="newKeyCol1"
                  @keyup.enter="addKeyRow"
                  class="inline-add-input"
                  type="text"
                  placeholder="Input key"
                  autofocus
                />
              </div>
              <div class="key-col">
                <input
                  v-model="newKeyCol2"
                  @keyup.enter="addKeyRow"
                  class="inline-add-input"
                  type="text"
                  placeholder="Input value"
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
        <div class="add-item-row">
          <template v-if="!showAddInput[colIdx]">
            <button class="show-add-btn" @click="showAdd(colIdx)">+ Add</button>
          </template>
        </div>
      </div>
    </div>
  </LoadingSpinner>
</template>

<style lang="scss" scoped>
  .project-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 2rem 0 1rem 3rem;
  }
  .project-label {
    font-weight: 600;
    color: #4f46e5;
    margin-right: 0.5rem;
  }
  .project-select {
    padding: 0.3rem 0.7rem;
    border-radius: 0.5rem;
    border: 1px solid #c7d2fe;
    font-size: 1rem;
    outline: none;
    background: #fff;
    color: #334155;
    width: 200px;
  }
  .project-input {
    padding: 0.3rem 0.7rem;
    border-radius: 0.5rem;
    border: 1px solid #c7d2fe;
    font-size: 1rem;
    outline: none;
    background: #fff;
    color: #334155;
    min-width: 160px;
  }
  .add-project-btn {
    background: #10b981;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    padding: 0.3rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }
  .add-project-btn:hover {
    background: #059669;
  }
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
    min-height: 400px;
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
