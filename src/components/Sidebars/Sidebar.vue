<template>
  <q-scroll-area class="fit">
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

<script setup>
  import { useRoute } from 'vue-router';
  const route = useRoute();

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

</script>

<style scoped>
.q-scroll-area {
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(60, 72, 88, 0.08);
  padding: 18px 0;
  margin: 12px;
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