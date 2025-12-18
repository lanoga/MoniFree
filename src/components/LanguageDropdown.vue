<script setup>
import { ref, watch } from 'vue'
import { onClickOutside, onKeyDown } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n({ useScope: 'global' })

const dropdownOpen = ref(false)
const dropdown = ref(null)
const trigger = ref(null)

const LANGUAGE_KEY = 'lang'

const languages = [
  { i18nLang: 'hu', label: 'Magyar' },
  { i18nLang: 'en', label: 'English' },
]

// 🔒 initialize ONCE
const savedLang = localStorage.getItem(LANGUAGE_KEY)
if (typeof savedLang === 'string') {
  locale.value = savedLang
}

// persist locale changes safely
watch(locale, val => {
  if (typeof val === 'string') {
    localStorage.setItem(LANGUAGE_KEY, val)
    document.documentElement.setAttribute('lang', val)
  }
})

const setLanguage = lang => {
  if (typeof lang === 'string') {
    locale.value = lang
    dropdownOpen.value = false
  }
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

onClickOutside(dropdown, () => {
  dropdownOpen.value = false
}, { ignore: [trigger] })

onKeyDown('Escape', event => {
  event.preventDefault()
  dropdownOpen.value = false
})
</script>

<template>
  <div class="relative">
    <a ref="trigger" @click.stop="toggleDropdown" class="flex items-center gap-2" href="#">
      <svg
        class="hidden fill-current sm:block"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path
          d=" M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
        ></path>
      </svg>
      <svg
        :class="`hidden fill-current sm:block ${dropdownOpen ? 'rotate-180' : ''}`"
        width="12"
        height="8"
        viewBox="0 0 12 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
          fill=""
        />
      </svg>
    </a>

    <div
      ref="dropdown"
      @focus="dropdownOpen = true"
      @blur="dropdownOpen = false"
      :class="`absolute right-0 mt-2 flex w-35 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
        dropdownOpen === true ? 'block' : 'hidden'
      }`"
    >
      <ul class="flex flex-col gap-3 border-b border-stroke px-5 py-2.5 dark:border-strokedark">
        <li v-for="language in languages" :key="language.i18nLang">
          <button
            :class="`flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out lg:text-base ${locale.value === language.i18nLang
            ? 'text-primary hover:text-primary'
            : 'hover:text-boxdark'
            }`"
            @click="setLanguage(language.i18nLang)"
          >
            {{ language.label }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
