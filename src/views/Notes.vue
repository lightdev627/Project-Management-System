<template>
  <div class="notes-root">
    <div class="notes-header">
      <div class="notes-title">📝 Project Notes</div>
      <form class="add-note-form" @submit.prevent="addNote">
        <textarea
          v-model="newNote"
          class="note-input"
          placeholder="Write a new note..."
          rows="2"
        />
        <button class="add-btn" :disabled="!newNote.trim()">Add Note</button>
      </form>
    </div>
    <div class="notes-list">
      <div v-if="notes.length === 0" class="empty-notes">
        No notes yet. Start documenting your project insights!
      </div>
      <div v-for="(note, idx) in notesSorted" :key="note.id" class="note-card">
        <div class="note-content" v-if="!note.editing">{{ note.content }}</div>
        <textarea
          v-else
          v-model="note.editContent"
          class="note-edit-input"
          rows="2"
        />
        <div class="note-meta">
          <span class="note-date">{{ formatDate(note.updatedAt) }}</span>
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
              @click="deleteNote(idx)"
              class="icon-btn delete"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const notes = ref([]);
const newNote = ref("");

function addNote() {
  if (!newNote.value.trim()) return;
  notes.value.unshift({
    id: Date.now() + Math.random(),
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

const notesSorted = computed(() =>
  notes.value.slice().sort((a, b) => b.updatedAt - a.updatedAt)
);
</script>

<style lang="scss">
.notes-root {
  font-family: "Segoe UI", "Roboto", "Arial", sans-serif;
  background: linear-gradient(120deg, #f8fafc 0%, #e3e8f0 100%);
  min-height: 100vh;
  padding: 32px 0 0 0;
}
.notes-header {
  max-width: 700px;
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
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 32px;
}
.empty-notes {
  text-align: center;
  color: #a0aec0;
  font-size: 1.1rem;
  margin-top: 32px;
}
.note-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 20px 24px 14px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 6px 24px rgba(99, 102, 241, 0.13);
  }
}
.note-content {
  font-size: 1.13rem;
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
  justify-content: space-between;
  align-items: center;
  font-size: 0.98rem;
  color: #64748b;
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
</style>
