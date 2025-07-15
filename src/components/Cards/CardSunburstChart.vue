<template>

	<!-- Statuses Breakdown Card -->
	<a-card :bordered="false" class="dashboard-pie-chart">
		<Sunburst component-id="chartId" :data="data"/>
		<!-- <div class="card-content">
			<p>Overview of current project statuses and their distribution across the team.</p>
		</div>
		<a-row class="card-footer" type="flex" justify="center" align="top">
			<a-col :span="6">
				<h4>45%</h4>
				<span>In Progress</span>
			</a-col>
			<a-col :span="6">
				<h4>30%</h4>
				<span>Completed</span>
			</a-col>
			<a-col :span="6">
				<h4>15%</h4>
				<span>Pending</span>
			</a-col>
			<a-col :span="6">
				<h4>10%</h4>
				<span>Blocked</span>
			</a-col>
		</a-row> -->
	</a-card>
	<!-- Statuses Breakdown Card -->

</template>

<script setup>
	import Sunburst from "@/components/Charts/ChartSunburst.vue";
	import {reactive} from "vue";
	import {sunburstData} from '@/assets/sunburst_data.js';

	const data = reactive(sunburstData);
</script>