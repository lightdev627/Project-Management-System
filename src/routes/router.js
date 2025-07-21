import { createRouter, createWebHistory } from 'vue-router'

// Importar layouts
import MainLayout from '../layouts/MainLayout.vue'

// Importar páginas
import Dashboard from '../pages/Dashboard.vue'
import Setup from '../pages/Setup.vue'
import ProjectTimeline from '../pages/ProjectTimeline.vue'
import TaskList from '../pages/TaskList.vue'
import DailyTasks from '../pages/DailyTasks.vue'
import Schedule from '../pages/Schedule.vue'
import Notes from '../pages/Notes.vue'

import NotFound from '../pages/NotFound.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '/',
        component: Dashboard
      },
      {
        path: '/setup',
        component: Setup
      },
      {
        path: '/timeline',
        component: ProjectTimeline
      },
      {
        path: '/list',
        component: TaskList
      },
      {
        path: '/dailytasks',
        component: DailyTasks
      },
      {
        path: '/schedule',
        component: Schedule
      },
      {
        path: '/notes',
        component: Notes
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
  },
];

const router = createRouter({
  routes,
  history: createWebHistory()
})

router.resolve({
  name: 'not-found',
  params: { pathMatch: ['not', 'found'] },
}).href

export default router;
