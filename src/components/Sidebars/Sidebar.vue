<script setup>
  import { useRoute } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '../../store';

  const route = useRoute();
  const userStore = useUserStore();
  const { currentUser } = storeToRefs(userStore);

  const menuList = [
  {
    icon: 'inbox',
    label: 'Dashboard',
    linkTo: '/',
    separator: false
  },
  {
    icon: 'send',
    label: 'Setup',
    linkTo: '/setup',
    separator: false
  },
  {
    icon: 'delete',
    label: 'Project Timeline',
    linkTo: '/timeline',
    separator: false
  },
  {
    icon: 'error',
    label: 'Task List',
    linkTo: '/list',
    separator: false
  },
  {
    icon: 'settings',
    label: 'Daily Tasks',
    linkTo: '/dailytasks',
    separator: false
  },
  {
    icon: 'feedback',
    label: 'Weekly / Monthly Schedule',
    linkTo: '/schedule',
    separator: false
  },
  {
    icon: 'help',
    label: 'Notes',
    linkTo: '/notes',
    separator: false
  }
]

// Helper to get initials from name
function getInitials(name) {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}
</script>

<template>
  <q-scroll-area class="fit">
    <div class="user-card" v-if="currentUser">
      <div class="avatar-wrapper">
        <div class="avatar">
          {{ getInitials(currentUser.Title) }}
        </div>
      </div>
      <div class="user-info">
        <div class="user-name">{{ currentUser.Title }}</div>
        <div class="user-email">{{ currentUser.Email }}</div>
      </div>
    </div>
    <q-list>
      <template v-for="(menuItem, index) in menuList" :key="index">
        <q-item clickable :to="menuItem.linkTo" :active="route.path === menuItem.linkTo" v-ripple>
          <q-item-section avatar>
            <q-icon :name="menuItem.icon" />
          </q-item-section>
          <q-item-section>
            {{ menuItem.label }}
          </q-item-section>
        </q-item>
        <q-separator :key="'sep' + index"  v-if="menuItem.separator" />
      </template>
    </q-list>
  </q-scroll-area>
</template>

<style scoped>
.q-scroll-area {
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(60, 72, 88, 0.08);
  padding: 18px 0;
  margin: 12px;
}

.user-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px 0 rgba(60, 72, 88, 0.10);
  padding: 18px 16px 14px 16px;
  margin-bottom: 18px;
  flex-direction: row;
}
.avatar-wrapper {
  margin-right: 14px;
}
.avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, #b3d4fc 0%, #1976d2 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7rem;
  font-weight: 700;
  box-shadow: 0 2px 8px 0 rgba(60, 72, 88, 0.10);
}
.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.user-name {
  font-size: 1.1rem;
  font-weight: 500;
  color: #1a237e;
}
.user-email {
  font-size: 0.7rem;
  color: #849ca8;
  margin-top: 2px;
}
.q-list {
  padding: 5px 8px;
}

.q-item {
  border-radius: 12px;
  margin-bottom: 6px;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  font-size: 1.08rem;
  font-weight: 500;
}

.q-item:hover {
  background: #e3eafc;
  box-shadow: 0 2px 8px 0 rgba(60, 72, 88, 0.06);
  transform: translateY(-2px) scale(1.03);
}

.q-item--active, .q-item[aria-selected="true"] {
  background: #b3d4fc !important;
  color: #1a237e !important;
  box-shadow: 0 2px 12px 0 rgba(60, 72, 88, 0.10);
}

.q-item-section[avatar] {
  min-width: 38px;
}

.q-icon {
  font-size: 1.5rem;
  color: #1976d2;
}

.q-separator {
  margin: 8px 0;
}
</style>