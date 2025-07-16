<template>
	<div>
		<SunburstChart component-id="chartId" :data="data"/>
	</div>
</template>

<script setup>
	import {reactive} from "vue";
	import SunburstChart from "@/components/Charts/Sunburst.vue";
	import {sunburstData} from '@/assets/sunburst_data.js';

	const data = reactive(sunburstData);
</script>