<script setup>
import { useForm } from "vee-validate"
import * as yup from "yup"
import { useToast } from "vue-toastification"
import BaseModal from "@/components/BaseModal.vue"
import httpClient from "@/services/httpClient"
import { useI18n } from "vue-i18n"
import useServerValidation from "@/composables/useServerValidation"

const { t } = useI18n()
const toast = useToast()
const { handleFormErrors } = useServerValidation()

// Receive props
const { show, data } = defineProps({
  show: Boolean,
  data: Object, // The object you want to edit
})

const emit = defineEmits(["close"])

// Validation schema
const schema = yup.object({
  server_url: yup.string().required(t("validations.required")),
  user: yup.string().required(t("validations.required")),
  fragment: yup.string().nullable(),
  intervall: yup.number().typeError(t("validations.number")),
})

// Form
const { errors, handleSubmit, defineInputBinds, isSubmitting, resetForm, setFieldError } =
  useForm({
    validationSchema: schema,
    initialValues: {
      server_url: data.server_url ?? "",
      user: data.user ?? "",
      fragment: data.fragment ?? "",
      intervall: data.intervall ?? "",
    },
  })

// Inputs
const serverUrl = defineInputBinds("server_url")
const userField = defineInputBinds("user")
const fragment = defineInputBinds("fragment")
const intervall = defineInputBinds("intervall")

// Submit logic
const updateData = formData => {
  return httpClient
    .patch(`/your-endpoint/${data.id}`, formData)
    .then(() => {
      toast.success("Sikeresen módosítva!")
      emit("close", formData)
    })
    .catch(error => {
      const { error: formErrors } = error.response?.data || {}
      if (formErrors) handleFormErrors(formErrors, setFieldError)
      toast.error("Hiba történt a módosítás közben!")
    })
}

const onSubmit = handleSubmit(updateData)
</script>

<template>
  <BaseModal :show="show">
    <h3 class="mb-10 text-xl font-semibold text-black dark:text-white text-center">
      Adatok szerkesztése
    </h3>

    <form @submit="onSubmit">
      <!-- Server URL -->
      <div class="mb-4.5">
        <label class="mb-2.5 block text-black dark:text-white">Server URL</label>
        <input
          v-bind="serverUrl"
          type="text"
          placeholder="https://example.com"
          :class="`
            w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 outline-none
            focus:border-primary dark:border-form-strokedark dark:bg-form-input
            ${errors.server_url ? 'border-meta-1' : 'border-stroke'}
          `"
        />
        <div class="mt-2 text-meta-1 text-xs">{{ errors.server_url }}</div>
      </div>

      <!-- User -->
      <div class="mb-4.5">
        <label class="mb-2.5 block text-black dark:text-white">Felhasználó</label>
        <input
          v-bind="userField"
          type="text"
          placeholder="Minta János"
          :class="`
            w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 outline-none
            focus:border-primary dark:border-form-strokedark dark:bg-form-input
            ${errors.user ? 'border-meta-1' : 'border-stroke'}
          `"
        />
        <div class="mt-2 text-meta-1 text-xs">{{ errors.user }}</div>
      </div>

      <!-- Fragment -->
      <div class="mb-4.5">
        <label class="mb-2.5 block text-black dark:text-white">Fragment</label>
        <input
          v-bind="fragment"
          type="text"
          placeholder="Fragment"
          :class="`
            w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 outline-none
            focus:border-primary dark:border-form-strokedark dark:bg-form-input
            ${errors.fragment ? 'border-meta-1' : 'border-stroke'}
          `"
        />
        <div class="mt-2 text-meta-1 text-xs">{{ errors.fragment }}</div>
      </div>

      <!-- Intervall -->
      <div class="mb-4.5">
        <label class="mb-2.5 block text-black dark:text-white">Intervall</label>
        <input
          v-bind="intervall"
          type="number"
          placeholder="0"
          :class="`
            w-full rounded-lg border bg-transparent py-4 pl-6 pr-10 outline-none
            focus:border-primary dark:border-form-strokedark dark:bg-form-input
            ${errors.intervall ? 'border-meta-1' : 'border-stroke'}
          `"
        />
        <div class="mt-2 text-meta-1 text-xs">{{ errors.intervall }}</div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end gap-4.5 mt-8">
        <button
          @click="$emit('close')"
          class="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black
                 hover:shadow-1 dark:border-strokedark dark:text-white"
          type="button"
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
  </BaseModal>
</template>
