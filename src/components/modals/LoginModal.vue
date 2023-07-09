<script setup lang="ts">
import {ref} from "vue";
import ModalTemplate from "@/components/modals/ModalTemplate.vue";
import MainButton from "../buttons/MainButton.vue";
import ModalBackdrop from "@/components/modals/ModalBackdrop.vue";
import RegisterModal from "@/components/modals/RegisterModal.vue";
import ForgotPasswordModal from "./ForgotPasswordModal.vue";
import { supabase } from '../../supabase';
import { useRouter } from 'vue-router';
const router = useRouter()

const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const showForgotPasswordModal = ref(false)
const showAny = ref(false)

const loading = ref(false)
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    const {error} = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    if (error) throw error
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
    await router.push({path: '/'})
  }
}

function closeModal(keepOpen = false) {
  if (!keepOpen) {
    showAny.value = false;
    email.value = '';
    password.value = '';
  }

  showLoginModal.value = false;
  showRegisterModal.value = false;
  showForgotPasswordModal.value = false;
}

function switchModal({
                       isLogin = false,
                       isRegister = false,
                       isForgot = false,
                       newEmail = undefined
                     }) {
  showAny.value = true;
  if (newEmail) email.value = newEmail;

  switch (true) {
    case isLogin:
      closeModal(true);
      showLoginModal.value = true;
      break;
    case isRegister:
      closeModal(true);
      showRegisterModal.value = true;
      break;
    case isForgot:
      closeModal(true);
      showForgotPasswordModal.value = true;
      break;
  }
}

</script>

<template>
  <MainButton class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-32 z-10 text-2xl" @click.prevent="showLoginModal = !showLoginModal; showAny = true;">
    Login
  </MainButton>
  <ModalTemplate :show="showLoginModal">
    <h2 class="font-bold text-2xl text-center">Login</h2>
    <form class="flex flex-col justify-center mb-4">
      <label for="email">Email</label>
      <input id="email" type="email" v-model="email" class="custom_input rounded-lg p-2 mb-2">

      <label for="password">Password</label>
      <input id="password" type="password" v-model="password" @keypress.enter="handleLogin" class="custom_input rounded-lg p-2 mb-2">

      <button class="w-fit custom_link text-sm" @click.prevent="switchModal({ isForgot: true })">Forgot
        password?
      </button>
    </form>
    <div class="flex justify-center my-2">
      <MainButton type="submit" class="w-full mx-2" @click.prevent="handleLogin">Login</MainButton>
      <MainButton class="w-full mx-2" @click.prevent="closeModal()" id="cancel" :reversed="true">Cancel</MainButton>
    </div>
    <div class="flex justify-center">
      <MainButton class="mx-4 w-fit" @click.prevent="switchModal({ isRegister: true })" :reversed="true" :is-alt="true">Register here
      </MainButton>
    </div>
  </ModalTemplate>
  <ForgotPasswordModal :email="email" :showForgotPassword="showForgotPasswordModal"
                       @close-forgot="switchModal({ isLogin: true, newEmail: $event.value })" @close-all="closeModal"/>
  <RegisterModal :email="email" :showRegister="showRegisterModal"
                 @close-register="switchModal({ isLogin: true, newEmail: $event.value })"
                 @close-all="closeModal"/>

  <ModalBackdrop :showBackdrop="showAny" @backdrop-clicked="closeModal"/>
  <transition enter-active-class="transition ease-out duration-200 transform" enter-from-class="opacity-0"
              enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200 transform"
              leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div class="flex justify-center">
      <div v-if="loading"
           class="custom_input fixed z-30 inset-0 overflow-hidden bg-black bg-opacity-95 font-bold text-4xl text-center top-1/4 bottom-1/4 py-52">
        logging you in
      </div>
    </div>
  </transition>
</template>