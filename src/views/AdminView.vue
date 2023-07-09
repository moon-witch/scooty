<script setup lang="ts">
import MainButton from '@/components/buttons/MainButton.vue';
import router from '@/router';

function navigate(route: string) {
    router.push(route);
}
</script>

<template>
    <MainButton @click.prevent="navigate('users')">User Management</MainButton>
    <MainButton @click.prevent="navigate('scooter-management')">Scooter Management</MainButton>
    <MainButton @click.prevent="navigate('price-management')">Price Management</MainButton>
</template>
