<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { supabase, supabaseAdmin } from '../../supabase';
import MainButton from '@/components/buttons/MainButton.vue';
import type {User} from "@supabase/supabase-js";

const addUserEmail = ref("");
const allUsers = ref<User[]>([]);
onMounted(() => {
    loadUsers();
});

async function loadUsers(){
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()

    if(users){
      allUsers.value = users;
    }
}

async function addUser(){
    await supabaseAdmin.auth.admin.inviteUserByEmail(addUserEmail.value)
    loadUsers();
}

async function remove(id: any){
    await supabaseAdmin.auth.admin.deleteUser(id)
    loadUsers();
}

</script>

<template>
  <div class="flex justify-center mt-20 mx-96 py-12 rounded-xl custom_container">
    <table>
      <tr>
        <th class="mr-2">Email</th>
        <th class="mr-2">
        </th>
      </tr>
      <tr>
        <td>
          <input type="text" v-model="addUserEmail" class="custom_input">
        </td>
        <td>
          <MainButton @click="addUser">
            <i class="pi pi-plus" />
          </MainButton>
        </td>
      </tr>
      <tr v-for="user in allUsers">
        <td>{{ user.email }}</td>
        <td>
          <MainButton  @click="remove(user.id)"><i class="pi pi-trash"></i></MainButton>
        </td>
      </tr>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.custom_container {
  background-color: $bg-alt;
}
table {
    color: white;
    .custom_input {
        width: calc(100% - 1rem);
        margin: 0 0.5rem;
        border-width: 1px;
        background: $bg-bright;
        color: $bg-dark;

        &:focus {
            background: $bg-dark;
            color: $bg-bright;
            // font-weight: bolder;
        }
    }
}
</style>