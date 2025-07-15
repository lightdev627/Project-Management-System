<template>
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{paddingTop: 0, paddingBottom: 0 }">
		<template #title>
			<h6 class="font-semibold m-0">Platform Settings</h6>
		</template>
		<ul class="list settings-list">
			<li>
				<h6 class="list-header text-sm text-muted">ACCOUNT</h6>
			</li>
			<li>
				<a-switch v-model="emailForFollows" />
				<span>Email me when someone follows me</span>
			</li>
			<li>
				<a-switch v-model="emailForAnswers"/>
				<span>Email me when someone answers me</span>
			</li>
			<li>
				<a-switch v-model="emailForMentions" />
				<span>Email me when someone mentions me</span>
			</li>
			<li>
				<h6 class="list-header text-sm text-muted m-0">APPLICATION</h6>
			</li>
			<li>
				<a-switch v-model="emailForNewProjects" />
				<span>New launches and projects</span>
			</li>
			<li>
				<a-switch v-model="emailForProductUpdates" />
				<span>Monthly product updates</span>
			</li>
			<li>
				<a-switch v-model="emailForNewsletter" />
				<span>Subscribe to newsletter</span>
			</li>
		</ul>
	</a-card>
</template>

<script setup>
	import { reactive } from 'vue'

	const state = reactive({
		emailForFollows: true,
		emailForAnswers: false,
		emailForMentions: true,
		emailForNewProjects: true,
		emailForProductUpdates: false,
		emailForNewsletter: true
	})
</script>