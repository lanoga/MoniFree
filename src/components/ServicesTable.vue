<script setup>
import { ref, onMounted, reactive } from 'vue'
import DataTable from '@bhplugin/vue3-datatable'
import '@bhplugin/vue3-datatable/dist/style.css'
import { useToast } from 'vue-toastification'

import httpClient from '@/services/httpClient'
import EyeIcon from '@/icons/EyeIcon.vue'
import TrashIcon from '@/icons/TrashIcon.vue'
import ServiceModal from '@/components/ServiceModal.vue'
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
    { field: 'server_url', title: 'Server URL' },
    { field: 'user', title: 'Felhasználó' },
    { field: 'fragment', title: '' },
    { field: 'intervall', title: '' },
    {
      field: 'actions',
      title: 'Műveletek',
    },
  ]) || []
const selectedService = ref({})

const getServices = async () => {
  loading.value = true

  try {
    const { data } = await httpClient.get('/services', { params })

    rows.value = data?.data
    totalRows.value = data?.meta?.total
  } catch (error) {
    return Promise.reject(error)
  } finally {
    loading.value = false
  }
}

const addService = () => {
  selectedService.value = {}
  showModal.value = true
}

const editService = async service => {
  selectedService.value = service
  showModal.value = true
}

const deleteService = async service => {
  try {
    await httpClient.delete(`/services/${service.id}`)
    await getServices()
    toast.success(`Sikeresen törölte ${service.id} szolgáltatást!`)
  } catch (error) {
    toast.error(`Hiba történt a szolgáltatás törlése közben!`)
    return Promise.reject(error)
  }
}

const closeModal = data => {
  showModal.value = false

  if (data) {
    getServices()
  }
}

const handleChange = data => {
  params.current_page = data.current_page
  params.pagesize = data.pagesize
  params.sort_column = data.sort_column
  params.sort_direction = data.sort_direction

  getServices()
}

onMounted(() => {
  getServices()
})
</script>

<template>
  <div class="flex justify-end mb-3">
    <button
      v-if="hasPermission('CREATE_SERVICE')"
      @click="addService"
      class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
    >
      Új Szolgáltatás
    </button>
    <ServiceModal v-if="showModal" :service="selectedService" :show="showModal" @close="closeModal" />
  </div>
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
    class="services-table"
    @change="handleChange"
  >
    <template #id="data">
      <strong class="text-info">#{{ data.value.id }}</strong>
    </template>
    <template #server_url="data">
      <div class="flex items-center gap-2">
        <div class="font-semibold">{{ data.value.server_url}}</div>
      </div>
    </template>
    <template #user="data">
      <span>{{ data.value.user}}</span>
    </template>
    <template #fragment="data">
      <span>{{ data.value.fragment}}}</span>
    </template>
    <template #intervall="data">
      <span>{{ data.value.intervall }}</span>
    </template>
    <template #actions="data">
      <div class="flex items-center space-x-3.5">
        <button v-if="hasPermission('UPDATE_SERVICE')" class="hover:text-primary" @click="editService(data.value)">
          <EyeIcon />
        </button>
      </div>
    </template>
  </DataTable>
</template>

<style>
.services-table .bh-pagination .bh-page-item {
  @apply !w-max min-w-[32px] !rounded;
}
</style>