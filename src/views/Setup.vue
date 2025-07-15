<template>
  <a-row :gutter="16" class="reference-board">
    <a-col v-for="section in sections" :key="section.title" :xs="24" :sm="12" :md="8" :lg="3">
      <a-card :title="section.title" class="reference-card">
        <a-list :data-source="myList">
          <a-list-item>
            <span v-html="item"></span>
          </a-list-item>
				</a-list>
      </a-card>
    </a-col>
  </a-row>
</template>

<script setup>
import { ref } from 'vue';

const sections = ref([
  {
    title: "PROJECTS NAMES",
    items: [
      "Sell the new product",
      "Product Release",
      "Website Release"
    ]
  },
  {
    title: "PROJECTS MEMBERS",
    items: [
      "John Smart", "Tony Glue", "Peter Fork", "Sam Keeper",
      "Shawn Party", "Steven Wedges", "Stacy Fireman", "Jenna Heals",
      "Kate Debate", "Fatima Notes"
    ]
  },
  {
    title: "STATUS",
    items: [
      "COMPLETED", "ON GOING", "DELAYED", "PENDING", "NOT STARTED"
    ]
  },
  {
    title: "KEY",
    items: [
      'New Task <span style="float:right;">📝</span>',
      'In Progress Task <span style="float:right;">✔️</span>',
      'Done <span style="float:right;">✅</span>',
      'Deadline <span style="float:right;">⏰</span>',
      'Event <span style="float:right;">🎉</span>',
      'Meeting <span style="float:right;">👥</span>',
      'Cancelled <span style="float:right;">🚫</span>',
      'Migrated <span style="float:right;">🔄</span>'
    ]
  },
  {
    title: "MONTHS",
    items: [
      "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ]
  },
  {
    title: "YEARS",
    items: [
      "2021", "2022", "2023", "2024", "2025", "2026", "2027",
      "2028", "2029", "2030", "2031", "2032"
    ]
  },
  {
    title: "NOTES TYPE",
    items: [
      "From Client Meeting", "From Team Meeting", "Reminders",
      "Minutes of the Meeting", "Personal", "Brain Dump", "Ideas"
    ]
  }
]);
</script>

<style scoped>
	.reference-board {
		margin: 24px 0;
	}
	.reference-card {
		min-height: 400px;
		border-radius: 8px;
		box-shadow: 0 2px 8px #f0f1f2;
	}
	.ant-card-head-title {
		text-align: center;
		font-weight: bold;
		letter-spacing: 1px;
	}
	.ant-list-item {
		font-size: 15px;
		min-height: 32px;
	}
</style>