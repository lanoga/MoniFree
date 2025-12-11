<script setup>
import { ref, onMounted, reactive } from 'vue'
import DataTable from '@bhplugin/vue3-datatable'
import '@bhplugin/vue3-datatable/dist/style.css'
import { useToast } from 'vue-toastification'

import httpClient from '@/services/httpClient'
import EyeIcon from '@/icons/EyeIcon.vue'
import TrashIcon from '@/icons/TrashIcon.vue'
import { hasPermission } from '@/services/role'
import { useCollections, COLLECTION_TYPES } from '@/stores/collections'

const toast = useToast()
const collectionStore = useCollections()

const showModal = ref(false)
const loading = ref(true)
const totalRows = ref(0)
const params = reactive({
  current_page: 1,
  pagesize: 10,
  sort_column: 'id',
  sort_direction: 'asc',
})
const rows = ref(null)
const cols =
  ref([
    { field: 'id', title: 'ID', isUnique: true },
    { field: 'date_time', title: 'Dátum' },
    { field: 'server_url', title: 'Server URL' },
    { field: 'fragment', title: '' },
    { field: 'answer', title: 'Válasz' },
  ]) || []

const getLogs = async () => {
  loading.value = true

  try {
    const { data } = await httpClient.get('/logs', { params })

    rows.value = data?.data
    totalRows.value = data?.meta?.total
  } catch (error) {
    return Promise.reject(error)
  } finally {
    loading.value = false
  }
}

const handleChange = data => {
  params.current_page = data.current_page
  params.pagesize = data.pagesize
  params.sort_column = data.sort_column
  params.sort_direction = data.sort_direction

  getLogs()
}

onMounted(() => {
  getLogs()
})
</script>

<template>
  <DataTable
    :rows="rows"
    :columns="cols"
    :loading="loading"
    :totalRows="totalRows"
    :isServerMode="true"
    :pageSize="params.pagesize"
    :sortable="true"
    :sortColumn="params.sort_column"
    :sortDirection="params.sort_direction"
    class="logs-table"
    @change="handleChange"
  >
    <template #id="data">
      <strong class="text-info">#{{ data.value.id }}</strong>
    </template>
    <template #date_time="data">
      <div class="flex items-center gap-2">
        <div class="font-semibold">{{ data.value.date_time}}</div>
      </div>
    </template>
    <template #server_url="data">
      <span>{{ data.value.server_url}}</span>
    </template>
    <template #fragment="data">
      <span>{{ data.value.fragment}}}</span>
    </template>
    <template #answer="data">
      <span>{{ data.value.answer }}</span>
    </template>
  </DataTable>
</template>

<style>
.logs-table .bh-pagination .bh-page-item {
  @apply !w-max min-w-[32px] !rounded;
}
</style>