<template>

	<!-- Layout Header ( Navbar ) -->
	<a-layout-header>
		<div class="header-col header-brand">
			<h6>Muse Dashboard</h6>

			<!-- Trigger Button For Navigation Menu For Small Screens -->
			<a-button type="link" @click="collapseNav = collapseNav ? 0 : 1 " class="btn-menu-trigger">
				<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"/></svg>
			</a-button>
			<!-- Trigger Button For Navigation Menu For Small Screens -->

		</div>
		<div class="header-col header-nav">

			<!-- Navigation Menu For Large Screens -->
			<a-menu mode="horizontal" class="menu-large">
				<a-menu-item>
					<router-link to="/dashboard" class="nav-link" @click="e => e.preventDefault()">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path class="fill-muted" d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z" fill="#111827"/>
							<path class="fill-muted" d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z" fill="#111827"/>
							<path class="fill-muted" d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z" fill="#111827"/>
						</svg>
						<span>Dashboard</span>
					</router-link>
				</a-menu-item>
			</a-menu>
			<!-- / Navigation Menu For Large Screens -->

			<!-- Collapsible Navigation Menu For Small Screens -->
			<div class="menu-small">
				<a-collapse v-model="collapseNav" accordion>
					<a-collapse-panel key="1">
						<a-menu mode="vertical">
							<a-menu-item>
								<router-link to="/dashboard" class="nav-link" @click="e => e.preventDefault()">
									<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path class="fill-muted" d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z" fill="#111827"/>
										<path class="fill-muted" d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z" fill="#111827"/>
										<path class="fill-muted" d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z" fill="#111827"/>
									</svg>
									<span>Dashboard</span>
								</router-link>
							</a-menu-item>
						</a-menu>
					</a-collapse-panel>
				</a-collapse>
			</div>
		</div>
		<div class="header-col header-btn">
			<a-button href="https://www.creative-tim.com/product/muse-vue-ant-design-dashboard" target="_blank" type="primary" shape="round">FREE DOWNLOAD</a-button>
		</div>
	</a-layout-header>
</template>

<script setup>
	import { ref } from 'vue'

	const collapseNav = ref(0)
</script>

<style lang="scss" scoped>
	.nav-link svg {
		margin-right: 5px;
		vertical-align: middle;
	}
	.nav-link span {
		vertical-align: middle;
	}
	.ant-menu-submenu-popup {
		width: 100%;
	}
</style>