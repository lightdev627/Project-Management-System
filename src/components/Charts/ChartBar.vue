<template>
  <div>
    <canvas ref="canvasEl" :style="{ height: `${height}px` }"></canvas>
  </div>
</template>

<script setup>
	import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
	import { Chart, registerables } from 'chart.js';

	Chart.register(...registerables);

	const { data, height } = defineProps({
		data: { type: Object, required: true },
		height: { type: Number, default: 300 }
	});

	const canvasEl = ref(null);
	let chartInstance = null;

	function createChart() {
		const ctx = canvasEl.value.getContext('2d');
		chartInstance = new Chart(ctx, {
			type: 'bar',
			data,
			options: {
				layout: {
					padding: { top: 30, right: 15, left: 10, bottom: 5 }
				},
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false }
				},
				tooltips: {
					enabled: true,
					mode: 'index',
					intersect: false
				},
				scales: {
					y: {
						grid: {
							display: true,
							color: 'rgba(255, 255, 255, .2)',
							zeroLineColor: '#ffffff',
							borderDash: [6],
							borderDashOffset: [6]
						},
						ticks: {
							suggestedMin: 0,
							suggestedMax: 1000,
							display: true,
							color: '#fff',
							font: {
								size: 14,
								lineHeight: 1.5,
								weight: '600',
								family: 'Open Sans'
							}
						}
					},
					x: {
						grid: { display: false },
						ticks: {
							display: true,
							color: '#fff',
							font: {
								size: 14,
								lineHeight: 1.5,
								weight: '600',
								family: 'Open Sans'
							}
						}
					}
				}
			}
		});
	}

	function destroyChart() {
		if (chartInstance) {
			chartInstance.destroy();
			chartInstance = null;
		}
	}

	onMounted(createChart);
	onBeforeUnmount(destroyChart);

	watch(
		() => data,
		() => {
			destroyChart();
			createChart();
		},
		{ deep: true }
	);
</script>

<style scoped lang="scss">
	canvas {
		background-image: linear-gradient(to right, #00369e, #005cfd, #a18dff);
	}
</style>