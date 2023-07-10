<script lang="ts" setup>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {supabase} from '../supabase';
import {Scooter} from "@/models/Scooter";
import ConfirmationModal from "./modals/ConfirmationModal.vue";
import EventEmitter from "events";
import axios from 'axios';
import type { RoutingResponse } from "@/models/RoutingResponse";
import { Coordinates } from "@/models/Coordinates";
const OSRM_API_KEY = import.meta.env.VITE_OSRM_API_KEY

const props = defineProps({
  addToggle: {
    type: Boolean,
    default: false
  },
  deleteToggle: {
    type: Boolean,
    default: false
  },
  reloadTrigger: {
    type: Number,
    default: 0
  },
  calcMode: {
    type: Boolean,
    default: false
  },
  reset: {
    type: Boolean,
    default: false
  }
})

watch(props, () => {
  if(props.reset){
    clearRoute()
    emit('resetRoute')
  }
})
const emit = defineEmits(['routeCalculated', 'showBookingModal', 'resetRoute'])

const reloadTriggerVal = ref(props.reloadTrigger)
const HQ_LOCATION: [number, number] = [53.4996084094697, 10.002430559393813];
const DEFAULT_ZOOM = 17;
const confirmMessage = ref("");
const addingScooters = ref(false);
const deletingScooters = ref(false);
const showConfirmation = ref(false);
const eventEmitter = new EventEmitter();
const scooterIcon = L.icon({ 
    iconUrl: "scooter_pin.png",
    iconSize: [50,50],
    iconAnchor: [28,35],
  });

const routeDestinationIcon = L.icon({
  iconUrl: "marker-icon.png"
})

let selectedScooter: Scooter | undefined;
let scooters: { scooter: Scooter, marker: L.Marker | undefined }[] = [];
let map: L.Map;
let initialized: boolean;
let currentDisplayedRoute: {line : L.Polyline, startMarker?: L.Marker, endMarker: L.Marker} | undefined;

async function loadScooters() {
  scooters.forEach(s => {s.marker?.removeFrom(map)})
  scooters = (await supabase.from('scooter').select()).data?.map((s: Scooter) => {
    let marker: L.Marker | undefined;
    if(s.latitude && s.longitude){
      marker = L.marker([s.latitude, s.longitude], { icon: scooterIcon })
        .on('click', () => {
          if(props.deleteToggle){
            deleteScooter(s.id)
          }else{
            selectedScooter = s;
            emit('showBookingModal')
          }
      }).addTo(map)
    }
    return {
      scooter: s as Scooter,
      marker: marker
    }
  }) || [];
}

async function loadUserLocation() {
  navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (initialized) map.flyTo([pos.coords.latitude, pos.coords.longitude], DEFAULT_ZOOM)
        else map.setView([pos.coords.latitude, pos.coords.longitude], DEFAULT_ZOOM)
      }
  )
}

async function addScooter(latitude: number, longitude: number) {
  try {
    await supabase.from('scooter').insert(new Scooter({
      latitude: latitude,
      longitude: longitude,
      available: !!latitude && !!longitude
    }))
    loadScooters();
  } catch (e) {
    console.log(e)
  }
}

function deleteScooter(id: any) {
  eventEmitter.once('deleteScooter', async (c: boolean) => {
    if (c) {
      scooters.find(s => s.scooter.id == id)?.marker?.removeFrom(map)
      await supabase.from('scooter').delete().eq('id', id);
      loadScooters();
    }
  })
  confirmMessage.value = "Willst du den Scooter Löschen"
  showConfirmation.value = true;
}

async function getRoute(start: Coordinates, dest: Coordinates){
  let url = `https://api.openrouteservice.org/v2/directions/cycling-electric?api_key=${OSRM_API_KEY}&start=${start.lng},${start.lat}&end=${dest.lng},${dest.lat}`
  let headers = {
    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
  }
  return (await axios.get<RoutingResponse>(url, {
    headers: headers
  })).data;
}

async function calcRoute(scooterCoordinates: Coordinates, destination: Coordinates){
  clearRoute();
  let route = await getRoute(scooterCoordinates, destination)
  let distance = 0;
  let lineCoords: [number, number][] = [];

  route.features.forEach(f => {
    distance += f.properties.summary.distance;
    lineCoords = lineCoords.concat(f.geometry.coordinates.map(c => [c[1], c[0]]))
  });

  currentDisplayedRoute = {
    line: L.polyline(lineCoords, {color: "black", weight: 3}).addTo(map),
    endMarker: L.marker(lineCoords[lineCoords.length - 1], {icon: routeDestinationIcon}).addTo(map)
  }

  emit('routeCalculated', distance)  
}

function clearRoute(){ // @todo
  if(!currentDisplayedRoute) return;
  currentDisplayedRoute.line.remove();
  currentDisplayedRoute.endMarker.remove();
}

watch(props, () => {
  addingScooters.value = props.addToggle;
  deletingScooters.value = props.deleteToggle;
  if (props.reloadTrigger != reloadTriggerVal.value) {
    reloadTriggerVal.value = props.reloadTrigger;
    loadScooters();
  }
});

onMounted(() => {
  map = L.map("mapContainer")
    .setView(HQ_LOCATION, DEFAULT_ZOOM)
    .on('click', ($event) => {
      if(props.calcMode && selectedScooter){
        calcRoute(Coordinates.fromScooter(selectedScooter), new Coordinates($event.latlng.lat, $event.latlng.lng))
      }
    });
  loadScooters();
  loadUserLocation();
  //use a mix of renderers
  let customPane = map.createPane("customPane");
  customPane.style.zIndex = '399'; // put just behind the standard overlay pane which is at 400
  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  initialized = true;

  map.on('click', ($event) => {
    if (addingScooters.value) addScooter($event.latlng.lat, $event.latlng.lng)
  })
});

onBeforeUnmount(() => {
  if (map) {
    map.remove();
  }
});
</script>

<template>
  <div class="flex justify-center pb-4 pt-12 mt-12">
    <div class="rounded-2xl" id="mapContainer"></div>
  </div>
  <div class="flex justify-center py-12">
    <ConfirmationModal
        :show="showConfirmation"
        :message="confirmMessage"
        :onConfirm="() => {showConfirmation=false; eventEmitter.emit('deleteScooter', true);}"
        :onDeny="() => {showConfirmation=false; eventEmitter.emit('deleteScooter', false)}"
    ></ConfirmationModal>
  </div>
</template>


<style scoped lang="scss">
#mapContainer {
  width: 80%;
  height: 70vh;
  box-shadow: 0 0 6px 3px $bg-alt;
}

i {
  color: $bg-alt;
  background-color: $bg-dark;
  border: 1px solid $bg-alt;
  border-radius: 150px;
}
</style>