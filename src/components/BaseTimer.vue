<script setup lang="ts">
import {computed, onMounted, ref} from "vue";

const timePassed = ref(0)


onMounted(() => {
  startTimer()
})

const formattedTimeLeft = computed(() => {
  const scopedTimeLeft = timePassed.value
  // The largest round integer less than or equal
  //to the result of time divided being by 60.
  const minutes = Math.floor(scopedTimeLeft / 60)
  // Seconds are the remainder of the time divided
  //by 60 (modulus operator)
  const seconds = ref((scopedTimeLeft % 60).toString())
  // If the value of seconds is less than 10,
  //then display seconds with a leading zero
  if (Number(seconds.value) < 10) {
    seconds.value = `0${seconds.value}`
  }
  // The output in MM:SS format
  return `${minutes}:${seconds.value}`
})

const circleDasharray = computed(() => {
  const realTimeFraction = ref((timeFraction.value * 282.6) + ' ' + '283')
  return realTimeFraction.value;
})

const timeFraction = computed(() => {
  const realTimePassed = ref(timePassed.value % 60)


  // Divides time left by the defined time limit.
  return realTimePassed.value  / 60;
})

function startTimer() {
  const timerInterval = setInterval(() => (timePassed.value += 1), 1000);
}
</script>

<template>
  <div class="base-timer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <svg
        class="base-timer__svg"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
    >
      <g class="base-timer__circle">
        <circle
            class="base-timer__path-elapsed"
            cx="50"
            cy="50"
            r="46.5"
        />
        <path
            :stroke-dasharray="circleDasharray"
            class="base-timer__path-remaining"
            d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "></path>
      </g>
    </svg>
    <span class="base-timer__label pb-28">
      {{ formattedTimeLeft }}
    </span>
  </div>
</template>

<style scoped lang="scss">
/* Sets the containers height and width */
.base-timer {
  width: 550px;
  height: 550px;

  &__label {
    position: absolute;
    color: $bg-dark;

    /* Size should match the parent container */
    width: 550px;
    height: 550px;
    /* Keep the label aligned to the top */
    top: 0;
    /* Create a flexible box that centers content vertically and horizontally */
    display: flex;
    align-items: center;
    justify-content: center;
    /* Sort of an arbitrary number; adjust to your liking */
    font-size: 62px;
  }

  /* Removes SVG styling that would hide the time label */
  &__circle {
    fill: none;
    stroke: none;
  }

  /* The SVG path that displays the timer's progress */
  &__path-elapsed {
    stroke-width: 7px;
    stroke: grey;
  }

  &__path-remaining {
    /* Just as thick as the original ring */
    stroke-width: 7px;
    /* Rounds the line endings to create a seamless circle */
    stroke-linecap: round;
    /* Makes sure the animation starts at the top of the circle */
    transform: rotate(90deg);
    transform-origin: center;
    /* One second aligns with the speed of the countdown timer */
    transition: 1s linear all;
    /* Allows the ring to change color when the color value updates */
    stroke: $secondary; // green
  }

  &__svg {
    // Flips the svg and makes the animation to move left-to-right
    transform: scaleX(-1);
  }
}
</style>