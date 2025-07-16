<template>
	<a-row gutter="24">
		<a-col :span="6">
			<QuickAccessPanel />
		</a-col>
		<a-col :span="18">
			<div class="overview-section">
				<!-- Horizontally long filter card at the top -->
				<a-card bordered style="margin-bottom: 20px;">
					<a-row gutter="16" align="middle">
						<a-col :span="6">
							<span style="font-size:14px; font-weight:500; margin-right:8px;">Member:</span>
							<a-select style="width: 70%;" placeholder="Select Member">
								<a-select-option value="ALL">ALL</a-select-option>
								<a-select-option v-for="member in baseMembers" :key="member" :value="member">{{ member }}</a-select-option>
							</a-select>
						</a-col>
						<a-col :span="6">
							<span style="font-size:14px; font-weight:500; margin-right:8px;">Project:</span>
							<a-select style="width: 70%;" placeholder="Select Project">
								<a-select-option v-for="project in projectList" :key="project">{{ project }}</a-select-option>
							</a-select>
						</a-col>
					</a-row>
				</a-card>
				<a-row gutter="16">
					<a-col>
						<a-row gutter="16">
							<a-col :span="10">
								<a-card bordered>
									<SunburstCard />
								</a-card>
							</a-col>
							<a-col :span="4">
								<a-card title="Member" bordered bodyStyle="padding: 8px; min-height: 260px;">
									<div style="min-height: 570px; overflow-y: auto;">
										<ul class="fantastic-member-list">
											<li
												v-for="member in memberList"
												:key="member"
												:class="['fantastic-member-item', { selected: selectedMembers.includes(member) }]"
												@click="toggleMember(member)"
											>
												<label class="fantastic-checkbox-label">
													<input
														type="checkbox"
														:checked="selectedMembers.includes(member)"
														@change.stop="toggleMember(member)"
														class="fantastic-checkbox"
													/>
													<span class="fantastic-custom-checkbox"></span>
													<span class="fantastic-member-name">{{ member }}</span>
												</label>
											</li>
										</ul>
									</div>
								</a-card>
							</a-col>
							<a-col :span="10">
								<a-card bordered>
									<!-- Replace with Bar Chart -->
									<MemberWorkloadCard :selectedMembers="selectedMembers" />
								</a-card>
							</a-col>
						</a-row>
						<a-row gutter="16" style="margin-top: 16px;">
							<a-col :span="10">
								<a-card bordered>
									<ProjectProgressCard />
								</a-card>
							</a-col>
							<a-col :span="4">
								<a-card title="Project" bordered bodyStyle="padding: 8px; min-height: 260px;">
									<div style="min-height: 342px; overflow-y: auto;">
										<ul style="list-style: none; padding: 0; margin: 0; font-size: 13px;">
											<li v-for="project in projectList" :key="project" style="padding: 4px 0; border-bottom: 1px solid #f0f0f0;">{{ project }}</li>
										</ul>
									</div>
								</a-card>
							</a-col>
							<a-col :span="10">
								<a-card bordered>
									<ProjectTimelineCard />
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
		</a-col>
	</a-row>
</template>

<script setup>
	import { ref } from 'vue';
	import SunburstCard from '@/components/Cards/SunburstCard.vue';
	import MemberWorkloadCard from '@/components/Cards/MemberWorkloadCard.vue';
	import ProjectProgressCard from '@/components/Cards/ProjectProgressCard.vue';
	import ProjectTimelineCard from '@/components/Cards/ProjectTimelineCard.vue';
	import QuickAccessPanel from '@/components/QuickAccessPanel.vue';

	const baseMembers = [
		'Bob Dasika', 'Gale Wallace', 'Jaydeep Patel', 'Norman Whitehead',
		'Ricardo James', 'Shilpa Vadlamudi', 'Tommeka Johnson', '(blank)'
	];
	const memberList = ['ALL', ...baseMembers];
	const selectedMembers = ref(['ALL']);

	function toggleMember(member) {
		if (member === 'ALL') {
			if (selectedMembers.value.includes('ALL')) {
				// Deselect all
				selectedMembers.value = [];
			} else {
				// Select all
				selectedMembers.value = [...memberList];
			}
			return;
		}
		const idx = selectedMembers.value.indexOf(member);
		if (idx === -1) {
			selectedMembers.value.push(member);
			// If all individual members are selected, also select 'ALL'
			if (baseMembers.every(m => selectedMembers.value.includes(m))) {
				if (!selectedMembers.value.includes('ALL')) selectedMembers.value.unshift('ALL');
			}
		} else {
			selectedMembers.value.splice(idx, 1);
			// If 'ALL' is selected, remove it if any member is deselected
			const allIdx = selectedMembers.value.indexOf('ALL');
			if (allIdx !== -1 && member !== 'ALL') {
				selectedMembers.value.splice(allIdx, 1);
			}
		}
	}

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

.fantastic-member-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
}
.fantastic-member-item {
  display: flex;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;
  &:hover, &.selected {
    background: #f5f7fa;
  }
}
.fantastic-checkbox-label {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
}
.fantastic-checkbox {
  display: none;
}
.fantastic-custom-checkbox {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid #bfc7d1;
  background: #fff;
  margin-right: 10px;
  position: relative;
  transition: border 0.15s;
}
.fantastic-checkbox:checked + .fantastic-custom-checkbox {
  background: #409eff;
  border-color: #409eff;
}
.fantastic-checkbox:checked + .fantastic-custom-checkbox::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1.5px;
  width: 5px;
  height: 9px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.fantastic-member-name {
  flex: 1;
  font-weight: 400;
  color: #222;
  letter-spacing: 0.2px;
}
.fantastic-select-all {
  background: #f5f7fa;
  border: 1px solid #bfc7d1;
  color: #409eff;
  font-weight: 500;
  border-radius: 4px;
  padding: 4px 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.15s, border 0.15s;
}
.fantastic-select-all:hover {
  background: #e6f0fa;
  border-color: #409eff;
}
</style>