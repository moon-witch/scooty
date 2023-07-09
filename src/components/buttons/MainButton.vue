<script setup lang="ts">

const props = defineProps({
  reversed: {
    type: Boolean,
    default: false
  },
  isAlt: {
    type: Boolean,
    default: false
  }
})

function computedClass() {
  return props.reversed ? "reversed" : "main";
}
</script>

<template>
  <button class="px-3 py-1.5 rounded-lg hover:rounded-xl transition-all"
          :class="computedClass(), {custom_button_alt: isAlt}">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.main {
  background-color: $primary;
  color: $bg-dark;

  &:hover, &:focus {
    background-color: $secondary;
    color: $bg-alt;
  }
}

.reversed {
  background-color: $secondary;
  color: $bg-alt;

  &:hover, &:focus {
    background-color: $primary;
    color: $bg-dark;
  }
}

.custom_button_alt {
  background-color: transparent;
  border: 1px solid $bg-dark;
  padding: 0.1rem 1rem;
  font-size: smaller;
  color: $bg-dark;

  &:hover {
    background-color: $bg-alt;
  }
}
</style>