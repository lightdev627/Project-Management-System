<template>
  <a-card class="timeline-body">
    <GanttComponent
      :dataSource="data"
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
    >
      <ColumnsDirective>
        <ColumnDirective
          field="TaskID"
          headerText="Task ID"
          width="70"
          textAlign="Right"
        ></ColumnDirective>
        <ColumnDirective
          field="TaskName"
          headerText="Task Name"
          textAlign="Left"
          width="200"
        ></ColumnDirective>
        <ColumnDirective
          field="AssignedTo"
          headerText="Assigned To"
          textAlign="Left"
          width="100"
        ></ColumnDirective>
        <ColumnDirective
          field="Dependency"
          headerText="Dependency"
          textAlign="Left"
          width="100"
        ></ColumnDirective>
        <ColumnDirective
          field="StartDate"
          headerText="Start Date"
          textAlign="Right"
          format="dd-MM-yy"
          width="150"
        ></ColumnDirective>
        <ColumnDirective
          field="DeadlineDate"
          headerText="Deadline Date"
          textAlign="Right"
          type="date"
          editType="datepickeredit"
          format="dd-MM-yy"
          width="150"
        ></ColumnDirective>
        <ColumnDirective
          field="Duration"
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
          field="Progress"
          headerText="Timeline Progress"
          textAlign="Left"
          width="110"
        ></ColumnDirective>
        <ColumnDirective
          field="Status"
          headerText="Status"
          textAlign="Right"
          width="150"
          editType="dropdownedit"
          :edit="statusEditParams"
        />
      </ColumnsDirective>
    </GanttComponent>
  </a-card>
</template>

<script setup>
import { ref } from "vue";
import {
  GanttComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-vue-gantt";
import { projectNewData } from "@/assets/gantt_data.js";

defineExpose();
defineOptions({ name: "ProjectTimeline" });

const data = ref(projectNewData);

const taskFields = {
  id: "TaskID",
  name: "TaskName",
  startDate: "StartDate",
  endDate: "EndDate",
  duration: "Duration",
  progress: "Progress",
  child: "subtasks",
  dependency: "Predecessor",
  resourceInfo: "resourceInfo",
  indicators: "Indicators",
  status: "Status",
};
const viewMode = ref({ timelineViewMode: "Week" });
const editSettings = ref({
  allowAdding: true,
  allowEditing: true,
  allowDeleting: true,
  allowTaskbarEditing: true,
  showDeleteConfirmDialog: true,
});
const labelSettings = ref({ rightLabel: "resourceInfo" });
const splitterSettings = ref({ position: "23%" });
const toolbar = ref(["Add", "Edit", "Delete", "Update", "Cancel"]);
const allowSelection = ref(true);

const statusOptions = [
  { value: "ontime", text: "ON TIME" },
  { value: "completed", text: "COMPLETED" },
  { value: "ongoing", text: "ON GOING" },
  { value: "atrisk", text: "AT RISK" },
  { value: "delayed", text: "DELAYED" },
  { value: "late", text: "LATE" },
  { value: "pending", text: "PENDING" },
  { value: "notstarted", text: "NOT STARTED" },
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
  switch (args.data.Status) {
    case "completed":
      args.taskbarBgColor = "#4caf50";
      break;
    case "ontime":
      args.taskbarBgColor = "#2196f3";
      break;
    case "ongoing":
      args.taskbarBgColor = "#ffeb3b";
      break;
    case "atrisk":
      args.taskbarBgColor = "#ff9800";
      break;
    case "delayed":
      args.taskbarBgColor = "#f44336";
      break;
    case "late":
      args.taskbarBgColor = "#9c27b0";
      break;
    case "pending":
      args.taskbarBgColor = "#607d8b";
      break;
    case "notstarted":
      args.taskbarBgColor = "#bdbdbd";
      break;
    default:
      args.taskbarBgColor = "#90a4ae";
  }
}
</script>

<style lang="scss" scoped>
@import url("https://cdn.syncfusion.com/ej2/tailwind.css");
.timeline-body {
  padding: 2rem;
  background: #ffffff;
  min-height: 80vh;
  border-radius: 15px;
}
</style>
