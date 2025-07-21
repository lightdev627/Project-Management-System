<template>
  <div>
    <ejs-chart style="height: 450px;" :title='title' :primaryXAxis='primaryXAxis' :primaryYAxis='primaryYAxis'>
      <e-series-collection>
        <e-series :dataSource='seriesData' type='StackingColumn' xName='x' yName='y' name='UK'> </e-series>
        <e-series :dataSource='seriesData' type='StackingColumn' xName='x' yName='y1' name='Germany'> </e-series>
        <e-series :dataSource='seriesData' type='StackingColumn' xName='x' yName='y2' name='France'> </e-series>
        <e-series :dataSource='seriesData' type='StackingColumn' xName='x' yName='y3' name='Italy'> </e-series>
      </e-series-collection>
    </ejs-chart>
  </div>
</template>
<script setup>
import { provide } from "vue";
import { ChartComponent as EjsChart, SeriesCollectionDirective as ESeriesCollection, SeriesDirective as ESeries, StackingColumnSeries, Category, Legend } from "@syncfusion/ej2-vue-charts";

const seriesData = [
  { x: '2014', y: 111.1, y1: 76.9,  y2: 66.1,  y3: 34.1 },
  { x: '2015', y: 127.3, y1: 99.5,  y2: 79.3,  y3: 38.2 },
  { x: '2016', y: 143.4, y1: 121.7, y2: 91.3,  y3: 44.0 },
  { x: '2017', y: 159.9, y1: 142.5, y2: 102.4, y3: 51.6 },
  { x: '2018', y: 175.4, y1: 166.7, y2: 112.9, y3: 61.9 },
  { x: '2019', y: 189.0, y1: 182.9, y2: 122.4, y3: 71.5 },
  { x: '2020', y: 202.7, y1: 197.3, y2: 120.9, y3: 82.0 }
];
const primaryXAxis = {
  title: 'Years',
  interval: 1,
  valueType: 'Category'
};
const primaryYAxis = {
  title: 'Sales in Billions',
  minimum: 0,
  maximum: 700,
  interval: 100,
  labelFormat: '{value}B'
};
const title = 'MEMBERS WORKLOAD';

provide('chart', [StackingColumnSeries, Category, Legend]);

</script>
<style scoped>

</style>