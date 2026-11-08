<script setup lang="ts">
defineProps<{
  exportMode?: boolean
}>()
</script>

<template>
  <div
    :class="['left-0 z-10 shrink-0', !exportMode && 'sticky']"
    :style="{
      minWidth: '52px',
      width: '52px',
      background: 'var(--collision-cell-bg)',
      backgroundImage: 'var(--collision-cell-pattern)',
      borderRight: '1px solid var(--grid-line-strong)',
    }"
    aria-hidden="true"
  />
</template>
