<script setup>
import { ref } from 'vue'
import AppHeader from '@/layouts/AppHeader.vue'
import AppSidebar from '@/layouts/AppSidebar.vue'

const sidebarOpen = ref(false)

const setSidebarOpen = value => {
  sidebarOpen.value = value
}
</script>

<template>
  <div class="dark:bg-boxdark-2 dark:text-bodydark">
    <div class="flex h-screen overflow-hidden">
      <AppSidebar :sidebarOpen="sidebarOpen" :setSidebarOpen="setSidebarOpen" />
      <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <AppHeader :sidebarOpen="sidebarOpen" :setSidebarOpen="setSidebarOpen" />
        <main>
          <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
