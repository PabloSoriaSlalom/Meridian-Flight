<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    :viewBox="`0 0 24 24`"
    :class="['feather-icon', `feather-icon--${name}`]"
    fill="none"
    :stroke="color"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <g v-html="pathContent" />
  </svg>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Props {
  name: string
  size?: number | string
  color?: string
  strokeWidth?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  color: 'currentColor',
  strokeWidth: 1.0,
})

const pathContent = ref('')

onMounted(async () => {
  try {
    // Dynamic import to get feather-icons
    const featherIcons = await import('feather-icons')
    const icon = (featherIcons.icons as any)[props.name]
    
    if (icon && icon.contents) {
      pathContent.value = icon.contents
    } else {
      console.warn(`Feather icon "${props.name}" not found`)
    }
  } catch (error) {
    console.error(`Error loading icon "${props.name}":`, error)
  }
})
</script>

<style scoped>
.feather-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
