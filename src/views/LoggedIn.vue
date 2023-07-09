<script setup lang="ts">
import {supabase} from "../supabase";
import {onMounted, ref} from "vue";
import ProfileButton from "@/components/buttons/ProfileButton.vue";
import SettingsButton from "@/components/buttons/SettingsButton.vue";
import BookingModal from "@/components/modals/BookingModal.vue";
import Map from "@/components/ScooterMap.vue"
import Receipt from "@/components/modals/Receipt.vue";
const admins = import.meta.env.VITE_ADMINS;

const isAdmin = ref(false)
const loading = ref(false)
const addToggle = ref(false);
const deleteToggle = ref(false);
const reloadTriggerVal = ref(0)
const showEndButton = ref(false)
const showStartButton = ref(true)
const activeRide = ref(false)
const showBookingModal = ref(false)
const routeCalcMode = ref(false);
const routeDistance = ref(0)
const resetRoute = ref(false)

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
  resetRoute.value = true;
}

function toggleRide() {
  activeRide.value = !activeRide.value
}

function toggleCalcMode() {
  routeCalcMode.value = !routeCalcMode.value;
  showBookingModal.value = false;
}

function toggleBookingModal() {
  showBookingModal.value = !showBookingModal.value;
}

function updateRouteDistance(newDistance: any) {
  routeDistance.value = newDistance;
  routeCalcMode.value = false;
  showBookingModal.value = true;
}

onMounted(async () => {
  isAdmin.value = admins.includes((await supabase.auth.getUser()).data.user?.email)
})
</script>

<template>
  <ProfileButton @logout-pressed="handleSignOut"/>
  <SettingsButton v-if="isAdmin" @add-pressed="toggleAdd" @reload-pressed="triggerReload" @delete-pressed="toggleDelete"/>
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
    <Map 
      :add-toggle="addToggle" 
      :calc-mode="routeCalcMode" 
      :delete-toggle="deleteToggle" 
      :reset="resetRoute"
      :reload-trigger="reloadTriggerVal" 
      @show-booking-modal="toggleBookingModal" 
      @route-calculated="updateRouteDistance($event)"
      @reset-route="resetRoute=false"
    />
  </div>
</template>

<style lang="scss" scoped>
</style>