<script setup lang="ts">
defineProps<{ msg: string }>();
</script>

<template>
  <!-- <h1>{{ msg }}</h1> -->
  <header>
    <div>
      <img src="../assets/logo.svg" alt="" />
    </div>
    <div class="header-right">
      <p class="font">Sans-serif</p>
      <img src="../assets/icon-moon.svg" alt="" />
    </div>
  </header>
</template>

<style scoped>
header {
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
</style>
