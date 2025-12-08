<script setup>
import { ref, onMounted, reactive } from 'vue'
import DataTable from '@bhplugin/vue3-datatable'
import '@bhplugin/vue3-datatable/dist/style.css'
import { useToast } from 'vue-toastification'

import httpClient from '@/services/httpClient'
import EyeIcon from '@/icons/EyeIcon.vue'
import TrashIcon from '@/icons/TrashIcon.vue'
import UserModal from '@/components/UserModal.vue'
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
    { field: 'fullName', title: 'Név' },
    { field: 'email', title: 'E-mail' },
    { field: 'country', title: 'Ország' },
    { field: 'address', title: 'Cím' },
    {
      field: 'actions',
      title: 'Műveletek',
    },
  ]) || []
const selectedUser = ref({})

const getUsers = async () => {
  loading.value = true

  try {
    const { data } = await httpClient.get('/users', { params })

    rows.value = data?.data
    totalRows.value = data?.meta?.total
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
    await httpClient.delete(`/users/${user.id}`)
    await getUsers()
    toast.success(`Sikeresen törölte ${user.lastName} ${user.firstName} felhasználót!`)
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

const getCountryNameByCode = code => {
  const countries = collectionStore.getCollectionByKey(COLLECTION_TYPES.COUNTRIES)
  const country = countries.find(country => country.code === code)
  return country?.name || ''
}

onMounted(() => {
  getUsers()
})
</script>

<template>
  <div class="flex justify-end mb-3">
    <button
      v-if="hasPermission('CREATE_USER')"
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
    <template #id="data">
      <strong class="text-info">#{{ data.value.id }}</strong>
    </template>
    <template #fullName="data">
      <div class="flex items-center gap-2">
        <div class="font-semibold">{{ data.value.firstName + ' ' + data.value.lastName }}</div>
      </div>
    </template>
    <template #country="data">
      <span>{{ getCountryNameByCode(data.value.address.country) }}</span>
    </template>
    <template #address="data">
      <span>{{ `${data.value.address.zipcode} ${data.value.address.city}, ${data.value.address.street}` }}</span>
    </template>
    <template #email="data">
      <a :href="`mailto:${data.value.email}`" class="text-primary hover:underline">{{ data.value.email }}</a>
    </template>
    <template #actions="data">
      <div class="flex items-center space-x-3.5">
        <button v-if="hasPermission('UPDATE_USER')" class="hover:text-primary" @click="editUser(data.value)">
          <EyeIcon />
        </button>
        <button v-if="hasPermission('DELETE_USER')" class="hover:text-primary" @click="deleteUser(data.value)">
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
