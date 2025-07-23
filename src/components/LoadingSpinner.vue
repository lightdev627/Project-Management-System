<script setup>
  import { defineProps } from 'vue';
  const props = defineProps({
    showing: { type: Boolean, required: true },
    text: { type: String, default: 'Loading...' }
  });
</script>

<template>
  <div class="spinner-wrapper">
    <q-inner-loading :showing="showing" class="custom-spinner-overlay">
      <q-spinner-pie size="60px" color="primary" class="cool-spinner" />
      <div class="spinner-text">{{ text }}</div>
    </q-inner-loading>
    <div :class="{ 'blurred-bg': showing }">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .spinner-wrapper {
    position: relative;
  }
  .blurred-bg {
    filter: blur(3px) grayscale(0.2) brightness(0.95);
    pointer-events: none;
    user-select: none;
  }
  .custom-spinner-overlay {
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .cool-spinner {
    animation: spin 1.2s linear infinite;
    filter: drop-shadow(0 0 8px #1976d2);
  }
  .spinner-text {
    margin-top: 18px;
    font-size: 1.1rem;
    color: #1976d2;
    letter-spacing: 1px;
    font-weight: 500;
    text-shadow: 0 2px 8px #e3eafc;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style> 