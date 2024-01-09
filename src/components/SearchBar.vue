<script setup lang="ts">
import { ref, defineEmits } from "vue";

const emits = defineEmits();

const inputValue = ref("");

const handleChange = () => {
  emits("submit", inputValue.value);
};

const submit = () => {
  handleChange();
};
</script>

<template>
  <div class="container-search">
    <div class="search-div">
      <input
        class="search-input"
        type="text"
        v-model="inputValue"
        placeholder="Search for any word..."
      />
      <button class="search-icon" @click="submit">
        <img src="../assets/icon-search.svg" alt="" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-input {
  padding: 20px;
  border: none;
  background-color: var(--bg-input);
  color: var(--color-input);
  font: 1.25rem;
  width: 100%;
  max-width: 740px;
  margin: 0 auto 0 auto;
  border-radius: 1rem;
  font-family: inherit;
}
.container-search {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}

.search-div {
  position: relative;
  width: 100%;
  max-width: 740px;
}

.search-icon {
  position: absolute;
  background-color: transparent;
  right: 0;
  border: none;
  cursor: pointer;
  top: 50%;
  transform: translate(-50%, -50%);
  padding-right: 10px;
}
</style>
