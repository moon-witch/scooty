<script setup>
import {supabase} from '../supabase'
import {onMounted, ref, toRefs} from 'vue'
import icon from "@/assets/profile.png";
import MainButton from "@/components/buttons/MainButton.vue";
import Avatar from "@/components/Avatar.vue";

const props = defineProps(['session'])
const {session} = toRefs(props)

const loading = ref(true)
const username = ref('')
const website = ref('')
const avatar_url = ref('')

onMounted(() => {
  getProfile()
})

async function getProfile() {
  try {
    loading.value = true
    const {user} = session.value

    let {data, error, status} = await supabase
        .from('profiles')
        .select(`full_name, website, avatar_url`)
        .eq('id', user.id)
        .single()

    if (error && status !== 406) throw error

    if (data) {
      username.value = data.full_name
      website.value = data.website
      avatar_url.value = data.avatar_url
    }
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

async function updateProfile() {
  try {
    loading.value = true
    const {user} = session.value

    const updates = {
      id: user.id,
      email: user.email,
      full_name: username.value,
      website: website.value,
      avatar_url: avatar_url.value,
      updated_at: new Date(),
    }

    console.log(updates)

    let {error} = await supabase.from('profiles').upsert(updates)

    if (error) throw error
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

async function signOut() {
  try {
    loading.value = true
    let {error} = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="custom_main_container">
    <div class="">
      <div class="text-center">
        <div v-if="username" class="py-6 font-bold text-4xl">Hey, {{ username }}!</div>
        <div v-else class="py-6 font-bold text-4xl">Hey, anonymous!</div>
      </div>
      <div class="flex justify-center">
        <div class="custom_container text-center rounded-2xl p-12 mb-4">
          <div class="grid grid-cols-2">
            <div>
              <Avatar v-model:path="avatar_url" @upload="updateProfile" size="10"/>
            </div>
            <div class="pt-4">
              <h3 class="custom_header w-fit rounded-2xl font-bold text-xl my-8 -ml-20 px-4 py-2">Email: <span
                  class="mx-2 font-normal">
              {{ props.session.user.email }}</span>
              </h3>
            </div>
          </div>
          <form class="mx-24">
            <div class="flex flex-col justify-center my-4">
              <label class="w-1/6 font-bold" for="name">Name</label>
              <input v-model="username" type="text" id="name" class="custom_input rounded-lg p-2"/>
            </div>
            <div class="flex flex-col justify-center my-4">
              <label class="w-1/6 font-bold">Website</label>
              <input v-model="website" type="url" class="custom_input rounded-lg p-2">
            </div>
            <div class="flex justify-center my-8">
              <MainButton @click="updateProfile" class="mx-4">Update profile</MainButton>
            </div>
            <hr/>
            <div class="flex justify-center mt-8">
              <MainButton class="custom_delete_button mx-4" :reversed="true">Delete profile</MainButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom_main_container {
  color: $bg-alt;
}

.custom_container {
  background-color: $bg-alt;
  color: $bg-dark;
  width: 800px;
}

.custom_content:hover, i:hover {
  cursor: pointer;

  label:hover {
    cursor: pointer;
  }
}

.custom_header {
  border: 1px solid $bg-alt;
  box-shadow: 0 2px 4px 0 $bg-alt;
}

.custom_delete_button {
  background-color: #EF3E36;
  color: $bg-dark;
}
</style>