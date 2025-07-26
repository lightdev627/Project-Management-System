<script setup>
  import { onMounted, ref } from 'vue';
  import { getItem } from '../../actions/getItem';

  const data = ref([]);
  const pivotData1Q = ref([]);
  const pivotData2Q = ref([]);
  const pivotData3Q = ref([]);

  onMounted(() => {
    const fields = ["Id", "Title", "start_date", "end_date", "duration", "deadline_date", "passed_days", "left_days", "timeline_progress", "status", "assigned_to"];

    getItem("Plans", fields).then(res => {
      data.value = res;

      pivotData1Q.value = res.map(item => {
        return {
          project: item.Title,
          progress: item.timeline_progress
        }
      })

      pivotData2Q.value = res.map(item => {
        return {
          project: item.Title,
          daysPassed: item.passed_days,
          daysLeft: item.left_days
        }
      })

      const data1 = [
        { status: "completed", assigned_to: "Norman Whitehead" },
        { status: "completed", assigned_to: "Bob Dasika" },
        { status: "delayed", assigned_to: "Gale Wallace" },
        { status: "in progress", assigned_to: "Gale Wallace" },
        { status: "in progress", assigned_to: "Bob Dasika" },
      ];

      const statusCounts = data1.reduce((acc, item) => {
        const status = item.status;
        if (acc[status]) {
          acc[status]++;
        } else {
          acc[status] = 1;
        }
        return acc;
      }, {});

      pivotData3Q.value = Object.keys(statusCounts).map(status => ({
        status: status,
        count: statusCounts[status]
      }));


      
    })
  })

  const pivotColumns1Q = [
    { name: "project", label: "PROJECT", field: "project", align: "left" },
    { name: "progress", label: "PROGRESS %", field: "progress", align: "left" },
  ];

  const pivotColumns2Q = [
    { name: "project", label: "PROJECT", field: "project", align: "left" },
    { name: "daysPassed", label: "DAYS PASSED", field: "daysPassed", align: "left" },
    { name: "daysLeft", label: "DAYS LEFT", field: "daysLeft", align: "left" },
  ];

  const pivotColumns3Q = [
    { name: "status", label: "STATUS", field: "status", align: "left" },
    { name: "count", label: "COUNT", field: "count", align: "left" },
  ];

  const pivotColumns4Q = [
    { name: "member", label: "MEMBER", field: "member", align: "left" },
    { name: "completed", label: "COMPLETED", field: "completed", align: "left" },
    { name: "ongoing", label: "ON GOING", field: "ongoing", align: "left" },
    { name: "delayed", label: "DELAYED", field: "delayed", align: "left" },
    { name: "pending", label: "PENDING", field: "pending", align: "left" },
    { name: "notStarted", label: "NOT STARTED", field: "notStarted", align: "left" },
  ];
  const pivotData4Q = [
    {
      member: "Norman Whitehead",
      completed: 0,
      ongoing: 0,
      delayed: 0,
      pending: 0,
      notStarted: 0,
    },
    {
      member: "Bob Dasika",
      completed: 0,
      ongoing: 0,
      delayed: 0,
      pending: 0,
      notStarted: 0,
    },
    {
      member: "Jaydeep Patel",
      completed: 0,
      ongoing: 0,
      delayed: 0,
      pending: 0,
      notStarted: 0,
    },
    {
      member: "Gale Wallace",
      completed: 0,
      ongoing: 0,
      delayed: 0,
      pending: 0,
      notStarted: 0,
    },
    {
      member: "Ricardo James",
      completed: 0,
      ongoing: 0,
      delayed: 0,
      pending: 0,
      notStarted: 0,
    },
    {
      member: "Shilpa Vadlamudi",
      completed: 0,
      ongoing: 0,
      delayed: 0,
      pending: 0,
      notStarted: 0,
    },
    {
      member: "Tommeka Johnson",
      completed: 0,
      ongoing: 0,
      delayed: 0,
      pending: 0,
      notStarted: 0,
    },
  ];
</script>

<template>
  <div class="pivot-section">
    <div class="pivot-header">PIVOT TABLES</div>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Projects Timeline Progress %</div>
            <q-table
              :columns="pivotColumns1Q"
              :rows="pivotData1Q"
              dense
              flat
              :pagination="{rowsPerPage: 0}"
              bordered
              style="flex: 1; overflow: auto"
            >
              <template v-slot:bottom>
                <div style="text-align: center">
                  There are {{ pivotData1Q.length }} items.
                </div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Projects Progress in Days</div>
            <q-table
              :columns="pivotColumns2Q"
              :rows="pivotData2Q"
              dense
              flat
              :pagination="{rowsPerPage: 0}"
              bordered
              style="flex: 1; overflow: auto"
            >
              <template v-slot:bottom>
                <div style="text-align: center">
                  There are {{ pivotData2Q.length }} items.
                </div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Total Statuses</div>
            <q-table
              :columns="pivotColumns3Q"
              :rows="pivotData3Q"
              dense
              flat
              :pagination="{rowsPerPage: 0}"
              bordered
              style="flex: 1; overflow: auto"
            >
              <template v-slot:bottom>
                <div style="text-align: center">
                  There are {{ pivotData3Q.length }} items.
                </div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Members Workload</div>
            <q-table
              :columns="pivotColumns4Q"
              :rows="pivotData4Q"
              dense
              flat
              :pagination="{rowsPerPage: 0}"
              bordered
              style="flex: 1; overflow: auto"
            >
              <template v-slot:bottom>
                <div style="text-align: center">
                  There are {{ pivotData4Q.length }} items.
                </div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .pivot-section {
  margin-top: 32px;
}
.pivot-header {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  letter-spacing: 1px;
}
</style>