<script setup lang="ts">
import { RouterView } from 'vue-router'
import {onMounted, ref} from "vue";
import { supabase } from './supabase'
import Landing from "@/views/HomeView.vue";
import MainLogo from "@/components/MainLogo.vue";

const session = ref()

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_: any, _session: any) => {
    session.value = _session
  })
})
</script>

<template>
  <div id="appContainer">
    <div v-if="session">
      <MainLogo :main="false" :small="true" />
      <RouterView v-if="session" :session="session"/>
    </div>
    <Landing v-else />
  </div>
</template>

<style lang="scss" scoped>
#appContainer {
  min-height: 100vh;
  background: $bg-dark;
}
</style>
<style lang="scss">
.leaflet-pane{
    z-index: 0 !important;
  }
</style>