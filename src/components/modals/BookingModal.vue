<script setup lang="ts">
import {computed, ref} from "vue";
import ModalTemplate from "@/components/modals/ModalTemplate.vue";
import MainButton from "../buttons/MainButton.vue";
import ModalBackdrop from "@/components/modals/ModalBackdrop.vue";

const estimatedAverageSpeed = 15;
const showAny = ref(false)
const loading = ref(false)
const selectedImage = ref();
const finalPrice = ref()

const emit = defineEmits(['rideStarted', 'rideStartedAlt', 'activateCalcMode', 'showBookingModal'])

const props = defineProps({
  showStartButton: {
    type: Boolean,
    default: true
  },
  routeDistance: {
    type: Number,
    default: 0
  },
  pricePerMinute: {
    type: Number,
    default: 0.28
  },
  showBookingModal: {
    type: Boolean,
    default: false
  }
});

const handleStartRide = () => {
  emit('rideStarted')
  emit('rideStartedAlt')
  closeModal()
}

function handleCalculateMode() {
  emit("activateCalcMode");
  showAny.value = false;
}

function handleShowModal() {
  emit('showBookingModal')
}

function closeModal() {
  showAny.value = false;
  emit('showBookingModal')
}

const getImg = computed(() => {
  const images = ['Scooter_1.png', 'Scooter_2.png', 'Scooter_3.png']
  selectedImage.value = images[Math.floor(Math.random() * images.length)]
  return 'public/ScooterImages/' + selectedImage.value
})

const getFinalPrice = computed(() => {
  return ((props.routeDistance / (estimatedAverageSpeed / 0.06)) * props.pricePerMinute).toFixed(2)
})

</script>

<template>
  <ModalTemplate :show="showBookingModal">
    <div class="grid grid-cols-2">
      <div class="real_container">
        <img :src="getImg" class="custom_container rounded-full ml-4">
      </div>
      <div>
        <div class="mb-4 text-center">
          <div class="font-bold">
            Current price per minute:
          </div>
          <div class="text-xl">28ct</div>
        </div>
        <div class="mb-4 text-center">
          <div class="font-bold">
            Unlocking fee:
          </div>
          <div class="text-xl">1,99 €</div>
        </div>
        <div v-if="routeDistance != 0" class="text-center">
          <div class='font-bold'>
            Estimated price for your trip:
          </div>
          <div class="text-xl">{{ getFinalPrice }} €*
          </div>
          <div class="text-xs mt-2">
            *not including unlock fee
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center justify-center mt-8">
      <div class="flex justify-center">
        <MainButton type="submit" class="w-fit mx-2" @click.prevent="handleStartRide">Start the ride</MainButton>
        <MainButton class="w-fit mx-2" @click.prevent="handleCalculateMode" id="cancel"
                    :reversed="true">Calculate
          price
        </MainButton>
      </div>
      <div class="mt-4">
        <MainButton class="w-full mx-2" :is-alt="true" @click.prevent="closeModal" id="cancel"
                    :reversed="true">
          back to map
        </MainButton>
      </div>
    </div>
  </ModalTemplate>
  <ModalBackdrop :showBackdrop="showAny || showBookingModal" @backdrop-clicked="closeModal"/>
</template>

<style scoped lang="scss">
.real_container {
  height: 120px;
}

.custom_container {
  width: 120px;
}
</style>