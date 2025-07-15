<template>
	<component :is="navbarFixed ? 'a-affix' : 'div'" :offset-top="top">
		<a-layout-header>
			<a-row type="flex" align="middle">
				<a-col :span="1" class="sidebar-toggle-col">
					<a-button 
						type="link" 
						class="sidebar-toggler" 
						@click="$emit('toggleSidebar', ! sidebarCollapsed), resizeEventHandler()"
						:title="sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" :class="'icon icon-tabler icons-tabler-outline' + (sidebarCollapsed ? ' icon-tabler-layout-sidebar-left-collapse' : ' icon-tabler-layout-sidebar-left-expand')">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
							<path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
							<path d="M9 4v16" />
							<path d="M15 10l-2 2l2 2" />
						</svg>
					</a-button>
				</a-col>
				<!-- / Sidebar Toggle Button -->

				<!-- Header Breadcrumbs & Title Column -->
				<a-col :span="23" :md="6">
					<a-breadcrumb>
						<a-breadcrumb-item><router-link to="/"> Pages</router-link></a-breadcrumb-item>
						<a-breadcrumb-item>{{ this.$route.name }}</a-breadcrumb-item>
					</a-breadcrumb>
					<!-- / Header Breadcrumbs -->

					<!-- Header Page Title -->
					<div class="ant-page-header-heading">
						<span class="ant-page-header-heading-title">{{ this.$route.name }}</span>
					</div>
				</a-col>
				<!-- / Header Breadcrumbs & Title Column -->

				<!-- Header Control Column -->
				<a-col :span="24" :md="16" class="header-control">
					<a-dropdown :trigger="['click']" overlayClassName="header-notifications-dropdown" :getPopupContainer="() => wrapper">
						<a-badge count="4">
							<a class="ant-dropdown-link" @click="e => e.preventDefault()">
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M10 2C6.68632 2 4.00003 4.68629 4.00003 8V11.5858L3.29292 12.2929C3.00692 12.5789 2.92137 13.009 3.07615 13.3827C3.23093 13.7564 3.59557 14 4.00003 14H16C16.4045 14 16.7691 13.7564 16.9239 13.3827C17.0787 13.009 16.9931 12.5789 16.7071 12.2929L16 11.5858V8C16 4.68629 13.3137 2 10 2Z" fill="#111827"/>
									<path d="M10 18C8.34315 18 7 16.6569 7 15H13C13 16.6569 11.6569 18 10 18Z" fill="#111827"/>
								</svg>
							</a>
						</a-badge>
						
						<a-list item-layout="horizontal" class="header-notifications-list" :data-source="notificationsData" slot="overlay">
							<a-list-item slot="renderItem" slot-scope="item">
								<a-list-item-meta>
									<template #description>
										<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path fill-rule="evenodd" clip-rule="evenodd" d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM11 6C11 5.44772 10.5523 5 10 5C9.44772 5 9 5.44772 9 6V10C9 10.2652 9.10536 10.5196 9.29289 10.7071L12.1213 13.5355C12.5118 13.9261 13.145 13.9261 13.5355 13.5355C13.9261 13.145 13.9261 12.5118 13.5355 12.1213L11 9.58579V6Z" fill="#111827"/>
										</svg>
										<span>{{ item.time }}</span>
									</template>
									<a slot="title" href="#">{{ item.title }}</a>
									<a-avatar v-if="item.img"
										slot="avatar"
										shape="square"
										:src="item.img"
									/>
									<a-avatar v-else
										shape="square"
										slot="avatar"  v-html="item.svg"/>
									
								</a-list-item-meta>
							</a-list-item>
						</a-list>
					</a-dropdown>
					<a-button type="link" ref="secondarySidebarTriggerBtn" @click="$emit('toggleSettingsDrawer', true)">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M11.4892 3.17094C11.1102 1.60969 8.8898 1.60969 8.51078 3.17094C8.26594 4.17949 7.11045 4.65811 6.22416 4.11809C4.85218 3.28212 3.28212 4.85218 4.11809 6.22416C4.65811 7.11045 4.17949 8.26593 3.17094 8.51078C1.60969 8.8898 1.60969 11.1102 3.17094 11.4892C4.17949 11.7341 4.65811 12.8896 4.11809 13.7758C3.28212 15.1478 4.85218 16.7179 6.22417 15.8819C7.11045 15.3419 8.26594 15.8205 8.51078 16.8291C8.8898 18.3903 11.1102 18.3903 11.4892 16.8291C11.7341 15.8205 12.8896 15.3419 13.7758 15.8819C15.1478 16.7179 16.7179 15.1478 15.8819 13.7758C15.3419 12.8896 15.8205 11.7341 16.8291 11.4892C18.3903 11.1102 18.3903 8.8898 16.8291 8.51078C15.8205 8.26593 15.3419 7.11045 15.8819 6.22416C16.7179 4.85218 15.1478 3.28212 13.7758 4.11809C12.8896 4.65811 11.7341 4.17949 11.4892 3.17094ZM10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z" fill="#111827"/>
						</svg>
					</a-button>
					<router-link to="/sign-in" class="btn-sign-in" @click="e => e.preventDefault()">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z" fill="#111827"/>
						</svg>
						<span>Sign In</span>
					</router-link>
					<!-- / Header Control Buttons -->

					<!-- Header Search Input -->
					<a-input-search class="header-search" :class="searchLoading ? 'loading' : ''" placeholder="Type here…" @search="onSearch" :loading='searchLoading'>
						<svg slot="prefix" width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4ZM2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 9.29583 13.5892 10.4957 12.8907 11.4765L17.7071 16.2929C18.0976 16.6834 18.0976 17.3166 17.7071 17.7071C17.3166 18.0976 16.6834 18.0976 16.2929 17.7071L11.4765 12.8907C10.4957 13.5892 9.29583 14 8 14C4.68629 14 2 11.3137 2 8Z" fill="#111827"/>
						</svg>
					</a-input-search>
				</a-col>
			</a-row>
		</a-layout-header>
	</component>
</template>

<script setup>
	import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

	// Static notifications data outside props
	const defaultNotificationsData = [
		{
			title: 'New message from Sophie',
			img: 'images/face-1.jpg',
			time: '13 minutes ago',
		},
		{
			title: 'New album by Travis Scott',
			svg: `<svg width="20" height="20" viewBox="0 0 107 107" ...</svg>`,
			time: '1 day ago',
		},
		{
			title: 'Payment completed',
			svg: `<svg width="20" height="20" viewBox="0 0 20 20" ...</svg>`,
			time: '2 days ago',
		},
	]

	// Define props without default for notificationsData
	const props = defineProps({
		navbarFixed: {
			type: Boolean,
			default: false,
		},
		sidebarCollapsed: {
			type: Boolean,
			default: false,
		},
		notificationsData: {
			type: Array,
			required: false,
		},
	})

	// Computed that falls back to defaultNotificationsData if prop not provided
	const notificationsData = computed(() => {
		return props.notificationsData && props.notificationsData.length
			? props.notificationsData
			: defaultNotificationsData
	})

	const top = ref(0)
	const searchLoading = ref(false)
	const wrapper = ref(document.body)

	const resizeEventHandler = () => {
		top.value = top.value ? 0 : -0.01
	}

	const onSearch = (value) => {
		// handle search logic
	}

	onMounted(() => {
		wrapper.value = document.getElementById('layout-dashboard')
		window.addEventListener('resize', resizeEventHandler)
	})

	onBeforeUnmount(() => {
		window.removeEventListener('resize', resizeEventHandler)
	})
</script>
