<script setup lang="ts">

import {RouterLink} from 'vue-router';
import {ref} from "vue";
import { supabaseAdmin, supabase } from '@/supabase'

const emit = defineEmits(['logoutPressed'])

async function deleteAccount(){
  let userid = (await supabase.auth.getSession()).data.session!.user.id;
  supabaseAdmin.auth.admin.deleteUser(userid);
  supabase.auth.signOut();
}

const dropdownOpen = ref(false)

function logoutPressed() {
  emit('logoutPressed')
}

</script>
<template>
  <div class='flex justify-start absolute top-36 ml-4'>
    <nav class="hidden -mt-32 space-x-10 md:flex">
      <div class="relative">
        <button @click="dropdownOpen = ! dropdownOpen" type="button"
                class="custom_background group px-4 py-2 inline-flex items-center rounded-lg text-base font-medium"
                aria-expanded="false">
          <i class="pi pi-user"/>
          <i class="pi pi-angle-down custom_text ml-2 h-5 w-5" :class="{'rotate-180 duration-300': dropdownOpen, 'duration-300' : !dropdownOpen}" />
        </button>

        <transition enter-active-class="transition ease-out duration-200 transform" enter-from-class="opacity-0"
                    enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200 transform"
                    leave-from-class="opacity-100" leave-to-class="opacity-0">
          <div
              v-if="dropdownOpen"
              class="custom_dropdown absolute left-full -ml-20 mt-1 w-screen max-w-xs transform px-2 sm:px-0">

            <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
              <div class="custom_background relative grid gap-6 px-5 py-6 sm:gap-8 sm:p-8">
                <RouterLink to="/users" class="-m-3 flex items-start rounded-lg p-3">
                  <i class="pi pi-users pr-4 pl-1 h-6 w-6 flex-shrink-0 text-template-secondary"/>

                  <div class="ml-4">
                    <p class="text-base font-medium custom_text -mt-0.5">Users</p>
                    <p class="mt-1 text-sm custom_text_alt">All users</p>
                  </div>
                </RouterLink>

                <RouterLink to="/scooters" class="-m-3 flex items-start rounded-lg p-3">
                  <i class="pi pi-id-card pr-4 pl-1 h-6 w-6 flex-shrink-0 text-template-secondary"/>
                  <div class="ml-4">
                    <p class="text-base font-medium custom_text -mt-0.5">Scooters</p>
                    <p class="mt-1 text-sm custom_text_alt">Manage scooters</p>
                  </div>
                </RouterLink>

                <RouterLink to="/prices" class="-m-3 flex items-start rounded-lg p-3">
                  <i class="pi pi-sitemap pr-4 pl-1 h-6 w-6 flex-shrink-0 text-template-secondary"/>
                  <div class="ml-4">
                    <p class="text-base font-medium custom_text -mt-0.5">Prices</p>
                    <p class="mt-1 text-sm custom_text_alt">Manage prices</p>
                  </div>
                </RouterLink>

              </div>
              <div class="custom_background_alt px-5 py-2 sm:px-8 sm:py-4 flex justify-center" @click="logoutPressed">
                <div>
                  <ul role="list" class="my-1">
                    <li class="truncate text-base flex align-middle">
                      <a href="#" class="font-medium items-start rounded-lg flex justify-center py-2 px-4">
                        <i class="pi pi-sign-out pr-4 pl-1"/>
                        <p class="text-base font-medium custom_text -mt-0.5">Logout</p>
                      </a>
                    </li>

                    <li class="truncate text-base">
                    </li>
                  </ul>
                </div>
              </div>
              <div class="custom_background_alt_two px-5 py-2 sm:px-8 sm:py-4 flex justify-center" @click="deleteAccount">
                <div>
                  <ul role="list" class="my-1">
                    <li class="truncate text-base flex align-middle">
                      <a href="#" class="font-medium items-start rounded-lg flex justify-center py-2 px-4">
                        <p class="text-base font-medium custom_text -mt-0.5">DELETE ACCOUNT</p>
                      </a>
                    </li>

                    <li class="truncate text-base">
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </nav>
  </div>
</template>

<style scoped lang="scss">
a:hover {
  background-color: $bg-dark;

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

.custom_background_alt_two {
  background-color: #EF3E36;
  color: $bg-dark;
}

.custom_text {
  color: $bg-dark;
}

.custom_text_alt {
  color: $secondary;
}
</style>