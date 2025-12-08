<script setup>
const { loading } = defineProps({ loading: Boolean })
</script>

<template>
  <div
    v-if="loading"
    className="flex h-screen items-center justify-center bg-white fixed top-0 w-full opacity-70 z-[9999]"
  >
    <div
      className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"
    ></div>
  </div>
</template>

<style scoped></style>
