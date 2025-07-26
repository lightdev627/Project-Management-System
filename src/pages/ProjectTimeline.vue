<script setup>
import { ref, provide, onMounted, watch } from "vue";
import { GanttComponent, ColumnsDirective, ColumnDirective, Edit, Toolbar, Selection, DayMarkers } from "@syncfusion/ej2-vue-gantt";

import { useTimelineStore } from "../store";
import { addItem } from '../actions/addItem';
import { editItem } from '../actions/editItem';
import { getItem } from '../actions/getItem';
import { deleteItem } from '../actions/deleteItem';
import LoadingSpinner from "../components/LoadingSpinner.vue";

const timelineStore = useTimelineStore();

provide('gantt', [Edit, Toolbar, Selection, DayMarkers]);

defineExpose({
  GanttComponent,
  ColumnsDirective,
  ColumnDirective
});
defineOptions({ name: "ProjectTimeline" });

const ganttData = ref([]);
const loading = ref(true);

// Utility to ensure date fields are Date objects
function normalizeGanttDates(item) {
  const dateFields = ["start_date", "end_date", "deadline_date"];
  const newItem = { ...item };
  dateFields.forEach(field => {
    if (newItem[field] && typeof newItem[field] === "string") {
      newItem[field] = new Date(newItem[field]);
    }
  });
  if (Array.isArray(newItem.subtasks)) {
    newItem.subtasks = newItem.subtasks.map(normalizeGanttDates);
  }
  return newItem;
}

onMounted(() => {
  loading.value = true;
  const fields = ["ID", "Title", "start_date", "end_date", "duration", "deadline_date", "timeline_progress", "status", "assigned_to", "resource_info"];
  getItem("Plans", fields).then(res => {
    const normalized = res.map(normalizeGanttDates);
    timelineStore.setList(normalized);
    loading.value = false;
  })

})

watch(
  () => timelineStore.timelineList,
  (source) => {
    ganttData.value = source
  },
  { immediate: true, deep: true }
)

const taskFields = {
  id: "ID",
  name: "Title",
  assignedTo: "assigned_to",
  startDate: "start_date",
  endDate: "end_date",
  duration: "duration",
  deadlineDate: "deadline_date",
  passedDays: "passed_days",
  leftDays: "left_days",
  progress: "timeline_progress",
  child: "subtasks",
  resourceInfo: "resource_info",
  indicators: "Indicators",
  status: "status",
};
const viewMode = ref({ timelineViewMode: "Week" });
const editSettings = ref({
  allowAdding: true,
  allowEditing: true,
  allowDeleting: true,
  allowTaskbarEditing: true,
  showDeleteConfirmDialog: true,
});
const labelSettings = ref({
    middleLabel: "resourceInfo",middleLabelFont: {
    size: "12px",  // Adjust font size to fit within the task bar
    color: "#ffffff"  // Ensure the font color is visible on the bar
  }, });
const splitterSettings = ref({ position: "23%" });
const toolbar = ref(["Add", "Edit", "Delete", "Update", "Cancel"]);
const allowSelection = ref(true);

function onActionComplete(args) {
  if (args.requestType === "add") {
    const addData = {
      Title: args.data.Title,
      start_date: args.data.start_date,
      end_date: args.data.end_date,
      duration: args.data.duration,
      deadline_date: args.data.deadline_date,
      timeline_progress: args.data.timeline_progress,
      child: args.data.childRecoards,
      status: args.data.status,
      assigned_to: args.data.assigned_to,
    };
    addItem("Plans", addData).then(res => {
      timelineStore.addLine(normalizeGanttDates({
        ...addData,
        ID: args.data.ID
      }))
    })
  }
  else if (args.requestType === "save") {
    const editData = {
      Title: args.data.Title,
      start_date: args.data.start_date,
      end_date: args.data.end_date,
      duration: args.data.duration,
      deadline_date: args.data.deadline_date,
      timeline_progress: args.data.timeline_progress,
      child: args.data.childRecoards,
      status: args.data.status,
      assigned_to: args.data.assigned_to,
    };

    editItem("Plans", args.data.ID, editData).then(res => {
      timelineStore.addLine(normalizeGanttDates({
        ...editData,
        ID: args.data.ID
      }))
    });
  } else if (args.requestType === "delete") {
    deleteItem("Plans", args.data.map(item => item.ID)).then(res => {
      timelineStore.deleteLine(args.data.map(item => item.ID))
    });
  }
}

const statusOptions = [
  { value: "notstarted", text: "NOT STARTED" },
  { value: "inprogress", text: "IN PROGRESS" },
  { value: "delayed", text: "DELAYED" },
  { value: "roadblock", text: "ROADBLOCK" },
  { value: "completed", text: "COMPLETED" },
];

const statusEditParams = ref({
  params: {
    dataSource: statusOptions,
    fields: { text: "text", value: "value" },
    allowFiltering: true,
    popupHeight: "200px",
  },
});

function queryTaskbarInfo(args) {
  switch (args.data.status) {
    case "completed":
      args.taskbarBgColor = "green";
      args.progressBarBgColor = "green";
      break;
    case "roadblock":
      args.taskbarBgColor = "red";
      args.progressBarBgColor = "red";
      break;
    case "delayed":
      args.taskbarBgColor = "yellow";
      args.progressBarBgColor = "yellow";
      break;
    case "inprogress":
      args.taskbarBgColor = "blue";
      args.progressBarBgColor = "blue";
      break;
    default:
      args.taskbarBgColor = "grey";
      args.progressBarBgColor = "grey";
  }
}

</script>

<template>
  <LoadingSpinner :showing="loading" text="Loading project timeline...">
    <q-card class="timeline-body">
      <GanttComponent
        :dataSource="ganttData"
        :taskFields="taskFields"
        :treeColumnIndex="1"
        :height="600"
        :timelineSettings="viewMode"
        :editSettings="editSettings"
        :labelSettings="labelSettings"
        :splitterSettings="splitterSettings"
        :toolbar="toolbar"
        :allowSelection="allowSelection"
        :highlightWeekends="true"
        :taskbarHeight="20"
        :rowHeight="40"
        :queryTaskbarInfo="queryTaskbarInfo"
        :actionComplete="onActionComplete"
      >
        <ColumnsDirective>
          <ColumnDirective
            field="ID"
            headerText="Task ID"
            width="70"
            textAlign="Right"
          ></ColumnDirective>
          <ColumnDirective
            field="Title"
            headerText="Task Name"
            textAlign="Left"
            width="200"
          ></ColumnDirective>
          <ColumnDirective
            field="assigned_to"
            headerText="Assigned To"
            textAlign="Left"
            width="100"
          ></ColumnDirective>
          <ColumnDirective
            field="start_date"
            headerText="Start Date"
            textAlign="Right"
            format="dd-MM-yy"
            width="150"
          ></ColumnDirective>
          <ColumnDirective
            field="deadline_date"
            headerText="Deadline Date"
            textAlign="Right"
            type="date"
            editType="datepickeredit"
            format="dd-MM-yy"
            width="150"
          ></ColumnDirective>
          <ColumnDirective
            field="duration"
            headerText="Duration"
            textAlign="Left"
            width="100"
          ></ColumnDirective>
          <ColumnDirective
            field="PassedDays"
            headerText="Days Passed From Start Date"
            textAlign="Left"
            width="100"
          ></ColumnDirective>
          <ColumnDirective
            field="LeftDays"
            headerText="Days Left To Deadline"
            textAlign="Left"
            width="100"
          ></ColumnDirective>
          <ColumnDirective
            field="timeline_progress"
            headerText="Timeline Progress"
            textAlign="Left"
            width="110"
          ></ColumnDirective>
          <ColumnDirective
            field="status"
            headerText="Status"
            textAlign="Right"
            width="150"
            editType="dropdownedit"
            :edit="statusEditParams"
          />
        </ColumnsDirective>
      </GanttComponent>
    </q-card>
  </LoadingSpinner>
</template>

<style lang="scss" scoped>
@import url("https://cdn.syncfusion.com/ej2/tailwind.css");
.timeline-body {
  margin: 2rem;
  padding: 2rem;
  background: #ffffff;
  min-height: 80vh;
  border-radius: 15px;
}
</style>
