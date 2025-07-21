<template>
  <q-card class="schedule-root">
    <div class="schedule-header">
      <div class="schedule-selects">
        <span class="select-icon">YEAR : </span>
        <select v-model="selectedYear" class="selectbox">
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <span class="select-icon">MONTH : </span>
        <select v-model="selectedMonth" class="selectbox">
          <option v-for="(month, idx) in months" :key="month" :value="idx">
            {{ month }}
          </option>
        </select>
        <span class="select-icon">WEEK : </span>
        <select v-model="selectedWeek" class="selectbox">
          <option :value="null">All Weeks</option>
          <option
            v-for="(week, idx) in weeksInMonth"
            :key="week.label"
            :value="idx"
          >
            {{ week.label }}
          </option>
        </select>
      </div>
    </div>
    <table class="schedule-table">
      <thead>
        <tr>
          <th class="left-header">{{ leftColumnHeader }}</th>
          <th>Tasks</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIdx) in tableRows"
          :key="row.label"
          :class="{ 'highlight-row': isCurrent(row.label) }"
        >
          <td class="left-col">{{ row.label }}</td>
          <td>
            <div class="task-list">
              <transition-group name="fade" tag="span">
                <span
                  v-for="(task, tIdx) in row.tasks"
                  :key="task"
                  class="task-chip"
                >
                  {{ task }}
                  <button @click="removeTask(rowIdx, tIdx)" class="chip-remove">
                    &times;
                  </button>
                </span>
              </transition-group>
              <select
                v-model="selectedTask[rowIdx]"
                @change="addTask(rowIdx)"
                class="add-task-select"
              >
                <option :value="null">Add task...</option>
                <option
                  v-for="task in availableTasks(row.tasks)"
                  :key="task"
                  :value="task"
                >
                  {{ task }}
                </option>
              </select>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </q-card>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const tempTaskList = [
  "Design UI",
  "Write Documentation",
  "Implement Feature X",
  "Fix Bug Y",
  "Code Review",
  "Team Meeting",
  "Deploy Release",
];

const selectedYear = ref(currentYear);
const selectedMonth = ref(new Date().getMonth());
const selectedWeek = ref(null); // null = all weeks

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getWeeksInMonth(year, month) {
  const daysInMonth = getDaysInMonth(year, month);
  const weeks = [];
  let weekStart = 1;
  let weekEnd = 7 - (new Date(year, month, 1).getDay() - 1);
  if (weekEnd <= 0) weekEnd = 1;
  while (weekStart <= daysInMonth) {
    weekEnd = Math.min(weekEnd, daysInMonth);
    weeks.push({
      label: `Week ${weeks.length + 1} (${weekStart}-${weekEnd})`,
      start: weekStart,
      end: weekEnd,
    });
    weekStart = weekEnd + 1;
    weekEnd = weekStart + 6;
  }
  return weeks;
}

const weeksInMonth = computed(() =>
  getWeeksInMonth(selectedYear.value, selectedMonth.value)
);
const tableRows = ref([]);
const selectedTask = ref([]);

function resetTableRows() {
  if (selectedWeek.value === null) {
    tableRows.value = weeksInMonth.value.map((week) => ({
      label: week.label,
      tasks: [],
    }));
    selectedTask.value = Array(weeksInMonth.value.length).fill(null);
  } else {
    const week = weeksInMonth.value[selectedWeek.value];
    const days = [];
    for (let d = week.start; d <= week.end; d++) {
      const date = new Date(selectedYear.value, selectedMonth.value, d);
      days.push({
        label: date.toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
        }),
        tasks: [],
      });
    }
    tableRows.value = days;
    selectedTask.value = Array(days.length).fill(null);
  }
}

watch([selectedYear, selectedMonth, selectedWeek], resetTableRows, {
  immediate: true,
});

function addTask(rowIdx) {
  const task = selectedTask.value[rowIdx];
  if (task && !tableRows.value[rowIdx].tasks.includes(task)) {
    tableRows.value[rowIdx].tasks.push(task);
  }
  selectedTask.value[rowIdx] = null;
}

function removeTask(rowIdx, tIdx) {
  tableRows.value[rowIdx].tasks.splice(tIdx, 1);
}

function availableTasks(rowTasks) {
  return tempTaskList.filter((task) => !rowTasks.includes(task));
}

const leftColumnHeader = computed(() =>
  selectedWeek.value === null ? "Week" : "Day"
);

// Highlight current week/day
function isCurrent(label) {
  if (selectedWeek.value === null) {
    // Highlight current week if in current month/year
    if (
      selectedYear.value !== currentYear ||
      selectedMonth.value !== new Date().getMonth()
    )
      return false;
    const today = new Date().getDate();
    const week = weeksInMonth.value.find((w) => label === w.label);
    return week && today >= week.start && today <= week.end;
  } else {
    // Highlight current day if in current week/month/year
    const today = new Date();
    const labelDate = label.match(/\d+/g);
    if (!labelDate) return false;
    const dayNum = parseInt(labelDate[labelDate.length - 1]);
    return (
      selectedYear.value === today.getFullYear() &&
      selectedMonth.value === today.getMonth() &&
      dayNum === today.getDate()
    );
  }
}
</script>

<style lang="scss" scoped>
.schedule-root {
  font-family: "Segoe UI", "Roboto", "Arial", sans-serif;
  background: #ffffff;
  border-radius: 15px;
  min-height: 80vh;
  padding: 2rem;
  margin: 2rem;
}
.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 32px;
}
.schedule-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
}
.schedule-selects {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
}
.selectbox {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: #f1f5f9;
  font-size: 15px;
  margin: 0 2px;
  transition: border 0.2s;
  outline: none;
  &:focus {
    border: 1.5px solid #6366f1;
  }
}
.select-icon {
  font-size: 1.1em;
  margin: 0 2px 0 8px;
}
.schedule-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  padding: 32px 32px 24px 32px;
  margin: 0 32px;
  min-height: 400px;
  overflow-x: auto;
}
.schedule-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 1rem;
  border-top: 1px solid #dddddd;
}
.schedule-table th {
  background: #f1f5f9;
  color: #374151;
  font-weight: 600;
  padding: 12px 16px;
  border-bottom: 2px solid #e5e7eb;
  letter-spacing: 0.5px;
}
.schedule-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #fcfcfd;
  transition: background 0.2s;
}
.left-header {
  width: 180px;
  border-right: 1px solid #e7e8fd;
}
.left-col {
  background: #f8fafc;
  font-weight: 500;
  color: #6366f1;
  border-radius: 8px 0 0 8px;
  border-right: 1px solid #e7e8fd;
}
.highlight-row td {
  background: linear-gradient(90deg, #e0e7ff 0%, #f1f5f9 100%) !important;
  font-weight: 600;
  color: #3730a3;
}
.schedule-table tr:hover td {
  background: #f3f4f6;
}
.task-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.task-chip {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);
  color: #fff;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 14px;
  font-weight: 500;
  margin-right: 4px;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.08);
  transition: transform 0.15s, box-shadow 0.15s;
  animation: popin 0.3s;
}
@keyframes popin {
  0% {
    transform: scale(0.7);
    opacity: 0;
  }
  80% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}
.chip-remove {
  margin-left: 8px;
  color: #f87171;
  background: none;
  border: none;
  font-size: 1.1em;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: #b91c1c;
  }
}
.add-task-select {
  min-width: 120px;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: #f1f5f9;
  font-size: 14px;
  margin-left: 4px;
  transition: border 0.2s;
  outline: none;
  &:focus {
    border: 1.5px solid #6366f1;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.7);
}
</style>
