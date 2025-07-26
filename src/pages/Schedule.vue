<script setup>
  import { ref, computed, watch, onMounted } from "vue";
  import LoadingSpinner from '../components/LoadingSpinner.vue';
  import { useScheduleStore } from '../store';
  import { getItem } from '../actions/getItem';
  import { addItem } from '../actions/addItem';
  import { editItem } from "../actions/editItem";
  import { deleteItem } from "../actions/deleteItem";

  const scheduleStore = useScheduleStore();

  const loading = ref(true);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i);
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

  const selectedYear = ref(currentYear);
  const selectedMonth = ref(new Date().getMonth());
  const selectedWeek = ref();

  const selectedProject = ref("");
  const selectedPhase = ref("");

  const tableRows = ref([]);
  const selectedTask = ref([]);

  onMounted(async () => {
    if (!scheduleStore.total.length) {
      scheduleStore.setLoading(true);
      const fields = ["ID", "project_name", "phase", "task", "sub_task"];
      await getItem("Tasks", fields).then(res => {
        scheduleStore.setTotal(res);
      });

      const fields2 = ["ID", "date", "task_ids"];

      const res = await getItem("Schedules", fields2);

      res.forEach(item => {
        scheduleStore.addScheduleData(item.ID, item.date, item.task_ids.split(','));
      });

      scheduleStore.setLoading(false);
      resetTableRows();
    } else {
      resetTableRows();
      loading.value = false;
    }
  });

  watch(selectedProject, (newVal) => {
    scheduleStore.setSelectedProject(newVal);
  });
  watch(selectedPhase, (newVal) => {
    scheduleStore.setSelectedPhase(newVal);
  });

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

  function getCurrentWeekIndex(weeks, year, month) {
    const today = new Date();
    if (today.getFullYear() !== year || today.getMonth() !== month) return 0;
    const day = today.getDate();
    return weeks.findIndex(w => day >= w.start && day <= w.end);
  }

  watch([selectedYear, selectedMonth], ([year, month]) => {
    const weeks = getWeeksInMonth(year, month);
    const idx = getCurrentWeekIndex(weeks, year, month);
    selectedWeek.value = idx !== -1 ? idx : 0;
  }, { immediate: true });

  async function resetTableRows() {
    loading.value = true;
    const week = weeksInMonth.value[selectedWeek.value];
    const days = [];
    for (let d = week.start; d <= week.end; d++) {
      const date = new Date(selectedYear.value, selectedMonth.value, d);
      const existTasks = scheduleStore.scheduleData.find(item => item.date == date.toISOString().slice(0, 10));
      days.push({
        label: date.toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
        }),
        date: date.toISOString().slice(0, 10),
        tasks: existTasks ? existTasks.taskIds.map(taskID => scheduleStore.total.find(it => it.ID == taskID).task) : [] ,
      });
    }
    tableRows.value = days;
    selectedTask.value = Array(days.length).fill(null);
    await new Promise(resolve => setTimeout(resolve, 500));
    loading.value = false;
  }

  watch([selectedYear, selectedMonth, selectedWeek], resetTableRows);

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
    return scheduleStore.filteredTasks.filter((task) => !rowTasks.includes(task));
  }

  function isCurrent(label) {
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

  const projectOptions = computed(() => {
    return [...new Set(scheduleStore.total.map(p => (p.project_name)))]
  });
  const phaseOptions = computed(() => {
    if(!selectedProject) return;
    const phases = scheduleStore.total.filter(item => item.project_name == selectedProject.value);
    scheduleStore.setPhases(phases);
    return [...new Set(phases.map(p => p.phase))];
  });

  function archiveSchedule() {
    const archiveData = tableRows.value.map(row => ({
      date: row.date,
      task_ids: row.tasks.map(task => {
        const match = scheduleStore.total.find(
          t => t.task === task
        );
        return match ? match.ID : null;
      }).filter(Boolean)
    }));

    console.log(archiveData)

    archiveData.map(item => {
      if(item.task_ids.length !== 0) {
        if(scheduleStore.scheduleData.find(each => each.date == item.date)) {
          const editingItem = scheduleStore.scheduleData.find(each => each.date == item.date)
          editItem("Schedules", editingItem.ID, {task_ids: item.task_ids.join(',')}).then(res => {
            scheduleStore.editScheduleData(editingItem.ID, item.date, item.task_ids)
          })
        } else {
          addItem("Schedules", {date: item.date, task_ids: item.task_ids.join(',')}).then(res => [
            scheduleStore.addScheduleData(res.ID, item.date, item.task_ids)
          ])
        }
      }
    })
    
    scheduleStore.scheduleData.map(item => {
      const existing = archiveData.filter(each => each.task_ids.length !== 0).find(each => each.date == item.date);

      if(!existing) {
        deleteItem("Schedules", [item.ID]).then(res => {
          scheduleStore.removeScheduleData(item.date, item.ID);
        })
      }
    })
  }
</script>

<template>
  <q-card class="schedule-root">
    <LoadingSpinner :showing="loading" text="Loading schedule...">
      <div>
        <div class="schedule-header">
          <div class="schedule-project-phase-selects">
            <span class="select-icon">PROJECT : </span>
            <select v-model="selectedProject" class="selectbox">
              <option value="" disabled>Select Project</option>
              <option v-for="proj in projectOptions" :key="proj" :value="proj">
                {{ proj }}
              </option>
            </select>
            <span class="select-icon">PHASE : </span>
            <select v-model="selectedPhase" class="selectbox" :disabled="!selectedProject">
              <option value="" disabled>Select Phase</option>
              <option v-for="phase in phaseOptions" :key="phase" :value="phase">
                {{ phase }}
              </option>
            </select>
          </div>
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
              <th class="left-header">Days</th>
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
                  <transition-group name="fade" tag="span" style="padding-right: 10px;">
                    <span
                      v-for="(task, tIdx) in row.tasks"
                      :key="task"
                      class="task-chip"
                      :title="task"
                    >
                      <span class="task-chip-text">{{ task }}</span>
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
                      :title="task"
                    >
                      {{ task.length > 25 ? task.slice(0, 25) + '…' : task }}
                    </option>
                  </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="archive-btn-container">
          <button class="archive-btn" @click="archiveSchedule">Archive</button>
        </div>
      </div>
    </LoadingSpinner>
  </q-card>
</template>

<style lang="scss" scoped>
  .schedule-root {
    font-family: "Segoe UI", "Roboto", "Arial", sans-serif;
    background: #ffffff;
    border-radius: 15px;
    min-height: 80vh;
    padding: 2rem;
    margin: 2rem;
    position: relative;
    padding-bottom: 6rem;
  }
  .schedule-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  .schedule-project-phase-selects {
    display: flex;
    align-items: center;
    gap: 12px;
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
    margin-bottom: 4px;
    box-shadow: 0 2px 6px rgba(99, 102, 241, 0.08);
    transition: transform 0.15s, box-shadow 0.15s;
    animation: popin 0.3s;
    max-width: 220px;
    min-width: 0;
    overflow: hidden;
    cursor: pointer;
  }
  .task-chip-text {
    min-width: 0;
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .chip-remove {
    margin-left: 8px;
    color: #f87171;
    background: none;
    border: none;
    font-size: 1.1em;
    cursor: pointer;
    transition: color 0.2s;
    flex-shrink: 0;
  }
  .add-task-select {
    min-width: 150px;
    max-width: 150px;
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
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
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
  .archive-btn {
    background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 12px 32px;
    font-size: 1.1em;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.12);
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
    z-index: 10;
  }
  .archive-btn:hover {
    background: linear-gradient(90deg, #818cf8 0%, #6366f1 100%);
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.18);
  }
  .archive-btn-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    margin-top: 2rem;
    position: static;
  }
</style>
