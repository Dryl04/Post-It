<template>
  <div class="relative bg-[url('../assets/images/bg.jpg')] bg-cover bg-center flex justify-center items-center bg-gradient-to-r from-blue-200 to-purple-300 min-h-screen p-2 sm:p-4 md:p-6 lg:p-8">
    <div class="flex bg-white justify-center items-center rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full mx-2 sm:mx-4 transform transition-all duration-300 scale-100 opacity-100 text-gray-900">
      <div v-if="loading" class="text-center py-8 sm:py-12 md:py-16 px-4">
        <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-blue-500 mb-4 mx-auto"></div>
        <p class="text-gray-500 text-sm sm:text-base">Chargement de la note...</p>
      </div>

      <div v-else-if="post" class="w-full p-4 sm:p-6 md:p-8">
        <div class="flex flex-col sm:flex-row items-start justify-between mb-6 sm:mb-8 border-gray-100 pb-4 sm:pb-6 gap-4 sm:gap-0">
          <div class="flex-1 w-full sm:w-auto">
            <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight break-words">
              {{ post.title }}
            </h1>
            <div class="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
              <span class="flex items-center gap-1">
                <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H6a1 1 0 110-2V4z" clip-rule="evenodd" />
                </svg>
                {{ post.content[0].length }} caractères
              </span>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto sm:ml-6">
            <router-link :to="`/edit/${post._id}`" class="w-full sm:w-auto">
              <button class="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 font-medium hover:cursor-pointer w-full sm:w-auto text-sm sm:text-base">
                <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Modifier
              </button>
            </router-link>
            
            <button 
              @click="handleDelete"
              class="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 font-medium hover:cursor-pointer w-full sm:w-auto text-sm sm:text-base"
            >
              <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Supprimer
            </button>
          </div>
        </div>

        <div class="space-y-4 sm:space-y-6">
          <div class="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-100">
            <div class="prose max-w-none">
              <p class="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base break-words">{{ post.content[0] }}</p>
            </div>
          </div>

        </div>

        <div class="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <button 
            @click="goBack"
            class="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium hover:cursor-pointer text-sm sm:text-base"
          >
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Retour
          </button>
          
          <div class="text-xs text-gray-500 text-left sm:text-right">
            Créé le : {{ formattedDate }}
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 sm:py-12 md:py-16 px-4">
        <div class="text-red-500 text-4xl sm:text-5xl md:text-6xl mb-4">❌</div>
        <br>
        <h2 class="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Note introuvable</h2>
        <p class="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Cette note n'existe pas ou a été supprimée.</p>
        <br>
        <button 
          @click="goBack"
          class="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm sm:text-base hover:cursor-pointer"
        >
          Retour
        </button>
      </div>
    </div>

    <ConfirmDialog
      :show="showDeleteDialog"
      message="Êtes-vous sûr(e) de vouloir supprimer cette note ?"
      confirm-text="Oui, sûr(e)"
      cancel-text="Non, retour"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePostStore } from "@/stores/post";
import ConfirmDialog from "@/components/ConfirmDialog.vue";

const store = usePostStore();
const route = useRoute();
const router = useRouter();


const id = route.params.id;
const loading = ref(true);
const showDeleteDialog = ref(false);



const post = computed(() => store.selectedPost);

const formattedDate = computed(() => {
  if (!post.value || !post.value.createdAt) return "";
    const rawDate = post.value.createdAt;
    const date = new Date(rawDate);

    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Africa/Porto-Novo"
    };
    let str = new Intl.DateTimeFormat("fr-FR", options).format(date);
    return str
  }
)
    

onMounted(async () => {
  try {
    await store.fetchPost(id);
    if (!store.selectedPost) {
      console.error("Note non trouvée");
    }
  } catch (error) {
    console.error("Erreur lors du chargement de la note:", error);
  } finally {
    loading.value = false;
  }
});

const goBack = () => {
  router.push("/");
};

const handleDelete = () => {
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  try {
    await store.deletePosts(post.value._id);
    router.push("/");
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
  } finally {
    showDeleteDialog.value = false;
  }
};

const cancelDelete = () => {
  showDeleteDialog.value = false;
};
</script>