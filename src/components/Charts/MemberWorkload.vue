<template>
  <div>
    <div class="control-section" style="min-height: 621px;">
			<div align='center'>
        <div ref="chartContainer" style="width: 100%; height: 500px;"></div>
			</div>
		</div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import Highcharts from 'highcharts'

  const chartContainer = ref(null)

  Highcharts.setOptions({
    lang: {
      decimalPoint: '.',
      thousandsSep: ','
    }
  })

  onMounted(() => {
    Highcharts.chart(chartContainer.value, {
      chart: {
        type: "column"
      },
      title: {
        text: "GSMG Market Allocation"
      },
      xAxis: {
        categories: ["ARK-ETH", "HOT-ETH", "NEO-ETH", "REP-ETH", "SNT-ETH"]
      },
      yAxis: {
        min: 0,
        title: {
          text: "Total allocation %"
        }
      },
      legend: {
        reversed: true
      },
      plotOptions: {
        series: {
          stacking: "normal"
        }
      },
      series: [
        {
          name: "Buy",
          data: [6.16, 6.47, 8.61, 5.44, 7.34]
        },
        {
          name: "Sell",
          data: [1.92, 1.6, 4.29, 1.7, 0.4]
        },
        {
          name: "Free",
          data: [
            10 - 6.16 - 1.92,
            10 - 6.47 - 1.6,
            15 - 8.61 - 4.29,
            10 - 5.44 - 1.7,
            10 - 7.34 - 0.4
          ]
        }
      ]
    })
  })
</script>

<style scoped lang="scss">
	
</style>