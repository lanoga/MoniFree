<script setup>
import { RouterView } from 'vue-router'
import PageLoader from '@/components/PageLoader.vue'
import { useAuth } from '@/stores/auth'

const auth = useAuth()
</script>

<template>
  <PageLoader :loading="auth.loading" />
  <component :is="$route.meta.layout">
    <RouterView />
  </component>
</template>

<style scoped></style>
