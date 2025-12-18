<script setup>
import { RouterView } from 'vue-router'
import PageLoader from '@/components/PageLoader.vue'
import { useAuth } from '@/stores/auth'
import { onMounted } from 'vue'

const auth = useAuth()
onMounted(() => {
  const saved = localStorage.getItem('auth')
  if (saved) {
    const parsed = JSON.parse(saved)
    auth.accessToken = parsed.accessToken
    auth.menus = parsed.menus
  }
})
</script>

<template>
  <PageLoader :loading="auth.loading" />
  <component :is="$route.meta.layout">
    <RouterView />
  </component>
</template>

<style scoped></style>
