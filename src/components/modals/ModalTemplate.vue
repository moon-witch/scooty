<script setup lang="ts">
const props = defineProps({
      show: {
        type: Boolean,
        default: false,
      },
      bigZIndex: {
        type: Boolean,
        default: false
      }
    }
)
</script>

<template>
  <teleport to="body">
    <div :class="{custom_big_index: props.bigZIndex, custom_index: !props.bigZIndex}"
         class="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
      <div
          v-if="props.show"
          class="flex items-start justify-center max-h-screen pt-24 text-center"
      >
        <transition
            enter-active-class="transition ease-out duration-300 transform "
            enter-from-class="opacity-0 translate-y-10 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-10 translate-y-0 scale-95"
        >
          <div
              class="custom_modal rounded-lg text-left overflow-hidden shadow-xl p-8 w-1/3"
              role="dialog"
              ref="modal"
              aria-modal="true"
              aria-labelledby="modal-headline"
          >
            <slot>I am an empty slot</slot>
          </div>
        </transition>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.custom_modal {
  background: $bg-alt;
  width: 450px;
}

.custom_index {
  z-index: 1400;
}

.custom_big_index {
  z-index: 1700;
}
</style>