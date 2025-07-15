import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue'
import DefaultLayout from './layouts/Default.vue'
import DashboardLayout from './layouts/Dashboard.vue'
import router from './router'
import {registerLicense} from '@syncfusion/ej2-base';
import {
  GanttPlugin,
  Toolbar,
  Edit,
  Selection,
  DayMarkers
} from '@syncfusion/ej2-vue-gantt'
import { Gantt } from '@syncfusion/ej2-gantt'

import './scss/app.scss';

const app = createApp(App);

// Register global components
app.component('layout-default', DefaultLayout)
app.component('layout-dashboard', DashboardLayout)

// Use plugins
app.use(Antd)
app.use(GanttPlugin)
Gantt.Inject(Toolbar, Edit, Selection, DayMarkers)

app.use(router)
app.mount('#app')
registerLicense("ORg4AjUWIQA/Gnt3VVhhQlJDfVddXGBWfFN0QHNYf1R0c19HZEwgOX1dQl9mSXlSckRiWH9ed3FcQ2dXUkQ=")