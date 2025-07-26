<template>
  <div :class="['sunburst-card', { fullscreen: isFullscreen }]">
    <button class="fullscreen-btn" @click="toggleFullscreen">
      <span v-if="!isFullscreen">⛶</span>
      <span v-else>🗗</span>
    </button>
    <SunburstChart
      component-id="chartId"
      :class="{ 'fullscreen-chart': isFullscreen }"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import SunburstChart from "../Charts/Sunburst.vue";

const isFullscreen = ref(false);

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
  if (isFullscreen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}
</script>

<style scoped>
.sunburst-card {
  position: relative;
  background: #fff;
  transition: all 0.3s;
}
.fullscreen-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
.sunburst-card.fullscreen {
  position: fixed !important;
  top: 50px;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background: #fff;
  border-radius: 0;
  padding: 24px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto;
  box-sizing: border-box;
}
.fullscreen-chart {
  width: 35vw !important;
  height: 35vh !important;
  max-width: 650px;
  max-height: calc(65vh - 48px);
}
</style>
