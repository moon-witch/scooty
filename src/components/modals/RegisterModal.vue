<script setup lang="ts">
import {computed, ref, watch} from "vue";
import ModalTemplate from "@/components/modals/ModalTemplate.vue";
import MainButton from "../buttons/MainButton.vue";
import { supabase } from '../../supabase'

const props = defineProps({
      showRegister: {
        type: Boolean,
        default: false,
      },
      email: {
        type: String,
        default: ""
      }
    }
)
const email = ref('')
watch(() => props.email, (newEmail) => {
  email.value = newEmail;
});

const emit = defineEmits(['closeRegister', 'closeAll'])


const loading = ref(false)
const password = ref('')

const handleSignUp = async () => {
  try {
    loading.value = true
    const {error} = await supabase.auth.signUp({
      email: email.value,
      password: password.value
    })
    if (error) throw error
    alert('Account created!')
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
  }
}

function closeModal() {
  emit('closeRegister', email)
}

function closeAllModal() {
  emit('closeAll')
}

const computedShowRegister = computed(() => {
  return props.showRegister
})

</script>

<template>
  <ModalTemplate :show="computedShowRegister">
    <h2 class="font-bold text-2xl text-center">Register</h2>
    <form class="flex flex-col justify-center">
      <label for="email">Choose an email</label>
      <input id="email" type="email" v-model="email" class="custom_input rounded-lg p-2 mb-2">

      <label for="email">Choose a password</label>
      <input id="password" type="password" @keypress.enter="handleSignUp" v-model="password" class="custom_input rounded-lg p-2 mb-2">
    </form>
    <div class="flex justify-center">
      <MainButton class="w-full mx-2 my-2" @click.prevent="handleSignUp" type="submit"
                  id="register">Register
      </MainButton>
      <MainButton class="w-full mx-2 my-2" @click.prevent="closeAllModal" :reversed="true" id="cancel">Cancel</MainButton>
    </div>
    <div class="flex justify-center">
      <MainButton class="w-fit mx-2" @click.prevent="closeModal" :reversed="true" :is-alt="true">Back to login</MainButton>
    </div>
  </ModalTemplate>
  <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
    <div class="flex justify-center">
      <div
          v-if="loading"
          class="fixed z-30 inset-0 overflow-hidden bg-black bg-opacity-95 font-bold text-4xl text-orange-700 text-center top-1/4 bottom-1/4 py-52"
      >
        please wait, while we create your account
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
#register {
  background: $primary;

  &:hover {
    background: $secondary;
  }
}

#cancel {
  background: $secondary;

  &:hover {
    background: $primary;
  }
}
</style>