<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import ModalTemplate from "@/components/modals/ModalTemplate.vue";
import MainButton from "../buttons/MainButton.vue";
import ModalBackdrop from "@/components/modals/ModalBackdrop.vue";
import BaseTimer from "@/components/BaseTimer.vue";
import {useRouter} from 'vue-router';

const router = useRouter()

const showReceiptModal = ref(false)
const showAny = ref(false)
const showTimer = ref(false)

const startingTime = ref()
const finalPrice = ref()
const rentTime = ref()

const emit = defineEmits(['receiptClosed', 'rideEnded'])

const props = defineProps({
  showEndButton: {
    type: Boolean,
    default: false
  },
  showTimer: {
    type: Boolean,
    default: false
  },
  pricePerMinute: {
    type: Number,
    default: 0.28
  },
  unlockFee: {
    type: Number,
    default: 1.99
  }
})

const handleEndRide = () => {
  emit('rideEnded')
  showReceiptModal.value = true;
  showTimer.value = false;

  calculateFinalPrice()
}

function closeModal(keepOpen = false) {
  showAny.value = false;
  showReceiptModal.value = false;
  emit('receiptClosed')
}

const getStartingTimer = computed(() => {
    console.log(startingTime.value)
})

function calculateFinalPrice() {
  const endTime = Date.now()
  const rideTime = Math.ceil((endTime - startingTime.value) / 60000)
  rentTime.value = Math.ceil((endTime - startingTime.value) / 1000)

  finalPrice.value = rideTime * props.pricePerMinute + props.unlockFee

}

watch(props, () => {
  if (props.showTimer) {
    startingTime.value = Date.now()
    showTimer.value = true;
  }
})

</script>

<template>
  <MainButton
      v-if="props.showEndButton"
      class="this_index_plus absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-12 z-10 text-7xl"
      @click="handleEndRide">
    end ride
  </MainButton>
  <BaseTimer v-if="showTimer" class="this_index"/>
  <ModalTemplate :show="showReceiptModal" :big-z-index="true">
    <h1 class="text-4xl font-bold text-center mb-8">Receipt</h1>
    <div class="text-center">
      <div class="my-2">Time rented: {{Math.floor(rentTime / 60)}}:{{(rentTime % 60 < 10 ? '0' : '') + rentTime % 60}} min</div>
      <div class="my-2">Booked price: {{ pricePerMinute }} € / min</div>
      <div class="my-2">Unlock fee: {{ unlockFee }} €</div>
      <div class="my-2 font-bold">Final price: {{finalPrice}} €*</div>
      <div class="text-xs">
        *counting every minute started.
      </div>
    </div>
    <div class="text-center my-8 italic">
      Thank you for choosing Scooty!
    </div>
    <div class="flex justify-center mt-8">
      <MainButton class="w-full mx-2" @click.prevent="closeModal" id="cancel" :reversed="true">Close</MainButton>
    </div>
  </ModalTemplate>
  <ModalBackdrop v-if="props.showEndButton" :showBackdrop="true"/>
</template>

<style scoped lang="scss">
.big_ass_z_index {
  z-index: 1700;
}

.this_button {
  border-radius: 150px;
  box-shadow: 0 0 100px 150px $bg-alt, inset 0 0 20px 200px $bg-alt;
  background-color: $bg-alt !important;
  z-index: 1450;
  width: 500px;
  height: 500px;

  &:hover {
    color: $secondary;
    border-color: transparent;
  }
}

.this_index {
  z-index: 1400;
}

.this_index_plus {
  z-index: 1450;
  background-color: transparent;
}

.real_container {
  height: 120px;
}

.custom_container {
  width: 120px;
}
</style>