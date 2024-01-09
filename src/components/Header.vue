<script setup lang="ts">
import { ref } from "vue";
import Select from "./Select.vue";
const isDarkMode = ref(false);

const toggleDarkMode = () => {
  console.log("Dark mode toggled:", isDarkMode.value);

  const body = document.body;
  if (isDarkMode.value) {
    body.classList.add("dark-mode");
    console.log("dark");
  } else {
    body.classList.remove("dark-mode");
    console.log("light");
  }
};
</script>

<template>
  <header class="header">
    <div>
      <img src="../assets/logo.svg" alt="" />
    </div>
    <div class="header-right">
      <Select />
      <label class="switch">
        <input type="checkbox" @change="toggleDarkMode" v-model="isDarkMode" />
        <span class="slider round"></span>
      </label>

      <img src="../assets/icon-moon.svg" alt="" />
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 740px;
  margin: 56px auto 40px auto;
}
.font {
  padding: 15px;
  border-right: 1px solid black;
}

.header-right {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
}
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--grey-dark);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
input:checked + .slider {
  background-color: var(--purple);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--purple);
}

input:checked + .slider:before {
  -webkit-transform: translateX(18px);
  -ms-transform: translateX(18px);
  transform: translateX(18px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

/* select */
#font-select {
  width: 140px;
  font-size: 16px;
  border: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: url("../assets/icon-arrow-down.svg") 96% / 10% no-repeat;
  padding: 10px 0 10px 10px;
}
#font-select:focus {
  /* Empêcher le focus visuel pour les utilisateurs de clavier */
  outline: none;
}
</style>
