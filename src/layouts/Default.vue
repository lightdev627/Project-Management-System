<template>
	<div>

		<a-layout class="layout-default" id="layout-default" :class="[layoutClass]">
			<DefaultHeader></DefaultHeader>
			<a-layout-content>
				<router-view />
			</a-layout-content>
			<DefaultFooter></DefaultFooter>
		</a-layout>
	</div>
</template>

<script setup>
	import { computed } from 'vue'
	import { useRoute } from 'vue-router'

	import DefaultHeader from '../components/Headers/DefaultHeader'
	import DefaultFooter from '../components/Footers/DefaultFooter'

	const route = useRoute()

	// Sets layout's element's class based on route's meta data.
	const layoutClass = computed(() => route.meta.layoutClass)
</script>