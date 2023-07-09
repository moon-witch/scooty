<script lang="ts" setup>
import { computed, ref } from 'vue';
import MainButton from '../buttons/MainButton.vue';
import ModalTemplate from './ModalTemplate.vue';


const props = defineProps({
    title: {
        type: String,
        default: "Confirmation Required"
    },
    message: {
        type: String,
        default: "Please confirm something."
    },
    confirmText: {
        type: String,
        default: undefined
    },
    denyText : {
        type: String,
        default: undefined
    },
    show: {
        type: Boolean,
        default: false
    }
})

const computedShow = computed(() => props.show)

const emit = defineEmits(['confirm', 'deny'])

function confirm(){
    emit('confirm');
}

function deny(){
    emit('deny');
}

</script>

<template>
    <ModalTemplate :show="show">
        <div class="flex justify-center pb-3">
            <h1>{{title }}</h1>
        </div>
        <div class="flex justify-center">
            <p>{{ message }}</p>
        </div>
        <div class="flex justify-center">    
            <MainButton class="w-full mr-1" @click="confirm">
                <div v-if="confirmText">{{ confirmText }}</div>
                <i v-else class="pi pi-check"></i>
            </MainButton>
            <MainButton class="w-full ml-1" @click="deny">
                <div v-if="denyText">{{ denyText }}</div>
                <i v-else class="pi pi-times"></i>
            </MainButton>
        </div>
    </ModalTemplate>
</template>

<style lang="scss" scoped>
</style>