<!-- <script setup lang="ts">
import { ref, defineEmits } from "vue";

const emits = defineEmits();

const inputValue = ref("");

const handleChange = () => {
  emits("submit", inputValue.value);
};

const submit = () => {
  handleChange();
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    submit();
    console.log("enter is pressed !");
  }
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
        @keyup.enter="handleKeyPress"
      />
      <button class="search-icon" @click="submit">
        <img src="../assets/icon-search.svg" alt="" />
      </button>
    </div>
  </div>
</template> -->

<template>
  <div class="container-search">
    <div class="search-div">
      <input
        class="search-input"
        type="text"
        v-model="inputValue"
        placeholder="Search for any word..."
        @keyup.enter="submit"
      />
      <!-- <router-link :to="{ name: 'WordDetail', params: { word: inputValue } }"> -->
      <button class="search-icon" @click="submit">
        <img src="../assets/icon-search.svg" alt="" />
      </button>
      <!-- </router-link> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, watch, nextTick } from "vue";
import { useRouter } from "vue-router";

const emits = defineEmits();
const inputValue = ref("");
const router = useRouter();

watch(
  () => router.currentRoute.value.params.word,
  async (newWord) => {
    if (newWord !== inputValue.value) {
      // Attendez la prochaine mise à jour du cycle de rendu pour éviter un avertissement de modification non réactive
      await nextTick();
      inputValue.value = newWord;
      emits("submit", inputValue.value);
    }
  }
);

const handleChange = () => {
  emits("submit", inputValue.value);
  router.push({ name: "WordDetail", params: { word: inputValue.value } });
};

const submit = () => {
  handleChange();
};
</script>

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
  font-weight: 700;
  font-size: var(--heading-s);
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
