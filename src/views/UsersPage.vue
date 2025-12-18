<script setup>
import { useI18n } from 'vue-i18n'

import UserTable from '@/components/UserTable.vue'

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div
    class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
  >
    <h2 class="text-title-md2 font-semibold text-black dark:text-white mb-6">{{ t('users.title') }}</h2>
    <UserTable />
  </div>
</template>

<style lang="scss" scoped></style>
