<script setup lang="ts">
import { ref, onMounted } from "vue";
const apiData = ref([] as any[]);

onMounted(async () => {
  try {
    const response = await fetch(
      "https://api.dictionaryapi.dev/api/v2/entries/en/hello"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    apiData.value = await response.json();
    console.log(apiData.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

function playAudio(urlAudio: string | undefined) {
  var audio = new Audio(urlAudio);
  audio.play();
}
</script>

<template>
  <section v-for="item in apiData" :key="item.id">
    <div class="name-container">
      <div>
        <h1>{{ item.word }}</h1>
        <p class="pronunciation">{{ item.phonetics[1].text }}</p>
        <!-- <p class="pronunciation">{{ item.phonetics[1].audio }}</p> -->
      </div>
      <div>
        <img
          class="play"
          v-on:click="playAudio(item.phonetics[0].audio)"
          src="../assets/icon-play.svg"
          alt=""
        />
      </div>
    </div>

    <div v-for="meaning in item.meanings" :key="meaning.id" class="subtitle">
      <h2>{{ meaning.partOfSpeech }}</h2>
      <p>Meaning</p>
      <ul>
        <li v-for="meaningObject in meaning.definitions" :key="meaning.id">
          {{ meaningObject.definition }}
        </li>
      </ul>

      <div v-if="meaning.antonyms.length != 0">
        <p>Antonyms</p>
        <ul>
          <li v-for="meaningObject in meaning.antonyms" :key="meaning.id">
            {{ meaningObject }}
          </li>
        </ul>
      </div>

      <div v-if="meaning.synonyms.length != 0">
        <p>Synonyms</p>
        <ul>
          <li v-for="meaningObject in meaning.synonyms" :key="meaning.id">
            {{ meaningObject }}
          </li>
        </ul>
      </div>
    </div>
    <div>
      <p class="source">Source</p>
      <ul>
        <li v-for="url in item.sourceUrls">
          {{ url }} <img src="../assets/icon-new-window.svg" alt="" />
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}

section {
  max-width: 740px;
  margin: 0 auto 50px auto;
}

h1 {
  font-size: 64px;
  line-height: normal;
}

.pronunciation {
  color: hsl(274deg, 82%, 60%);
  font-size: 24px;
}

.name-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

h2:after {
  content: "";
  align-self: center;
  background: #fff;
  height: 1px;
  margin-top: 10px;
}
h2 {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: auto 1fr;
  gap: 2rem;
}

ul {
  list-style: none;
}

ul li::before {
  content: "\2022";
  color: red;
  font-weight: bold;
  display: inline-block;
  width: 1em;
}

.source {
  border-top: 1px solid #fff;
  padding-top: 1.5rem;
}

.play {
  cursor: pointer;
}

.play:hover {
  /* fill: var(--theme-play-hover); */
  /* color: var(--theme-play-highlight); */
  opacity: 0.9;
}
</style>
