<template>
  <div class="quick-access-panel">
    <!-- Quick Access Header -->
    <div class="quick-access-header">
      <span>QUICK ACCESS</span>
    </div>
    <!-- Quick Access Buttons -->
    <a-row gutter="8" class="quick-access-buttons">
      <a-col :span="5">
        <router-link to="/timeline">
          <a-button type="default" shape="circle">
            <template #icon>
              <ProjectOutlined />
            </template>
          </a-button>
          <div class="quick-access-label">Project Timeline</div>
        </router-link>
      </a-col>
      <a-col :span="5">
        <router-link to="/dailytasks">
          <a-button type="default" shape="circle">
            <template #icon>
              <UnorderedListOutlined />
            </template>
          </a-button>
          <div class="quick-access-label">Daily Tasks</div>
        </router-link>
      </a-col>
      <a-col :span="5">
        <router-link to="/list">
          <a-button type="default" shape="circle">
            <template #icon>
              <TeamOutlined />
            </template>
          </a-button>
          <div class="quick-access-label">Task List</div>
        </router-link>
      </a-col>
      <a-col :span="5">
        <router-link to="/schedule">
          <a-button type="default" shape="circle">
            <template #icon>
              <ScheduleOutlined />
            </template>
          </a-button>
          <div class="quick-access-label">Weekly/Monthly Schedule</div>
        </router-link>
      </a-col>
      <a-col :span="4">
        <router-link to="/notes">
          <a-button type="default" shape="circle">
            <template #icon>
              <FileTextOutlined />
            </template>
          </a-button>
          <div class="quick-access-label">Notes</div>
        </router-link>
      </a-col>
    </a-row>
    <!-- Today's Date -->
    <div class="today-date">
      <span>TODAY'S DATE</span>
      <span class="date-value">{{ today }}</span>
    </div>
    <!-- Announcements Table -->
    <div class="section-title">ANNOUNCEMENTS</div>
    <a-table :columns="announcementColumns" :dataSource="announcementData" size="small" :pagination="false" bordered />
    <!-- Needs Urgent Attention Table -->
    <div class="section-title">NEEDS URGENT ATTENTION</div>
    <a-table :columns="urgentColumns" :dataSource="urgentData" size="small" :pagination="false" bordered />
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { ProjectOutlined, FileTextOutlined, TeamOutlined, ScheduleOutlined, UnorderedListOutlined } from '@ant-design/icons-vue';

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const announcementColumns = [
    { title: 'POSTING DATE', dataIndex: 'date', key: 'date' },
    { title: 'Posted by', dataIndex: 'by', key: 'by' },
    { title: 'DETAILS', dataIndex: 'details', key: 'details' },
  ];

  const announcementData = ref([
    { key: 1, date: '', by: '', details: '' },
    { key: 2, date: '', by: '', details: '' },
    { key: 3, date: '', by: '', details: '' },
    { key: 4, date: '', by: '', details: '' },
    { key: 5, date: '', by: '', details: '' },
    { key: 6, date: '', by: '', details: '' },
    { key: 7, date: '', by: '', details: '' },
    { key: 8, date: '', by: '', details: '' },
  ]);

  const urgentColumns = [
    { title: 'DEADLINE', dataIndex: 'deadline', key: 'deadline' },
    { title: 'Posted by', dataIndex: 'by', key: 'by' },
    { title: 'DETAILS', dataIndex: 'details', key: 'details' },
  ];

  const urgentData = ref([
    { key: 1, deadline: '', by: '', details: '' },
    { key: 2, deadline: '', by: '', details: '' },
    { key: 3, deadline: '', by: '', details: '' },
    { key: 4, deadline: '', by: '', details: '' },
    { key: 5, deadline: '', by: '', details: '' },
    { key: 6, deadline: '', by: '', details: '' },
    { key: 7, deadline: '', by: '', details: '' },
    { key: 8, deadline: '', by: '', details: '' },
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