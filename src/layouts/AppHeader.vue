<script setup>
import UserDropdown from '@/components/UserDropdown.vue'
import LanguageDropdown from '@/components/LanguageDropdown.vue'

const { sidebarOpen, setSidebarOpen } = defineProps({ sidebarOpen: Boolean, setSidebarOpen: Function })
</script>

<template>
  <header class="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
    <div class="flex flex-grow items-center justify-between lg:justify-end py-4 px-4 shadow-2 md:px-6 2xl:px-11">
      <div class="flex items-center gap-2 sm:gap-4 lg:hidden">
        <button
          aria-controls="sidebar"
          @click="
            e => {
              e.stopPropagation()
              setSidebarOpen(!sidebarOpen)
            }
          "
          class="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
        >
          <span class="relative block h-5.5 w-5.5 cursor-pointer">
            <span class="du-block absolute right-0 h-full w-full">
              <span
                :class="`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                  !sidebarOpen && '!w-full delay-300'
                }`"
              ></span>
              <span
                :class="`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                  !sidebarOpen && 'delay-400 !w-full'
                }`"
              ></span>
              <span
                :class="`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                  !sidebarOpen && '!w-full delay-500'
                }`"
              ></span>
            </span>
            <span class="absolute right-0 h-full w-full rotate-45">
              <span
                :class="`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                  !sidebarOpen && '!h-0 !delay-[0]'
                }`"
              ></span>
              <span
                :class="`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                  !sidebarOpen && '!h-0 !delay-200'
                }`"
              ></span>
            </span>
          </span>
        </button>
      </div>

      <div class="flex items-center gap-3 2xsm:gap-8">
        <LanguageDropdown />
        <UserDropdown />
      </div>
    </div>
  </header>
</template>
