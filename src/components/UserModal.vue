<script setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

import httpClient from '@/services/httpClient'
import useServerValidation from '@/composables/useServerValidation'
import BaseModal from '@/components/BaseModal.vue'
const { defineField, } = useForm();
const [roleAttrs] = defineField('role');

const { show, user } = defineProps({ show: Boolean, user: Object })
const emit = defineEmits(['close'])

const { handleFormErrors } = useServerValidation()
const { t } = useI18n({ useScope: 'global' })
const toast = useToast()

const schema = yup.object({
  firstName: yup.string(t('validations.string')).required(t('validations.required')),
  lastName: yup.string(t('validations.string')).required(t('validations.required')),
  email: yup.string(t('validations.string')).email(t('validations.email')).required(t('validations.required')),
})

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
}

const { errors, handleSubmit, defineInputBinds, resetForm, isSubmitting, setFieldError } = useForm({
  validationSchema: schema,
  initialValues: {
    ...defaultValues,
    ...user,
  },
})

const email = defineInputBinds('email')
const firstName = defineInputBinds('firstName')
const lastName = defineInputBinds('lastName')

const createUser = data => {
  return httpClient
    .post('/moni/users', data)
    .then(() => {
      resetForm()
      emit('close', data)
      toast.success(`Sikeresen létrehozta a felhasználót!`)
    })
    .catch(error => {
      const { error: formErrors } = error.response?.data || {}

      if (formErrors) {
        handleFormErrors(formErrors, setFieldError)
      }

      toast.error(`Hiba történt a felhasználó létrehozása közben!`)
    })
}

const updateUser = data => {
  return httpClient
    .put(`/moni/users/${user.id}`, data)
    .then(() => {
      emit('close', data)
      toast.success(`Sikeresen módosította ${user.familyName} ${user.firstName} felhasználót!`)
    })
    .catch(() => {
      toast.error(`Hiba történt a felhasználó módosítása közben!`)
    })
}

const onSubmit = handleSubmit(values => {
  if (user && user.id) {
    updateUser(values)
  } else {
    createUser(values)
  }
})
const roles = [
  { value: "ROLE_USER", label: "Felhasználó" },
  { value: "ROLE_ADMIN", label: "Admin" },
];

</script>

<template>
  <BaseModal :show="show">
    <div v-if="!user.id">
      <h3 class="mb-10 text-xl font-semibold text-black dark:text-white text-center">Felhasználó létrehozása</h3>
      <form @submit="onSubmit">
        <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div class="w-full xl:w-1/2">
            <label class="mb-2.5 block text-black dark:text-white">Keresztnév</label>
            <input
              v-bind="firstName"
              type="text"
              placeholder="Minta"
              :class="`w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                errors.firstName ? 'border-meta-1' : 'border-stroke'
              }`"
            />
            <div class="mt-2 text-meta-1 text-xs">
              {{ errors.firstName }}
            </div>
          </div>
          <div class="w-full xl:w-1/2">
            <label class="mb-2.5 block text-black dark:text-white"> Vezetéknév </label>
            <input
              v-bind="lastName"
              type="text"
              placeholder="János"
              :class="`w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                errors.lastName ? 'border-meta-1' : 'border-stroke'
              }`"
            />
            <div class="mt-2 text-meta-1 text-xs">
              {{ errors.lastName }}
            </div>
          </div>
        </div>
        <div class="mb-4.5">
          <label class="mb-2.5 block text-black dark:text-white"> E-mail cím </label>
          <input
            v-bind="email"
            type="email"
            placeholder="mintajanos@gmail.com"
            :class="`w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
              errors.email ? 'border-meta-1' : 'border-stroke'
            }`"
          />
          <div class="mt-2 text-meta-1 text-xs">
            {{ errors.email }}
          </div>
        </div>
        <div class="flex justify-end gap-4.5 mt-8">
          <button
            @click="$emit('close')"
            class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            type="submit"
          >
            Mégse
          </button>
          <button
            :disabled="isSubmitting"
            class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
            type="submit"
          >
            Mentés
          </button>
        </div>
      </form>
    </div>
    <div v-else>
      <h3 class="mb-10 text-xl font-semibold text-black dark:text-white text-center">Felhasználó szerkesztése</h3>
      <form @submit="onSubmit">
        <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
          <div class="w-full xl:w-1/2">
            <label class="mb-2.5 block text-black dark:text-white">Jogosultságok</label>
            <select
              v-bind="roleAttrs"
              :class="`
                w-full rounded-xl border bg-white dark:bg-form-input
                p-4 text-black dark:text-white
                focus:border-primary focus:ring-2 focus:ring-primary/30
                transition-all ease-in-out duration-200
                ${errors.role ? 'border-meta-1' : 'border-stroke dark:border-form-strokedark'}
              `"
            >
            <option
              v-for="r in roles"
              :key="r.value"
              :value="r.value"
              class="py-2 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              {{ r.label }}
            </option>
            </select>
            <div class="mt-2 text-meta-1 text-xs">
              {{ errors.role }}
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-4.5 mt-8">
          <button
            @click="$emit('close')"
            class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            type="submit"
          >
            Mégse
          </button>
          <button
            :disabled="isSubmitting"
            class="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
            type="submit"
          >
            Mentés
          </button>
        </div>
      </form>
    </div>
  </BaseModal>
</template>
<style scoped></style>
