<script setup lang="ts">
import { ref, watch, defineProps, onMounted } from "vue";
import { useRouter } from "vue-router";
import Spinner from "./Spinner.vue";

const wordParam = ref("");
const router = useRouter();
const loading = ref(false);

interface ErrorMessage {
  title: string;
  message: string;
  resolution: string;
}

const errorMsg: ErrorMessage = {
  title: "",
  message: "",
  resolution: "",
};

onMounted(() => {
  wordParam.value = router.currentRoute.value.params.word;
  console.log(wordParam.value);
});

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
  loading.value = true; // Activez le chargement au début de la recherche
  const searchTerm = props.searchValue;
  // console.log("Search term in Word component:", searchTerm);

  try {
    errorMsg.title = "";
    errorMsg.message = "";
    errorMsg.resolution = "";
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`
    );

    if (response.ok) {
      apiData.value = await response.json();
      console.log(apiData.value);

      // Appeler playFirstAudio ici directement après le fetch
      isAudio(apiData.value[0]?.phonetics || []);
    } else {
      // Gérer le cas où la requête a échoué
      console.error("Failed to fetch data. Status:", response.status);

      // Si vous souhaitez également récupérer le contenu de la réponse en cas d'échec,
      // vous pouvez utiliser response.text() ou response.json() ici
      const errorMessage = await response.json();
      // console.log("Error message from API:", errorMessage);
      errorMsg.title = errorMessage.title;
      errorMsg.message = errorMessage.message;
      errorMsg.resolution = errorMessage.resolution;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false; // Désactivez le chargement une fois la recherche terminée
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
  <section v-if="loading" class="loader section">
    <!-- Mettez ici votre élément de chargement, par exemple un spinner -->
    <Spinner />
  </section>

  <section v-else-if="errorMsg.title != ''" class="error section">
    <h1>😕</h1>
    <h2>
      {{ errorMsg.title }}
    </h2>
    <h3>
      {{ errorMsg.message }}
    </h3>
  </section>

  <section v-else v-for="(item, index) in apiData" :key="index" class="section">
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
            <p v-if="meaningObject.example" class="example">
              "{{ meaningObject.example }}"
            </p>
          </div>
        </li>
      </ul>

      <div v-if="meaning.antonyms.length != 0">
        <div class="antonyms-container">
          <h3 class="h3-word">Antonyms</h3>
          <ul class="antonyms-wrap">
            <li
              class="link-word"
              v-for="meaningObject in meaning.antonyms"
              :key="meaning.id"
            >
              <router-link
                :to="{ name: 'WordDetail', params: { word: meaningObject } }"
              >
                {{ meaningObject }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div
        v-if="meaning.synonyms.length != 0 && meaning.antonyms.length != 0"
        class="space-between"
      ></div>
      <div v-if="meaning.synonyms.length != 0">
        <div class="synonyms-container">
          <h3 class="h3-word">Synonyms</h3>
          <ul class="synonyms-wrap">
            <li
              class="link-word"
              v-for="meaningObject in meaning.synonyms"
              :key="meaning.id"
            >
              <router-link
                :to="{ name: 'WordDetail', params: { word: meaningObject } }"
              >
                {{ meaningObject }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <hr class="hr" />
    <div class="source-container">
      <p class="source">Source</p>
      <ul class="source-wrap">
        <li v-for="url in item.sourceUrls" class="url-container">
          <a :href="url" class="url" target="_blank">
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
.space-between {
  margin-top: 20px;
}
.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;
  flex-direction: column;
}

.error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;
  flex-direction: column;
  gap: 20px;
}

.source-wrap {
  display: flex;
  flex-direction: column;
}

.source {
  color: var(--grey-dark);
  font-size: var(--body-s);
  text-decoration: underline;
  text-underline-offset: 2px;
}

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
  color: var(--title);
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
  font-style: italic;
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
  word-break: break-all;
}

.link-word {
  font-weight: 700;
  display: inline;
}

.link-word:not(:last-child)::after {
  content: ", ";
}

.link-word a {
  color: var(--purple);
  text-decoration: none;
}

.h3-word {
  font-weight: 400;
  font-size: var(--heading-s);
  color: var(--grey-dark);
  display: inline;
  margin-right: 16px;
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
  display: inline;
  /* flex-direction: row; */
  /* gap: 3px; */
  color: var(--purple);
  margin-bottom: 0;
}

.synonyms-container,
.antonyms-container {
  display: inline;
  /* gap: 25px; */
  /* align-items: center; */
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

@media screen and (max-width: 768px) {
  .source-container {
    flex-direction: column;
    word-break: break-all;
    align-items: flex-start;
  }
}

@media screen and (max-width: 375px) {
  .url-container {
    flex-wrap: wrap;
  }

  .url {
    align-items: flex-start;
  }

  .play-icon {
    width: 48px;
    height: 48px;
  }
}
</style>
