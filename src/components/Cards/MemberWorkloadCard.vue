<script setup>
	import MemberWorkloadChart from '../Charts/MemberWorkload.vue'

	const props = defineProps({
		member: Array
	})

</script>

<template>
	<div style="min-height: 625px;">
		<MemberWorkloadChart :memberList="member"/>
	</div>
</template>
