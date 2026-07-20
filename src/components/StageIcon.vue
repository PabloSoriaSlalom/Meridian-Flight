<script setup lang="ts">
import FeatherIcon from '@/components/FeatherIcon.vue'

interface Props {
  icon: string
  size?: number
  color?: string
  wrapperClass?: string
}

withDefaults(defineProps<Props>(), {
  size: 56,
  color: '#f7af43',
})
</script>

<template>
  <div :class="['icon-wrap', wrapperClass]">
    <FeatherIcon :name="icon" :size="size" :color="color" />
  </div>
</template>

<style scoped>
.icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  width: 88px;
  height: 88px;
  background: rgba(247, 175, 67, 0.1);
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
}

.icon-wrap--outside {
  margin-bottom: 16px;
}
</style>
