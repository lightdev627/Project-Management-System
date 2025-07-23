<script setup>
  import { ref, computed, onMounted, watch } from "vue";
  import jsPDF from "jspdf";

  import { useNoteStore } from "../store";
  import { getItem } from "../actions/getItem";
  import { addItem } from "../actions/addItem";
  import { editItem } from "../actions/editItem";
  import LoadingSpinner from "../components/LoadingSpinner.vue";

  const noteStore = useNoteStore();

  const noteTypes = ref([]);
  const notes = ref([]);

  const selectedType = ref('All');
  const newNote = ref("");
  const typeSearch = ref("");

  const loading = computed(() => noteStore.loading);

  onMounted(async () => {
    noteStore.setLoading(true);
    const fields = ["ID", "Title", "note_types"];
    await getItem("Projects", fields).then(res => {
      noteStore.setProjectList(res);
      noteStore.setTypeList(res[0].note_types.split(','))
    });
    noteStore.setLoading(false);
  })

  watch(
    () => noteStore.typeList,
    (source) => {
      noteTypes.value = source;
    },
    {immediate: true, deep: true}
  )

  watch(
    () => noteStore.currentType,
    (source) => {
      const fields = ["ID", "type", "Title", "created_date", "updated_date", "content"];
      getItem("Notes", fields).then(res => {
        noteStore.setNoteList(res)
      })
    },
    {immediate: true, deep: true}
  )

  watch(
    () => noteStore.noteList,
    (source) => {
      notes.value = source
    },
    {immediate: true, deep: true}
  )

  function selectType(type) {
    selectedType.value = type;
  }

  const filteredNoteTypes = computed(() => {
    if (!typeSearch.value.trim()) return noteTypes.value;
    return noteTypes.value.filter(type => type.toLowerCase().includes(typeSearch.value.trim().toLowerCase()));
  });

  function addNote() {
    if (!newNote.value.trim()) return;
    noteStore.setLoading(true);
    const newNoteInfo = {
      type: noteStore.currentType,
      created_date: new Date(),
      updated_date: new Date(),
      content: newNote.value.trim()
    }
    addItem("Notes", newNoteInfo).then(res => {
      noteStore.addNote({
        ...newNoteInfo,
        ID: res.ID,
      })
      newNote.value = "";
      noteStore.setLoading(false);
    })
  }

  // function deleteNote(idx) {
  //   notes.value.splice(idx, 1);
  // }

  function editNote(idx) {
    notes.value[idx].editing = true;
    notes.value[idx].editContent = notes.value[idx].content;
  }

  function saveEdit(idx) {
    const note = notes.value[idx];
    if (note.editContent.trim()) {
      noteStore.setLoading(true);
      const editInfo = {
        content: note.editContent.trim(),
        updated_date: new Date()
      }
      editItem("Notes", note.ID, editInfo).then(res => {
        noteStore.editNote({
          ID: note.ID,
          content: editInfo.content,
          updated_date: editInfo.updated_date
        })
        noteStore.setLoading(false);
      })
      note.editing = false;
    }
  }

  function cancelEdit(idx) {
    notes.value[idx].editing = false;
  }

  function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleString();
  }

  function downloadNote(note) {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Type: ${note.type}`, 10, 10);
    doc.text(`Created: ${formatDate(note.created_date)}`, 10, 20);
    doc.text(`Updated: ${formatDate(note.updated_date)}`, 10, 30);
    doc.setFontSize(16);
    doc.text("Note:", 10, 45);
    doc.setFontSize(12);
    const splitContent = doc.splitTextToSize(note.content, 180);
    doc.text(splitContent, 10, 55);
    doc.save(
      `Note-${note.type}-${formatDate(note.created_date).replace(/\W+/g, "_")}.pdf`
    );
  }

  const notesFiltered = computed(() =>
    selectedType.value === 'All'
      ? notes.value
      : notes.value.filter((n) => n.type === selectedType.value)
  );
  const notesSortedFiltered = computed(() =>
    notesFiltered.value.slice().sort((a, b) => b.updated_date - a.updated_date)
  );

const pageSize = ref(5);
const currentPage = ref(1);
const totalPages = computed(() =>
  Math.ceil(notesSortedFiltered.value.length / pageSize.value)
);
const paginatedNotes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return notesSortedFiltered.value.slice(start, start + pageSize.value);
});

watch(notesSortedFiltered, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1;
  }
});
</script>

<template>
  <LoadingSpinner :showing="loading" text="Loading notes...">
    <div class="notes-layout">
      <aside class="notes-sidebar">
        <div class="sidebar-title">Note Types</div>
        <input
          v-model="typeSearch"
          class="note-type-search"
          type="text"
          placeholder="Search types..."
          style="margin: 0 0 12px 0; padding: 8px 12px; border-radius: 8px; border: 1.5px solid #cbd5e1; font-size: 1.05rem; background: #f8fafc; width: 90%; align-self: center;"
        />
        <ul class="note-types-list">
          <li
            :class="{ selected: selectedType === 'All' }"
            @click="selectType('All')"
          >
            All
          </li>
          <li
            v-for="type in filteredNoteTypes"
            :key="type"
            :class="{ selected: selectedType === type }"
            @click="selectType(type)"
          >
            {{ type }}
          </li>
        </ul>
      </aside>

      <div class="notes-main">
        <div class="notes-header">
          <div class="notes-title">📝 Project Notes</div>
          <form class="add-note-form" @submit.prevent="addNote">
            <textarea
              v-model="newNote"
              class="note-input"
              placeholder="Write a new note..."
              rows="2"
            />
            <button class="add-btn" :disabled="!newNote.trim()">Post</button>
          </form>
        </div>
        <div class="notes-list">
          <div v-if="notesFiltered.length === 0" class="empty-notes">
            No notes yet. Start documenting your project insights!
          </div>
          <div
            v-for="(note, idx) in paginatedNotes"
            :key="note.ID"
            class="note-card large"
          >
            <div class="note-content" v-if="!note.editing">
              {{ note.content }}
            </div>
            <textarea
              v-else
              v-model="note.editContent"
              class="note-edit-input"
              rows="2"
            />
            <div class="note-meta">
              <span class="note-type">{{ note.type }}</span>
              <span class="note-date"
                >Created: {{ formatDate(note.created_date) }}</span
              >
              <span class="note-date"
                >Updated: {{ formatDate(note.updated_date) }}</span
              >
              <div class="note-actions">
                <button
                  v-if="!note.editing"
                  @click="editNote(idx)"
                  class="icon-btn"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  v-if="note.editing"
                  @click="saveEdit(idx)"
                  class="icon-btn save"
                  title="Save"
                >
                  💾
                </button>
                <button
                  v-if="note.editing"
                  @click="cancelEdit(idx)"
                  class="icon-btn cancel"
                  title="Cancel"
                >
                  ↩️
                </button>
                <button
                  @click="downloadNote(note)"
                  class="icon-btn download"
                  title="Download Note"
                >
                  ⬇️
                </button>
                <!-- <button
                  @click="deleteNote(idx)"
                  class="icon-btn delete"
                  title="Delete Note"
                >
                  ❌
                </button> -->
              </div>
            </div>
          </div>
          <div class="pagination-controls" v-if="totalPages > 1">
            <button @click="currentPage--" :disabled="currentPage === 1">Prev</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="currentPage++" :disabled="currentPage === totalPages">Next</button>
          </div>
        </div>
      </div>
    </div>
  </LoadingSpinner>
</template>

<style lang="scss" scoped>
.notes-layout {
  display: flex;
  min-height: 80vh;
  background: #ffffff;
  padding: 2rem;
  border-radius: 15px;
}
.notes-sidebar {
  width: 220px;
  background: #fff;
  border-right: 1.5px solid #e2e8f0;
  padding: 32px 5px 0 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 75vh;
  overflow-y: auto;
}
.sidebar-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 18px;
  text-align: center;
}
.note-types-list {
  list-style: none;
  padding: 0 0 24px 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  max-height: calc(100vh - 80px);
}
.note-types-list li {
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.08rem;
  color: #374151;
  transition: background 0.18s, color 0.18s;
  &:hover,
  &.selected {
    background: #6366f1;
    color: #fff;
  }
}
.notes-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 32px 0 0 0;
  min-width: 0;
}
.notes-header {
  max-width: 800px;
  min-width: 600px;
  margin: 0 auto 24px auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  padding: 32px 32px 24px 32px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.notes-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 18px;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
}
.add-note-form {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}
.note-type-select {
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  padding: 8px 12px;
  font-size: 1.05rem;
  background: #f8fafc;
  margin-bottom: 0;
}
.note-input {
  flex: 1;
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  padding: 10px 14px;
  font-size: 1.1rem;
  background: #f8fafc;
  resize: vertical;
  transition: border 0.2s;
  &:focus {
    border: 1.5px solid #6366f1;
    outline: none;
  }
}
.add-btn {
  background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.08);
  transition: background 0.2s, box-shadow 0.2s;
  &:hover:not(:disabled) {
    background: linear-gradient(90deg, #818cf8 0%, #6366f1 100%);
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.13);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
.notes-list {
  min-width: 700px;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
  padding: 10px;
}
.empty-notes {
  text-align: center;
  color: #a0aec0;
  font-size: 1.1rem;
  margin-top: 32px;
}
.note-card.large {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 32px 32px 20px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  transition: box-shadow 0.2s;
  font-size: 1rem;
  &:hover {
    box-shadow: 0 6px 24px rgba(99, 102, 241, 0.13);
  }
}
.note-content {
  font-size: 1.18rem;
  color: #2d3748;
  margin-bottom: 4px;
  white-space: pre-wrap;
}
.note-edit-input {
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  padding: 8px 12px;
  font-size: 1.1rem;
  background: #f8fafc;
  resize: vertical;
  margin-bottom: 4px;
  transition: border 0.2s;
  &:focus {
    border: 1.5px solid #6366f1;
    outline: none;
  }
}
.note-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  color: #64748b;
}
.note-type {
  font-weight: 600;
  color: #6366f1;
  margin-right: 12px;
}
.note-actions {
  display: flex;
  gap: 8px;
}
.icon-btn {
  background: none;
  border: none;
  font-size: 1.15em;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: #f1f5f9;
    color: #6366f1;
  }
}
.icon-btn.delete:hover {
  color: #f87171;
  background: #fef2f2;
}
.icon-btn.save:hover {
  color: #059669;
  background: #ecfdf5;
}
.icon-btn.cancel:hover {
  color: #b91c1c;
  background: #fef2f2;
}
.icon-btn.download:hover {
  color: #2563eb;
  background: #e0e7ff;
}
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin: 16px 0;
}
.pagination-controls button {
  padding: 6px 16px;
  border-radius: 6px;
  border: 1.5px solid #6366f1;
  background: #fff;
  color: #6366f1;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
