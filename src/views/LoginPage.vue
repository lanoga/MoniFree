<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'

import httpClient from '@/services/httpClient'
import useServerValidation from '@/composables/useServerValidation'
import { useAuth } from '@/stores/auth'
import { useCollections, COLLECTIONS } from '@/stores/collections'

const router = useRouter()
const route = useRoute()
const { handleFormErrors } = useServerValidation()
const auth = useAuth()
const collectionStore = useCollections()
const { t } = useI18n()

const { errors, handleSubmit, defineInputBinds, resetForm, isSubmitting, setFieldError } = useForm({
  validationSchema: yup.object({
    email: yup.string(t('validations.string')).email(t('validations.email')).required(t('validations.required')),
    password: yup
      .string(t('validations.string'))
      .min(6, t('validations.minLength'))
      .required(t('validations.required')),
  }),
})

const email = defineInputBinds('email')
const password = defineInputBinds('password')

const onSubmit = handleSubmit(values => {
  auth.loading = true

  return httpClient
    .post('/login', values)
    .then(response => {
      const { accessToken, userData } = response.data

      auth.setAuthUser({ accessToken, userData })

      resetForm()
    })
    .then(auth.getMenus)
    .then(auth.getPermissions)
    .then(() => collectionStore.getAllCollections(COLLECTIONS))
    .then(() => {
      auth.loading = false
      router.replace(route.query.to ? String(route.query.to) : '/users')
    })
    .catch(error => {
      const { error: formErrors } = error.response?.data || {}

      if (formErrors) {
        handleFormErrors(formErrors, setFieldError)
      }

      auth.loading = false
    })
})
</script>

<template>
  <div class="flex flex-wrap items-center justify-center">
    <div class="w-full xl:w-150">
      <div class="w-full p-4 sm:p-12.5 xl:p-17.5">
        <h1 class="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">{{ t('login.title') }}</h1>
        <form @submit="onSubmit">
          <div class="mb-4">
            <label class="mb-2.5 block font-medium text-black dark:text-white">{{ t('labels.email') }}</label>
            <input
              v-bind="email"
              type="email"
              placeholder="admin@lanoga.hu"
              :class="`w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                errors.email ? 'border-meta-1' : 'border-stroke'
              }`"
            />
            <div class="mt-2 text-meta-1 text-xs">
              {{ errors.email }}
            </div>
          </div>

          <div class="mb-6">
            <label class="mb-2.5 block font-medium text-black dark:text-white">{{ t('labels.password') }}</label>
            <input
              v-bind="password"
              type="password"
              placeholder="*******"
              :class="`w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                errors.password ? 'border-meta-1' : 'border-stroke'
              }`"
            />
            <div class="mt-2 text-meta-1 text-xs">
              {{ errors.password }}
            </div>
          </div>

          <div class="mb-5">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:opacity-75"
            >
              {{ t('login.action') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
