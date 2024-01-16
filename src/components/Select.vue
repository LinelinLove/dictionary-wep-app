<template>
  <div class="custom-select">
    <div
      class="selected-option"
      @click="toggleDropdown"
      :style="{ fontFamily: selectedOption.font }"
    >
      {{ selectedOption.name }}
      <img
        v-if="showDropdown"
        class="arrow-up"
        src="../assets/icon-arrow-down.svg"
        :style="{ transform: 'rotate(180deg)' }"
        alt="Up Arrow"
      />
      <img
        v-else
        class="arrow-down"
        src="../assets/icon-arrow-down.svg"
        alt="Down Arrow"
      />
    </div>
    <div v-if="showDropdown" class="options">
      <div
        v-for="option in options"
        :key="option.name"
        @click="selectOption(option)"
        :style="{ fontFamily: option.font }"
        :class="{ 'selected-font': option === selectedOption }"
      >
        {{ option.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";

const showDropdown = ref(false);
const options = ref([
  { name: "Serif", font: "var(--sans-serif)" },
  { name: "Sans-serif", font: "var(--serif)" },
  { name: "Mono", font: "var(--mono)" },
]);
const selectedOption = ref(options.value[0]);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const selectOption = (option: any) => {
  selectedOption.value = option;
  showDropdown.value = false;
};

// Watch for changes in selectedOption and update body font-family
watch(selectedOption, (newVal) => {
  document.body.style.fontFamily = newVal.font;
});

// Handle clicks outside of the custom-select
const handleClickOutside = (event: MouseEvent) => {
  const customSelect = document.querySelector(".custom-select");
  if (customSelect && !customSelect.contains(event.target as Node)) {
    showDropdown.value = false;
  }
};

// Add event listener on component mount and remove it on unmount
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.selected-font {
  color: var(--purple) !important;
}

.custom-select {
  position: relative;
  width: 140px;
}

.selected-option {
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arrow-up,
.arrow-down {
  width: 10px;
  height: 10px;
}

.options {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 10;
  box-shadow: var(--shadow);
  overflow: hidden;
  border-radius: 8px;
}

.options div {
  padding: 10px;
  cursor: pointer;
  background-color: var(--bg-select);
  color: inherit;
}

.options div:hover {
  color: var(--purple);
}

.custom-select .options {
  display: block;
}
</style>
