<script setup lang="ts">
import Account from '@/components/Account.vue'

const props = defineProps(['session'])
</script>

<template>
  <div style="padding: 50px 0 100px 0">
    <Account :session="props.session" />
  </div>
</template>