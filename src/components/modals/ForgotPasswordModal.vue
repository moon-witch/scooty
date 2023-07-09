<script setup lang="ts">
    import ModalTemplate from "@/components/modals/ModalTemplate.vue";
    import MainButton from "../buttons/MainButton.vue";
    import { supabase } from './../../supabase';
    import { ref, computed, watch } from "vue";
    
    const emit = defineEmits(["closeForgot", "closeAll"])
    const props = defineProps({
        showForgotPassword: {
            type: Boolean,
            default: false,
        },
        email: {
            type: String,
            default: ref("")
        }
    });
    const email = ref(props.email)
    watch(() => props.email, (newMail) => {
        email.value = newMail;
    })

const computedShowForgot = computed(() => {
  return props.showForgotPassword
})

function closeModal(): void {
  emit('closeForgot', email)
}

function closeAllModal() {
  emit('closeAll')
}

async function resetPassword() {
  try {
    await supabase.auth
        .resetPasswordForEmail(email.value);
    closeModal();
  } catch (e: any) {
    console.log(e)
  }
}
</script>

<template>
    <ModalTemplate :show="computedShowForgot">
      <h2 class="font-bold text-2xl text-center">Reset password</h2>
      <form class="flex flex-col justify-center">
          <label for="email">Email</label>
          <input id="email" type="email" v-model="email" @keypress.enter="resetPassword" class="custom_input text-amber-400 rounded-lg p-2 mb-2">
          <div class="flex jusity-center mb-2">
              <MainButton class="w-full" type="button" @click="resetPassword">Reset</MainButton>
              <MainButton class="w-full ml-1" :reversed="true" type="button" @click="closeAllModal">Cancel</MainButton>
          </div>
      </form>
        
      <div class="flex justify-center">
        <MainButton class="w-fit mx-2" @click.prevent="closeModal" :reversed="true" :is-alt="true">Back to login</MainButton>
      </div>
    </ModalTemplate>
</template>