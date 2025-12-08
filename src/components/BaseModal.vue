<script setup>
const { show } = defineProps({
  show: Boolean,
})
</script>

<template>
  <Teleport to="#modals">
    <div v-if="show">
      <div class="fixed inset-0 bg-graydark opacity-40"></div>

      <div class="fixed inset-0 flex items-center justify-center">
        <div
          class="min-w-[600px] rounded-sm border border-stroke bg-white px-6 py-6 shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
