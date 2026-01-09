<script setup>
import { ref, onMounted, reactive } from 'vue'
import DataTable from '@bhplugin/vue3-datatable'
import '@bhplugin/vue3-datatable/dist/style.css'
import { useToast } from 'vue-toastification'

import httpClient from '@/services/httpClient'
import EyeIcon from '@/icons/EyeIcon.vue'
import TrashIcon from '@/icons/TrashIcon.vue'
import UserModal from '@/components/UserModal.vue'

const toast = useToast()

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
    { field: 'fullName', title: 'Név' },
    { field: 'email', title: 'E-mail' },
    { field: 'role', title: 'Szerepkör' },
    { field: 'twoFactorEnabled', title: 'Kétlépcsős hitelesítés' },
    {
      field: 'actions',
      title: 'Műveletek',
    },
  ]) || []
const selectedUser = ref({})

const getUsers = async () => {
  loading.value = true

  try {
    const { data } = await httpClient.get('/moni/users')
    rows.value = data
    totalRows.value = data.length || 0
  } catch (error) {
    return Promise.reject(error)
  } finally {
    loading.value = false
  }
}

const addUser = () => {
  selectedUser.value = {}
  showModal.value = true
}

const editUser = async user => {
  selectedUser.value = user
  showModal.value = true
}

const deleteUser = async user => {
  try {
    await httpClient.delete(`/moni/users${user.id}`)
    await getUsers()
    toast.success(`Sikeresen törölte ${user.familyName} ${user.firstName} felhasználót!`)
  } catch (error) {
    toast.error(`Hiba történt a felhasználó törlése közben!`)
    return Promise.reject(error)
  }
}

const closeModal = data => {
  showModal.value = false

  if (data) {
    getUsers()
  }
}

const handleChange = data => {
  params.current_page = data.current_page
  params.pagesize = data.pagesize
  params.sort_column = data.sort_column
  params.sort_direction = data.sort_direction

  getUsers()
}

onMounted(() => {
  getUsers()
})
</script>

<template>
  <div class="flex justify-end mb-3">
    <button
      @click="addUser"
      class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
    >
      Új Felhasználó
    </button>
    <UserModal v-if="showModal" :user="selectedUser" :show="showModal" @close="closeModal" />
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
    class="users-table"
    @change="handleChange"
  >
    <template #fullName="data">
      <div class="flex items-center gap-2">
        <div class="font-semibold">{{ data.value.familyName + ' ' + data.value.firstName }}</div>
      </div>
    </template>
    <template #email="data">
      {{ data.value.email }}
    </template>
    <template #role="data">
      {{ data.value.role }}
    </template>
    <template #twoFactorEnabled="data">
      {{ data.value.twoFactorEnabled ? 'Igen' : 'Nem' }}
    </template>
    <template #actions="data">
      <div class="flex items-center space-x-3.5">
        <button class="hover:text-primary" @click="editUser(data.value)">
          <EyeIcon />
        </button>
        <button class="hover:text-primary" @click="deleteUser(data.value)">
          <TrashIcon />
        </button>
      </div>
    </template>
  </DataTable>
</template>

<style>
.users-table .bh-pagination .bh-page-item {
  @apply !w-max min-w-[32px] !rounded;
}
</style>
