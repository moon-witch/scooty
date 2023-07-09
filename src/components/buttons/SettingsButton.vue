<script setup lang="ts">

import {RouterLink} from 'vue-router';
import {ref} from "vue";

const emit = defineEmits(['addPressed', 'reloadPressed', 'deletePressed'])

const dropdownOpen = ref(false)

function addPressed() {
  emit('addPressed')
}

function reloadPressed() {
  emit('reloadPressed')
}

function deletePressed() {
  emit('deletePressed')
}

</script>
<template>
  <div class='flex justify-start absolute top-36 right-4 ml-4'>
    <nav class="hidden -mt-32 space-x-10 md:flex">
      <div class="relative">
        <button @click="dropdownOpen = ! dropdownOpen" type="button"
                class="custom_background group p-2 inline-flex items-center rounded-lg text-base font-medium"
                aria-expanded="false">
          <i class="pi pi-cog" :class="{'rotate-90 duration-300': dropdownOpen, 'duration-300' : !dropdownOpen}"/>
        </button>

        <transition enter-active-class="transition ease-out duration-200 transform" enter-from-class="opacity-0"
                    enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200 transform"
                    leave-from-class="opacity-100" leave-to-class="opacity-0">
          <div
              v-if="dropdownOpen"
              class="custom_dropdown absolute left-full -ml-80 z-full mt-1 w-screen max-w-xs transform px-2 sm:px-0">

            <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
              <div class="custom_background relative grid gap-6 px-5 py-6 sm:gap-8 sm:p-8">
                <a class="custom_button -m-3 flex items-start rounded-lg p-3" @click="addPressed">
                  <i class="pi pi-id-card pr-4 pl-1 h-6 w-6 flex-shrink-0 text-template-secondary"/>
                  <div class="ml-4">
                    <p class="text-base font-medium custom_text -mt-0.5">Add Scooters</p>
                    <p class="mt-1 text-sm custom_text_alt">Toggle add mode on / off</p>
                  </div>
                </a>

                <a class="custom_button -m-3 flex items-start rounded-lg p-3" @click="reloadPressed">
                  <i class="pi pi-sitemap pr-4 pl-1 h-6 w-6 flex-shrink-0 text-template-secondary"/>
                  <div class="ml-4">
                    <p class="text-base font-medium custom_text -mt-0.5">Reload Scooter</p>
                    <p class="mt-1 text-sm custom_text_alt">Reload scooters on map</p>
                  </div>
                </a>

                <a class="custom_button -m-3 flex items-start rounded-lg p-3" @click="deletePressed">
                  <i class="pi pi-sitemap pr-4 pl-1 h-6 w-6 flex-shrink-0 text-template-secondary"/>
                  <div class="ml-4">
                    <p class="text-base font-medium custom_text -mt-0.5">Delete Scooters</p>
                    <p class="mt-1 text-sm custom_text_alt">Delete scooters on map</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </nav>
  </div>
</template>

<style scoped lang="scss">
a:hover, .custom_button:hover {
  background-color: $bg-dark;
  cursor: pointer;

  .custom_text {
    color: $primary;
  }

  .custom_text_alt {
    color: $secondary;
  }

  i {
    color: $primary;
  }
}

i {
  font-size: 1.25rem;
}

.custom_dropdown {
  z-index: 1500;
}

.custom_background {
  background-color: $primary;
}

.custom_background_alt {
  background-color: $bg-bright;
}

.custom_text {
  color: $bg-dark;
}

.custom_text_alt {
  color: $secondary;
}
</style>