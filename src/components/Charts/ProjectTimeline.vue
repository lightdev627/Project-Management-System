<template>
  <div class="chart-container">
    <EjsChart
      ref="chart"
      :title="title"
      :primaryXAxis="primaryXAxis"
      :primaryYAxis="primaryYAxis"
      width="100%"
      height="400px"
    >
      <SeriesCollection>
        <Series
          :dataSource="seriesData"
          type="Column"
          xName="country"
          yName="walnuts"
          name="Walnuts"
        />
      </SeriesCollection>
    </EjsChart>
  </div>
</template>

<script setup>
import { provide } from "vue";
import {
  ChartComponent as EjsChart,
  SeriesDirective as Series,
  SeriesCollectionDirective as SeriesCollection,
  ColumnSeries,
  Category,
  Tooltip,
} from "@syncfusion/ej2-vue-charts";

const seriesData = [
  { country: "Chile", walnuts: 175000 },
  { country: "European", walnuts: 140000 },
  { country: "Turkey", walnuts: 67000 },
  { country: "India", walnuts: 33000 },
  { country: "Australia", walnuts: 12000 },
];

const primaryXAxis = {
  valueType: "Category",
  labelRotation: 0,
};

const primaryYAxis = {
  minimum: 0,
  maximum: 200000,
  interval: 50000,
};

const title = "PROJECT TIMELINE PROGRESS %";

provide("chart", [ColumnSeries, Category, Tooltip]);
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-width: 450px;
  height: 400px;
}

.e-series-0 rect {
  fill: #4472c4;
}
.e-series-1 rect {
  fill: #ed7d31;
}
</style>
