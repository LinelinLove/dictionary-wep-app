<script setup lang="ts">
import { ref, watch, defineProps } from "vue";

const apiData = ref([] as any[]);
const props = defineProps(["searchValue"]);
const showSvg = ref(false);

watch(() => {
  // Vérifiez si props.searchValue est défini et non vide
  if (
    props.searchValue !== null &&
    props.searchValue !== undefined &&
    props.searchValue.trim() !== ""
  ) {
    fetchData();
  }
});

const fetchData = async () => {
  const searchTerm = props.searchValue;
  // console.log("Search term in Word component:", searchTerm);

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    apiData.value = await response.json();
    console.log(apiData.value);

    // Appeler playFirstAudio ici directement après le fetch
    isAudio(apiData.value[0]?.phonetics || []);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

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

const isAudio = (phonetics: { audio: string }[]) => {
  const audioToPlay = phonetics.find(
    (phonetic) => phonetic.audio && phonetic.audio.trim() !== ""
  );

  if (!audioToPlay) {
    console.warn("Aucun audio trouvé ou audio vide.");
    showSvg.value = false;
  } else {
    showSvg.value = true;
  }
};

const playFirstAudio = (phonetics: { audio: string }[]) => {
  const audioToPlay = phonetics.find(
    (phonetic) => phonetic.audio && phonetic.audio.trim() !== ""
  );

  if (audioToPlay) {
    playAudio(audioToPlay.audio);
  } else {
    console.warn("Aucun audio trouvé ou audio vide.");
    showSvg.value = false;
  }
};

const isPhonetic = (phonetics: { text: string }[]) => {
  const findPhonetics = phonetics.find(
    (phonetic) => phonetic.text && phonetic.text.trim() !== ""
  );

  if (!findPhonetics) {
    console.warn("Aucun phonetic trouvé.");
  } else {
    return findPhonetics;
  }
};
</script>

<template>
  <section v-for="(item, index) in apiData" :key="index" class="section">
    <div class="name-container">
      <div v-if="index === 0">
        <h1 class="word">{{ item.word }}</h1>
        <h2
          v-if="item.phonetics.length != 0 || isPhonetic(item.phonetics)"
          class="pronunciation"
        >
          {{ isPhonetic(item.phonetics)?.text || item.phonetic }}
        </h2>
      </div>
      <div v-if="index === 0">
        <svg
          v-if="showSvg"
          class="play-icon"
          width="75"
          height="75"
          viewBox="0 0 75 75"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          v-on:click="playFirstAudio(item.phonetics)"
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
      <h2 class="meaning">{{ meaning.partOfSpeech }}</h2>
      <h3 class="mean">Meaning</h3>
      <ul>
        <li v-for="meaningObject in meaning.definitions" :key="meaning.id">
          <div>
            <p>
              {{ meaningObject.definition }}
            </p>
            <p class="example">
              {{ meaningObject.example }}
            </p>
          </div>
        </li>
      </ul>

      <div class="antonyms-container" v-if="meaning.antonyms.length != 0">
        <h3 class="h3-word">Antonyms</h3>
        <ul class="antonyms-wrap">
          <li v-for="meaningObject in meaning.antonyms" :key="meaning.id">
            {{ meaningObject }}
          </li>
        </ul>
      </div>

      <div class="synonyms-container" v-if="meaning.synonyms.length != 0">
        <h3 class="h3-word">Synonyms</h3>
        <ul class="synonyms-wrap">
          <li v-for="meaningObject in meaning.synonyms" :key="meaning.id">
            {{ meaningObject }}
          </li>
        </ul>
      </div>
    </div>
    <hr class="hr" />
    <div class="source-container">
      <p class="source">Source</p>
      <ul>
        <li v-for="url in item.sourceUrls" class="url-container">
          <a :href="url" class="url">
            <p>
              {{ url }}
            </p>
            <img src="../assets/icon-new-window.svg" alt="" />
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.hr {
  margin-top: 40px;
  margin-bottom: 25px;
}
.section {
  max-width: 740px;
  margin: 0 auto 50px auto;
}
.url-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.url {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
.pronunciation {
  color: var(--purple);
  font-weight: 400;
}

.name-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.meaning:after {
  content: "";
  align-self: center;
  background: var(--stroke);
  height: 1px;
  margin-top: 10px;
}
.meaning {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  margin-bottom: 40px;
  margin-top: 40px;
}

.mean {
  margin-bottom: 25px;
  color: var(--grey-dark);
  font-weight: 400;
}

.example {
  color: var(--grey-dark);
}

.word {
  font-weight: 900;
}

ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 40px;
}

ul li {
  display: flex;
  gap: 16px;
}

ul li::before {
  content: "\2022";
  color: var(--purple);
  font-weight: bold;
  display: inline-block;
  /* width: 1em; */
}

.source-container {
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: flex-start;
}

.source-container ul {
  margin-bottom: 0px;
}

.source-container ul li::before,
.synonyms-container li::before,
.antonyms-container li::before {
  content: "";
  width: 0em;
}

.synonyms-wrap,
.antonyms-wrap {
  display: flex;
  flex-direction: row;
  gap: 3px;
  color: var(--purple);
  margin-bottom: 0;
}

.synonyms-container,
.antonyms-container {
  display: flex;
  gap: 25px;
  align-items: center;
}

.h3-word {
}

.source {
  /* border-top: 1px solid #fff; */
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
