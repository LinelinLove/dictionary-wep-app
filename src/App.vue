<script setup lang="ts">
import Header from "./components/Header.vue";
import SearchBar from "./components/SearchBar.vue";
import Word from "./components/Word.vue";
import { ref } from "vue";

const searchValue = ref("");

// La fonction handleChange reçoit la valeur de l'input et met à jour searchValue
const handleSearchSubmit = (value: string) => {
  searchValue.value = value;
  // console.log("App : ", searchValue.value);
};
</script>

<template>
  <Header />
  <SearchBar @submit="handleSearchSubmit" />
  <Word :searchValue="searchValue" />
</template>
