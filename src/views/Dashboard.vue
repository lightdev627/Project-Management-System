<template>
	<a-row gutter="24">
		<a-col :span="6">
			<QuickAccessPanel />
		</a-col>
		<a-col :span="18">
			<!-- Overview Section -->
			<div class="overview-section">
				<div class="overview-header">OVERVIEW</div>
				<!-- Horizontally long filter card at the top -->
				<a-card bordered style="margin-bottom: 20px;">
					<a-row gutter="16" align="middle">
						<a-col :span="6">
							<span style="font-size:14px; font-weight:500; margin-right:8px;">Member:</span>
							<a-select style="width: 70%;" placeholder="Select Member">
								<a-select-option v-for="member in memberList" :key="member">{{ member }}</a-select-option>
							</a-select>
						</a-col>
						<a-col :span="6">
							<span style="font-size:14px; font-weight:500; margin-right:8px;">Project:</span>
							<a-select style="width: 70%;" placeholder="Select Project">
								<a-select-option v-for="project in projectList" :key="project">{{ project }}</a-select-option>
							</a-select>
						</a-col>
						<!-- Add more filters here if needed -->
					</a-row>
				</a-card>
				<a-row gutter="16">
					<!-- Main 2x2 grid for charts with vertical lists (no filter card) -->
					<a-col>
						<a-row gutter="16">
							<!-- Top row: Statuses Breakdown | Member List | Members Workload -->
							<a-col :span="10">
								<a-card title="Statuses Breakdown" bordered>
									<CardSunburstChart />
								</a-card>
							</a-col>
							<a-col :span="4">
								<a-card title="Member" bordered bodyStyle="padding: 8px; min-height: 260px;">
									<div style="max-height: 220px; overflow-y: auto;">
										<ul style="list-style: none; padding: 0; margin: 0; font-size: 13px;">
											<li v-for="member in memberList" :key="member" style="padding: 4px 0; border-bottom: 1px solid #f0f0f0;">{{ member }}</li>
										</ul>
									</div>
								</a-card>
							</a-col>
							<a-col :span="10">
								<a-card title="Members Workload" bordered>
									<!-- Replace with Bar Chart -->
									<CardBarChart />
								</a-card>
							</a-col>
						</a-row>
						<a-row gutter="16" style="margin-top: 16px;">
							<!-- Bottom row: Project Timeline Progress % | Project List | Projects Progress in Days -->
							<a-col :span="10">
								<a-card title="Project Timeline Progress %" bordered>
									<!-- Replace with Bar Chart -->
									<CardBarChart />
								</a-card>
							</a-col>
							<a-col :span="4">
								<a-card title="Project" bordered bodyStyle="padding: 8px; min-height: 260px;">
									<div style="max-height: 220px; overflow-y: auto;">
										<ul style="list-style: none; padding: 0; margin: 0; font-size: 13px;">
											<li v-for="project in projectList" :key="project" style="padding: 4px 0; border-bottom: 1px solid #f0f0f0;">{{ project }}</li>
										</ul>
									</div>
								</a-card>
							</a-col>
							<a-col :span="10">
								<a-card title="Projects Progress in Days" bordered>
									<!-- Replace with Bar Chart -->
									<CardBarChart />
								</a-card>
							</a-col>
						</a-row>
					</a-col>
				</a-row>
			</div>
			<!-- Pivot Tables Section -->
			<div class="pivot-section">
				<div class="pivot-header">PIVOT TABLES</div>
				<a-row gutter="16" style="margin-bottom: 16px;">
					<a-col :span="8">
						<a-card title="Projects Timeline Progress %" bordered :bodyStyle="{ minHeight: '260px', display: 'flex', flexDirection: 'column' }">
							<a-table :columns="pivotColumns1" :dataSource="pivotData1" size="small" :pagination="false" bordered style="flex:1; overflow:auto;" />
						</a-card>
					</a-col>
					<a-col :span="8">
						<a-card title="Projects Progress in Days" bordered :bodyStyle="{ minHeight: '260px', display: 'flex', flexDirection: 'column' }">
							<a-table :columns="pivotColumns2" :dataSource="pivotData2" size="small" :pagination="false" bordered style="flex:1; overflow:auto;" />
						</a-card>
					</a-col>
					<a-col :span="8">
						<a-card title="Total Statuses" bordered :bodyStyle="{ minHeight: '260px', display: 'flex', flexDirection: 'column' }">
							<a-table :columns="pivotColumns3" :dataSource="pivotData3" size="small" :pagination="false" bordered style="flex:1; overflow:auto;" />
						</a-card>
					</a-col>
				</a-row>
				<a-row gutter="16">
					<a-col :span="24">
						<a-card title="Members Workload" bordered :bodyStyle="{ minHeight: '260px', display: 'flex', flexDirection: 'column' }">
							<a-table :columns="pivotColumns4" :dataSource="pivotData4" size="small" :pagination="false" bordered style="flex:1; overflow:auto;" />
						</a-card>
					</a-col>
				</a-row>
			</div>
			<!-- Dashboard main content goes here -->
		</a-col>
	</a-row>
</template>

<script setup>
	import CardBarChart from '@/components/Cards/CardBarChart.vue';
	import CardSunburstChart from '@/components/Cards/CardSunburstChart.vue';
	import QuickAccessPanel from '../components/QuickAccessPanel.vue';

	const stats = [
		{
			title: "Today’s Sales",
			value: 53000,
			prefix: "$",
			suffix: "+30%",
			icon: `
				<svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M8.43338 7.41784C8.58818 7.31464 8.77939 7.2224 9 7.15101L9.00001 8.84899C8.77939 8.7776 8.58818 8.68536 8.43338 8.58216C8.06927 8.33942 8 8.1139 8 8C8 7.8861 8.06927 7.66058 8.43338 7.41784Z" fill="#111827"/>
					<path d="M11 12.849L11 11.151C11.2206 11.2224 11.4118 11.3146 11.5666 11.4178C11.9308 11.6606 12 11.8861 12 12C12 12.1139 11.9308 12.3394 11.5666 12.5822C11.4118 12.6854 11.2206 12.7776 11 12.849Z" fill="#111827"/>
					<path fill-rule="evenodd" clip-rule="evenodd" d="..." fill="#111827"/>
				</svg>`,
		},
		{
			title: "Today’s Users",
			value: 3200,
			suffix: "+20%",
			icon: `
				<svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="..." fill="#111827"/>
				</svg>`,
		},
		{
			title: "New Clients",
			value: 1200,
			prefix: "+",
			status: "danger",
			suffix: "-20%",
			icon: `
				<svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" clip-rule="evenodd" d="..." fill="#111827"/>
				</svg>`,
		},
		{
			title: "New Orders",
			value: 13200,
			prefix: "$",
			suffix: "+10%",
			icon: `
				<svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path fill-rule="evenodd" clip-rule="evenodd" d="..." fill="#111827"/>
				</svg>`,
		},
	];

	const tableColumns = [
		{
			title: 'COMPANIES',
			dataIndex: 'company',
			scopedSlots: { customRender: 'company' },
			width: 300,
		},
		{
			title: 'MEMBERS',
			dataIndex: 'members',
			scopedSlots: { customRender: 'members' },
		},
		{
			title: 'BUDGET',
			dataIndex: 'budget',
			class: 'font-bold text-muted text-sm',
		},
		{
			title: 'COMPLETION',
			dataIndex: 'completion',
			scopedSlots: { customRender: 'completion' },
		},
	];

	const tableData = [
		{
			key: '1',
			company: {
				name: 'Soft UI Shopify Version',
				logo: 'images/logos/logo-shopify.svg',
			},
			members: ["images/face-1.jpg", "images/face-4.jpg", "images/face-2.jpg", "images/face-3.jpg"],
			budget: '$14,000',
			completion: 60,
		},
		{
			key: '2',
			company: {
				name: 'Progress Track',
				logo: 'images/logos/logo-atlassian.svg',
			},
			members: ["images/face-4.jpg", "images/face-3.jpg"],
			budget: '$3,000',
			completion: 10,
		},
		{
			key: '3',
			company: {
				name: 'Fix Platform Errors',
				logo: 'images/logos/logo-slack.svg',
			},
			members: ["images/face-1.jpg", "images/face-2.jpg", "images/face-3.jpg"],
			budget: 'Not Set',
			completion: {
				label: '100',
				status: 'success',
				value: 100,
			},
		},
		{
			key: '4',
			company: {
				name: 'Launch new Mobile App',
				logo: 'images/logos/logo-spotify.svg',
			},
			members: ["images/face-1.jpg", "images/face-2.jpg"],
			budget: '$20,600',
			completion: {
				label: '100',
				status: 'success',
				value: 100,
			},
		},
		{
			key: '5',
			company: {
				name: 'Add the New Landing Page',
				logo: 'images/logos/logo-jira.svg',
			},
			members: ["images/face-1.jpg", "images/face-4.jpg", "images/face-2.jpg", "images/face-3.jpg"],
			budget: '$4,000',
			completion: 80,
		},
		{
			key: '6',
			company: {
				name: 'Redesign Online Store',
				logo: 'images/logos/logo-invision.svg',
			},
			members: ["images/face-1.jpg", "images/face-4.jpg", "images/face-3.jpg"],
			budget: '$2,000',
			completion: {
				label: 'Cancelled',
				status: 'exception',
				value: 100,
			},
		},
	];

	const memberList = [
		'Bob Dasika', 'Gale Wallace', 'Jaydeep Patel', 'Norman Whitehead',
		'Ricardo James', 'Shilpa Vadlamudi', 'Tommeka Johnson', '(blank)'
	];

	const projectList = [
		'BCAC_Phase_1', 'BCAC_Phase_2', 'BCAC_Phase_3', 'BCAC_Phase_4', 'BCAC_Phase_5',
		'Capabilities Planning', 'Development', 'Planning', 'Procurement'
	];

	const pivotColumns1 = [
		{ title: 'PROJECT', dataIndex: 'project', key: 'project' },
		{ title: 'PROGRESS %', dataIndex: 'progress', key: 'progress' },
	];
	const pivotData1 = [
		{ key: 1, project: 'Planning', progress: '100%' },
		{ key: 2, project: 'BCAC_Phase_2', progress: '0%' },
		{ key: 3, project: 'BCAC_Phase_3', progress: '0%' },
	];

	const pivotColumns2 = [
		{ title: 'PROJECT', dataIndex: 'project', key: 'project' },
		{ title: 'DAYS PASSED', dataIndex: 'daysPassed', key: 'daysPassed' },
		{ title: 'DAYS LEFT', dataIndex: 'daysLeft', key: 'daysLeft' },
	];
	const pivotData2 = [
		{ key: 1, project: 'Planning', daysPassed: 125, daysLeft: 0 },
		{ key: 2, project: 'BCAC_Phase_2', daysPassed: 0, daysLeft: 66 },
		{ key: 3, project: 'BCAC_Phase_3', daysPassed: 111, daysLeft: 0 },
	];

	const pivotColumns3 = [
		{ title: 'STATUS', dataIndex: 'status', key: 'status' },
		{ title: 'COUNT', dataIndex: 'count', key: 'count' },
	];
	const pivotData3 = [
		{ key: 1, status: 'COMPLETED', count: 8 },
		{ key: 2, status: 'ON GOING', count: 4 },
		{ key: 3, status: 'DELAYED', count: 1 },
		{ key: 4, status: 'PENDING', count: 2 },
		{ key: 5, status: 'NOT STARTED', count: 3 },
	];

	const pivotColumns4 = [
		{ title: 'MEMBER', dataIndex: 'member', key: 'member' },
		{ title: 'COMPLETED', dataIndex: 'completed', key: 'completed' },
		{ title: 'ON GOING', dataIndex: 'ongoing', key: 'ongoing' },
		{ title: 'DELAYED', dataIndex: 'delayed', key: 'delayed' },
		{ title: 'PENDING', dataIndex: 'pending', key: 'pending' },
		{ title: 'NOT STARTED', dataIndex: 'notStarted', key: 'notStarted' },
	];
	const pivotData4 = [
		{ key: 1, member: 'Norman Whitehead', completed: 0, ongoing: 0, delayed: 0, pending: 0, notStarted: 0 },
		{ key: 2, member: 'Bob Dasika', completed: 0, ongoing: 0, delayed: 0, pending: 0, notStarted: 0 },
		{ key: 3, member: 'Jaydeep Patel', completed: 0, ongoing: 0, delayed: 0, pending: 0, notStarted: 0 },
		{ key: 4, member: 'Gale Wallace', completed: 0, ongoing: 0, delayed: 0, pending: 0, notStarted: 0 },
		{ key: 5, member: 'Ricardo James', completed: 0, ongoing: 0, delayed: 0, pending: 0, notStarted: 0 },
		{ key: 6, member: 'Shilpa Vadlamudi', completed: 0, ongoing: 0, delayed: 0, pending: 0, notStarted: 0 },
		{ key: 7, member: 'Tommeka Johnson', completed: 0, ongoing: 0, delayed: 0, pending: 0, notStarted: 0 },
	];
</script>

<style lang="scss">
	.overview-section {
		margin-bottom: 32px;
	}
	.overview-header {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 16px;
		letter-spacing: 1px;
	}
	.pivot-section {
		margin-top: 32px;
	}
	.pivot-header {
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 16px;
		letter-spacing: 1px;
	}
</style>