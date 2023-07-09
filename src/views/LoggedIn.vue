<script setup lang="ts">
import MainButton from "@/components/buttons/MainButton.vue";
import {supabase} from "../supabase";
import {ref} from "vue";
import ProfileButton from "@/components/buttons/ProfileButton.vue";
import SettingsButton from "@/components/buttons/SettingsButton.vue";
import BookingModal from "@/components/modals/BookingModal.vue";
import Map from "@/components/ScooterMap.vue"
import Receipt from "@/components/modals/Receipt.vue";

const loading = ref(false)
const addToggle = ref(false);
const deleteToggle = ref(false);
const reloadTriggerVal = ref(0)
const showEndButton = ref(false)
const showStartButton = ref(true)
const activeRide = ref(false)
const showBookingModal = ref(false)
const activateCalcMode = ref(false);
const routeDistance = ref(0)
const finalPrice = ref(0)
const currentPrice = ref()

const props = defineProps(['session'])
const handleSignOut = async () => {
  try {
    loading.value = true
    const {error} = await supabase.auth.signOut()
    if (error) throw error
    alert('Logged out!')
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message)
    }
  } finally {
    loading.value = false
  }
}

function toggleAdd() {
  addToggle.value = !addToggle.value
}

function toggleDelete() {
  deleteToggle.value = !deleteToggle.value
}

function triggerReload() {
  reloadTriggerVal.value += 1;
}

function toggleEndButton() {
  showEndButton.value = !showEndButton.value
  showStartButton.value = !showStartButton.value
}

function toggleRide() {
  activeRide.value = !activeRide.value
  console.log('ride toggled')
}

function toggleCalcMode() {
  activateCalcMode.value = !activateCalcMode.value;
  toggleBookingModal()
}

function toggleBookingModal() {
  showBookingModal.value = !showBookingModal.value;
}

function updateRouteDistance(newDistance: any) {
  routeDistance.value = newDistance;
  toggleBookingModal()
}
</script>

<template>
  <ProfileButton @logout-pressed="handleSignOut"/>
  <SettingsButton @add-pressed="toggleAdd" @reload-pressed="triggerReload" @delete-pressed="toggleDelete"/>
  <BookingModal :route-distance="routeDistance"
                :show-start-button="showStartButton"
                :show-booking-modal="showBookingModal"
                @activate-calc-mode="toggleCalcMode"
                @ride-started="toggleEndButton"
                @ride-started-alt="toggleRide"
                @show-booking-modal="toggleBookingModal"
                />
  <Receipt :show-end-button="showEndButton"
           :show-timer="activeRide"
           @ride-ended="toggleRide"
           @receipt-closed="toggleEndButton"/>
  <div>
    <Map :add-toggle="addToggle" :calc-mode="activateCalcMode" :delete-toggle="deleteToggle"
         :reload-trigger="reloadTriggerVal" @route-calculated="updateRouteDistance($event)"/>
  </div>
</template>

<style lang="scss" scoped>
</style>