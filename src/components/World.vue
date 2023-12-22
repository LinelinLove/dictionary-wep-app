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

const handleMouseEnter = () => {
  const circle = document.getElementById("circle-fill");
  if (circle) {
    circle.classList.add("hovered");
  }
};

const handleMouseLeave = () => {
  const circle = document.getElementById("circle-fill");
  if (circle) {
    circle.classList.remove("hovered");
  }
};

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
      </div>
      <div>
        <svg
          class="play-icon"
          width="75"
          height="75"
          viewBox="0 0 75 75"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          v-on:click="playAudio(item.phonetics[0].audio)"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <circle
            cx="37.5"
            cy="37.5"
            r="37.5"
            class="circle-fill"
            id="circle-fill"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M29 27V48L50 37.5L29 27Z"
            class="path-fill"
          />
        </svg>
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
section {
  max-width: 740px;
  margin: 0 auto 50px auto;
}

h1 {
  font-size: 64px;
  line-height: normal;
}

.pronunciation {
  color: var(--purple);
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
  color: var(--purple);
  font-weight: bold;
  display: inline-block;
  width: 1em;
}

.source {
  border-top: 1px solid #fff;
  padding-top: 1.5rem;
}

/* test */
.play-icon {
  cursor: pointer;
  transition: fill 0.3s ease;
}

.circle-fill {
  opacity: 0.25;
  fill: var(--purple);
}

.circle-fill:hover {
  fill: #a445ed;
  opacity: 1;
}

.path-fill {
  fill: var(--purple);
}

.path-fill:hover {
  fill: white;
}

.circle-fill:hover ~ .path-fill {
  fill: white;
}
.circle-fill.hovered {
  fill: #a445ed;
  opacity: 1;
}
</style>
