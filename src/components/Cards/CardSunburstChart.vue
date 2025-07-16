<template>
	<a-card :bordered="false" class="dashboard-pie-chart">
		<Sunburst component-id="chartId" :data="data"/>
	</a-card>
</template>

<script setup>
	import Sunburst from "@/components/Charts/ChartSunburst.vue";
	import {reactive} from "vue";
	import {sunburstData} from '@/assets/sunburst_data.js';

	const data = reactive(sunburstData);
</script>