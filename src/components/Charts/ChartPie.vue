<template>
  <div>
    <canvas ref="canvasEl" :style="{ height: `${height}px` }"></canvas>
  </div>
</template>

<script setup>
	import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
	import { Chart, registerables } from 'chart.js'

	Chart.register(...registerables)

	const { data, height } = defineProps({
		data: { type: Object, required: true },
		height: { type: Number, default: 300 }
	})

	const canvasEl = ref(null)
	let chartInstance = null

	function createChart() {
		const ctx = canvasEl.value.getContext('2d')
		chartInstance = new Chart(ctx, {
			type: 'pie',
			data,
			options: {
				layout: {
					padding: {
						top: 30,
						right: 15,
						left: 10,
						bottom: 5
					}
				},
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: true,
						position: 'bottom',
						labels: {
							color: '#333',
							font: {
								size: 12,
								family: 'Open Sans'
							},
							padding: 10
						}
					}
				},
				tooltips: {
					enabled: true,
					mode: 'index',
					intersect: false
				}
			}
		})
	}

	function destroyChart() {
		if (chartInstance) {
			chartInstance.destroy()
			chartInstance = null
		}
	}

	onMounted(createChart)
	onBeforeUnmount(destroyChart)

	watch(
		() => data,
		() => {
			destroyChart()
			createChart()
		},
		{ deep: true }
	)
</script>

<style scoped lang="scss">
	canvas {
		background: transparent;
	}
</style>
