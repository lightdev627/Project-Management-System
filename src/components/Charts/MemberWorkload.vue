<script setup>
import { provide } from "vue";
import { ChartComponent as EjsChart, SeriesCollectionDirective as ESeriesCollection, SeriesDirective as ESeries, StackingColumnSeries, Category, Legend } from "@syncfusion/ej2-vue-charts";

const props = defineProps({
  memberList: Array
})

const statusList = [
  { name: "NOT STARTED", color: "grey" },
  { name: "roadblock", color: "red" },
  { name: "DELAYED", color: "yellow" },
  { name: "ON GOING", color: "blue" },
  { name: "COMPLETED", color: "green" }
];

const seriesData = {
  "NOT STARTED": [3,2,1,1,0,10,2,2,3,1],
  "roadblock": [2,1,1,1,1,0,0,1,2,0],
  "DELAYED": [1,1,2,1,2,1,0,1,1,2],
  "ON GOING": [0,1,1,2,2,1,1,1,1,1],
  "COMPLETED": [0,0,1,1,1,1,0,0,0,1]
};

const getSeries = () => statusList.map(status => ({
  dataSource: props.memberList.map((member, idx) => ({ x: member, y: seriesData[status.name][idx] })),
  xName: 'x',
  yName: 'y',
  name: status.name,
  type: 'StackingColumn',
  fill: status.color
}));

const primaryXAxis = {
  title: 'Members',
  valueType: 'Category',
  labelIntersectAction: 'Rotate45',
  labelRotation: 45
};
const primaryYAxis = {
  title: 'Tasks',
  minimum: 0,
  maximum: 12,
  interval: 2
};
const title = 'MEMBERS WORKLOAD';

provide('chart', [StackingColumnSeries, Category, Legend]);
</script>

<template>
  <div>
    <ejs-chart style="height: 600px;" :title='title' :primaryXAxis='primaryXAxis' :primaryYAxis='primaryYAxis' :legendSettings="{ visible: true }">
      <e-series-collection>
        <e-series
          v-for="series in getSeries()"
          :key="series.name"
          v-bind="series"
        />
      </e-series-collection>
    </ejs-chart>
  </div>
</template>

<style scoped>
</style>