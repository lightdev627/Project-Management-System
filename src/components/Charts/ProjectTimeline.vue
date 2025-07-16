<template>
  <div class="control-section">
    <div class="chart-center">
      <ejs-chart
        style='display:block'
        :theme='theme'
        id='chartcontainer'
        :title='title'
        :primaryXAxis='primaryXAxis'
        :primaryYAxis='primaryYAxis'
        :chartArea='chartArea'
        width='100%'
        height='365px'
        :tooltip='tooltip'
        :legendSettings='legendSettings'
      >
        <e-series-collection>
          <e-series
            :dataSource='seriesData'
            type='Column'
            xName='country'
            yName='walnuts'
            name='Walnuts'
            columnSpacing=0.4
            :cornerRadius='cornerRadius'
          ></e-series>
          <e-series
            :dataSource='seriesData'
            type='Column'
            xName='country'
            yName='almonds'
            name='Almonds'
            columnSpacing=0.4
            :cornerRadius='cornerRadius'
          ></e-series>
        </e-series-collection>
      </ejs-chart>
    </div>
  </div>
</template>

<script>
import { Browser } from '@syncfusion/ej2-base';
import { ChartComponent, SeriesDirective, SeriesCollectionDirective, ColumnSeries, Category, Tooltip, Legend, Highlight } from "@syncfusion/ej2-vue-charts";

export default {
  components: {
    'ejs-chart': ChartComponent,
    'e-series-collection': SeriesCollectionDirective,
    'e-series': SeriesDirective
  },
  data() {
    return {
      seriesData: [
        { country: 'Chile', walnuts: 175000, almonds: 11300 },
        { country: 'European Union', walnuts: 140000, almonds: 135000 },
        { country: 'Turkey', walnuts: 67000, almonds: 24000 },
        { country: 'India', walnuts: 33000, almonds: 4200 },
        { country: 'Australia', walnuts: 12000, almonds: 154000 }
      ],
      primaryXAxis: {
        valueType: 'Category',
        interval: 1,
        labelIntersectAction: 'Rotate45',
        majorGridLines: { width: 0 }
      },
      primaryYAxis: {
        title: 'Metric Tons',
        interval: 40000,
        lineStyle: { width: 0 }
      },
      chartArea: {
        border: { width: 0 },
        margin: { left: 10, right: 10, bottom: 20 }
      },
      cornerRadius: { topLeft: 4, topRight: 4 },
      title: 'Walnuts and Almonds Estimated Production for 2023',
      tooltip: { 
        enable: true,
        format: '${series.name}: <b>${point.y}</b>'
      },
      legendSettings: { 
        visible: true 
      }
    };
  },
  provide: {
    chart: [ColumnSeries, Legend, Category, Tooltip, Highlight]
  }
};
</script>

<style scoped>
  .control-section {
    width: 100%;
    padding: 15px;
  }

  .chart-center {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  #chartcontainer {
    width: 100% !important;
    max-width: 800px;
    height: auto;
  }
</style>