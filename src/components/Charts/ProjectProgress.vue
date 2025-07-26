<template>
  <div>
    <ejs-chart style="height: 400px;" :title='title' :primaryXAxis='primaryXAxis' :primaryYAxis='primaryYAxis' :legendSettings='legendSettings'>
      <e-series-collection>
        <e-series 
          :dataSource='seriesData' 
          type='StackingColumn' 
          xName='project' 
          yName='daysLeft' 
          name='DAYS LEFT' 
          :marker='markerSettingsLeft'
          fill="#4F81BD"
        />
        <e-series 
          :dataSource='seriesData' 
          type='StackingColumn' 
          xName='project' 
          yName='daysPassed' 
          name='DAYS PASSED' 
          :marker='markerSettingsPassed'
          fill="#F79646"
        />
      </e-series-collection>
    </ejs-chart>
  </div>
</template>
<script setup>
import { provide } from "vue";
import { ChartComponent as EjsChart, SeriesCollectionDirective as ESeriesCollection, SeriesDirective as ESeries, StackingColumnSeries, Category, Legend, DataLabel } from "@syncfusion/ej2-vue-charts";

const seriesData = [
  { project: 'Website Release', daysLeft: 28, daysPassed: 16 },
  { project: 'Sell the new product', daysLeft: 43, daysPassed: 23 },
  { project: 'Product Release', daysLeft: 22, daysPassed: 15 }
];
const primaryXAxis = {
  title: '',
  valueType: 'Category',
};
const primaryYAxis = {
  title: '',
  minimum: 0,
  maximum: 70,
  interval: 20,
};
const title = 'PROJECTS PROGRESS IN DAYS';
const legendSettings = { visible: true };
const markerSettingsLeft = {
  dataLabel: {
    visible: true,
    position: 'Middle',
    font: { color: '#fff', fontWeight: 'bold' }
  }
};
const markerSettingsPassed = {
  dataLabel: {
    visible: true,
    position: 'Middle',
    font: { color: '#fff', fontWeight: 'bold' }
  }
};

provide('chart', [StackingColumnSeries, Category, Legend, DataLabel]);

</script>
<style scoped>

</style>