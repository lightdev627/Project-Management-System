<template>
  <div class="overview-section">
    <q-card flat class="q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md items-center">
          <div class="col-6">
            <span style="font-size: 14px; font-weight: 500; margin-right: 8px">Member:</span>
            <q-select
              v-model="selectedMember"
              :options="baseMembers"
              label="Select Member"
              dense
              outlined
              style="width: 70%"
              emit-value
              map-options
              :clearable="true"
            />
          </div>
          <div class="col-6">
            <span style="font-size: 14px; font-weight: 500; margin-right: 8px">Project:</span>
            <q-select
              v-model="selectedProject"
              :options="projectList"
              label="Select Project"
              dense
              outlined
              style="width: 70%"
              emit-value
              map-options
              :clearable="true"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div class="row q-col-gutter-md">
      <div class="col-5">
        <q-card flat bordered>
          <q-card-section>
            <SunburstCard />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-2">
        <q-card flat bordered>
          <q-card-section>
            <div style="min-height: 625px; overflow-y: auto">
              <ul class="fantastic-member-list">
                <li
                  v-for="member in memberList"
                  :key="member"
                  :class="[
                    'fantastic-member-item',
                    { selected: selectedMembers.includes(member) },
                  ]"
                >
                  <q-checkbox
                    :model-value="selectedMembers.includes(member)"
                    @update:model-value="toggleMember(member)"
                    :label="member"
                    dense
                  />
                </li>
              </ul>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-5">
        <q-card flat bordered>
          <q-card-section>
            <MemberWorkloadCard />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-5">
        <q-card flat bordered>
          <q-card-section>
            <ProjectProgressCard />
          </q-card-section>
        </q-card>
      </div>
      <div class="col-2">
        <q-card flat bordered>
          <q-card-section>
            <div style="min-height: 342px; overflow-y: auto">
              <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px;">
                <li
                  v-for="project in projectList"
                  :key="project"
                  style="padding: 4px 0; border-bottom: 1px solid #f0f0f0"
                >
                  {{ project }}
                </li>
              </ul>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-5">
        <q-card flat bordered>
          <q-card-section>
            <ProjectTimelineCard />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>

  import { ref } from "vue";

  import SunburstCard from "./SunburstCard.vue";
import MemberWorkloadCard from "./MemberWorkloadCard.vue";
import ProjectProgressCard from "./ProjectProgressCard.vue";
import ProjectTimelineCard from "./ProjectTimelineCard.vue";

const baseMembers = [
  "Bob Dasika",
  "Gale Wallace",
  "Jaydeep Patel",
  "Norman Whitehead",
  "Ricardo James",
  "Shilpa Vadlamudi",
  "Tommeka Johnson",
];
const memberList = ["ALL", ...baseMembers];
const selectedMembers = ref(["ALL"]);
const selectedMember = ref(null);
const selectedProject = ref(null);

function toggleMember(member) {
  if (member === "ALL") {
    if (selectedMembers.value.includes("ALL")) {
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
    if (baseMembers.every((m) => selectedMembers.value.includes(m))) {
      if (!selectedMembers.value.includes("ALL"))
        selectedMembers.value.unshift("ALL");
    }
  } else {
    selectedMembers.value.splice(idx, 1);
    // If 'ALL' is selected, remove it if any member is deselected
    const allIdx = selectedMembers.value.indexOf("ALL");
    if (allIdx !== -1 && member !== "ALL") {
      selectedMembers.value.splice(allIdx, 1);
    }
  }
}

const projectList = [
  "BCAC_Phase_1",
  "BCAC_Phase_2",
  "BCAC_Phase_3",
  "BCAC_Phase_4",
  "BCAC_Phase_5",
  "Capabilities Planning",
  "Development",
  "Planning",
  "Procurement",
];
</script>

<style scoped>
  .overview-section {
  margin-bottom: 32px;
}
.overview-header {
  font-size: 18px;
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
  content: "";
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