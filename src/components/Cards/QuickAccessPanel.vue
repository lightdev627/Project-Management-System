<template>
  <div class="quick-access-panel ">
    <!-- Quick Access Header -->
    <div class="quick-access-header">
      <span>QUICK ACCESS</span>
    </div>
    <!-- Quick Access Buttons -->
    <div class="row quick-access-buttons items-center q-col-gutter-md">
      <div class="col">
        <router-link to="/timeline">
          <q-btn round color="primary" icon="timeline" />
        </router-link>
        <div class="quick-access-label">Timeline</div>
      </div>
      <div class="col-3">
        <router-link to="/dailytasks">
          <q-btn round color="primary" icon="checklist" />
        </router-link>
        <div class="quick-access-label">Daily Tasks</div>
      </div>
      <div class="col">
        <router-link to="/list">
          <q-btn round color="primary" icon="group" />
        </router-link>
        <div class="quick-access-label">Task List</div>
      </div>
      <div class="col">
        <router-link to="/schedule">
          <q-btn round color="primary" icon="event" />
        </router-link>
        <div class="quick-access-label">Schedule</div>
      </div>
      <div class="col">
        <router-link to="/notes">
          <q-btn round color="primary" icon="description" />
        </router-link>
        <div class="quick-access-label">Notes</div>
      </div>
    </div>
    <!-- Today's Date -->
    <div class="today-date">
      <span>TODAY'S DATE</span>
      <span class="date-value">{{ today }}</span>
    </div>
    <!-- Announcements Table -->
    <div class="section-title">ANNOUNCEMENTS</div>
    <q-table :columns="announcementColumns" :rows="announcementData" dense bordered flat :pagination="{rowsPerPage: 0}" />
    <!-- Needs Urgent Attention Table -->
    <div class="section-title">NEEDS URGENT ATTENTION</div>
    <q-table :columns="urgentColumns" :rows="urgentData" dense bordered flat :pagination="{rowsPerPage: 0}" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const today = new Date().toLocaleDateString('en-GB', {
  day: '2-digit', month: 'short', year: 'numeric'
});

const announcementColumns = [
  { name: 'date', label: 'POSTING DATE', field: 'date', align: 'left' },
  { name: 'by', label: 'Posted by', field: 'by', align: 'left' },
  { name: 'details', label: 'DETAILS', field: 'details', align: 'left' },
];

const announcementData = ref([
  { id: 1, date: '', by: '', details: '' },
  { id: 2, date: '', by: '', details: '' },
  { id: 3, date: '', by: '', details: '' },
  { id: 4, date: '', by: '', details: '' },
  { id: 5, date: '', by: '', details: '' },
  { id: 6, date: '', by: '', details: '' },
  { id: 7, date: '', by: '', details: '' },
  { id: 8, date: '', by: '', details: '' },
]);

const urgentColumns = [
  { name: 'deadline', label: 'DEADLINE', field: 'deadline', align: 'left' },
  { name: 'by', label: 'Posted by', field: 'by', align: 'left' },
  { name: 'details', label: 'DETAILS', field: 'details', align: 'left' },
];

const urgentData = ref([
  { id: 1, deadline: '', by: '', details: '' },
  { id: 2, deadline: '', by: '', details: '' },
  { id: 3, deadline: '', by: '', details: '' },
  { id: 4, deadline: '', by: '', details: '' },
  { id: 5, deadline: '', by: '', details: '' },
  { id: 6, deadline: '', by: '', details: '' },
  { id: 7, deadline: '', by: '', details: '' },
  { id: 8, deadline: '', by: '', details: '' },
]);
</script>

<style scoped>
.quick-access-panel {
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.quick-access-header {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 12px;
  text-align: center;
  letter-spacing: 1px;
}
.quick-access-buttons {
  margin-bottom: 16px;
  text-align: center;
}
.quick-access-label {
  font-size: 11px;
  margin-top: 4px;
  color: #555;
}
.today-date {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin: 12px 0 16px 0;
  font-weight: 500;
}
.section-title {
  font-size: 13px;
  font-weight: 600;
  margin: 18px 0 6px 0;
  color: #2a3b4d;
}
</style> 