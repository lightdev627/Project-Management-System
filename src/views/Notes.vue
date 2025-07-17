<template>
  <div class="notes-layout">
    <!-- Sidebar: Note Types -->
    <aside class="notes-sidebar">
      <div class="sidebar-title">Note Types</div>
      <ul class="note-types-list">
        <li
          v-for="type in noteTypes"
          :key="type"
          :class="{ selected: selectedType === type }"
          @click="selectType(type)"
        >
          {{ type }}
        </li>
      </ul>
    </aside>

    <!-- Main Content -->
    <div class="notes-main">
      <!-- Top Section: Add Note -->
      <div class="notes-header">
        <div class="notes-title">📝 Project Notes</div>
        <form class="add-note-form" @submit.prevent="addNote">
          <!-- Removed note-type-select -->
          <textarea
            v-model="newNote"
            class="note-input"
            placeholder="Write a new note..."
            rows="2"
          />
          <button class="add-btn" :disabled="!newNote.trim()">Add Note</button>
        </form>
      </div>
      <!-- Notes List -->
      <div class="notes-list">
        <div v-if="notesFiltered.length === 0" class="empty-notes">
          No notes yet. Start documenting your project insights!
        </div>
        <div
          v-for="(note, idx) in notesSortedFiltered"
          :key="note.id"
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
              >Created: {{ formatDate(note.createdAt) }}</span
            >
            <span class="note-date"
              >Updated: {{ formatDate(note.updatedAt) }}</span
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
                ❌
              </button>
              <button
                @click="downloadNote(note)"
                class="icon-btn download"
                title="Download Note"
              >
                ⬇️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import jsPDF from "jspdf";

const noteTypes = ["General", "Meeting", "Ideas", "Research", "Personal"];
const selectedType = ref(noteTypes[0]);
const notes = ref([]);
const newNote = ref("");
// Removed newNoteType

function selectType(type) {
  selectedType.value = type;
}

function addNote() {
  if (!newNote.value.trim()) return;
  notes.value.unshift({
    id: Date.now() + Math.random(),
    type: selectedType.value, // Always use selectedType
    content: newNote.value.trim(),
    editContent: "",
    editing: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  newNote.value = "";
}

function deleteNote(idx) {
  notes.value.splice(idx, 1);
}

function editNote(idx) {
  notes.value[idx].editing = true;
  notes.value[idx].editContent = notes.value[idx].content;
}

function saveEdit(idx) {
  const note = notes.value[idx];
  if (note.editContent.trim()) {
    note.content = note.editContent.trim();
    note.updatedAt = new Date();
  }
  note.editing = false;
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
  doc.text(`Created: ${formatDate(note.createdAt)}`, 10, 20);
  doc.text(`Updated: ${formatDate(note.updatedAt)}`, 10, 30);
  doc.setFontSize(16);
  doc.text("Note:", 10, 45);
  doc.setFontSize(12);
  const splitContent = doc.splitTextToSize(note.content, 180);
  doc.text(splitContent, 10, 55);
  doc.save(
    `Note-${note.type}-${formatDate(note.createdAt).replace(/\W+/g, "_")}.pdf`
  );
}

const notesFiltered = computed(() =>
  notes.value.filter((n) => n.type === selectedType.value)
);
const notesSortedFiltered = computed(() =>
  notesFiltered.value.slice().sort((a, b) => b.updatedAt - a.updatedAt)
);
</script>

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
  padding: 32px 0 0 0;
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
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
  overflow-y: auto;
  max-height: calc(100vh - 260px);
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
  font-size: 1.25rem;
  min-height: 120px;
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
</style>
