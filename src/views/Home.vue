<template>
  <header class="bg-white/25 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4 w-full">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex-shrink-0">
          <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>📝</span>
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mes Post-it
            </span>
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            Organisez vos idées en toute simplicité
          </p>
        </div>

        <div class="w-full sm:w-auto flex justify-end">
          <div class="relative w-full sm:w-80 md:w-96 mt-2 sm:mt-0">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Rechercher ..."
              aria-label="Rechercher"
              class="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-sm text-sm text-gray-700 placeholder-gray-400 shadow-lg hover:shadow-xl focus:outline-none focus:ring-1 focus:bg-white/95 transition-all duration-300 hover:bg-white/90"
            />
          </div>
        </div>
      </div>
    </div>
  </header>

  <main class="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">  
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center pb-12">
        <router-link to="/add" class="group">
          <button class="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium hover:cursor-pointer">
            <div class="p-1.5 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform duration-200">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            Nouveau post-it
          </button>
        </router-link>

        <button
          @click="handleDeleteAll"
          :disabled="store.posts.length === 0"
          :class="[
            'flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:cursor-pointer',
            store.posts.length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
          ]"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          Tout supprimer
        </button>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-gray-500 text-lg">Chargement des notes...</p>
      </div>

      <div v-else-if="store.posts.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="text-6xl mb-4">📝</div>
        <p class="text-gray-500 text-lg mb-2">Aucune note pour le moment</p>
        <p class="text-gray-400 text-sm">Créez votre première note en cliquant sur "Nouveau post-it"</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <PostCard
          v-for="post in displayedPosts"
          :key="post._id"
          :post="post"
          @delete="handleDeleteSingle"
        />
      </div>
    </div>

    <ConfirmDialog
      :show="showDeleteDialog"
      :title="deleteDialogTitle"
      message="Êtes-vous sûr(e) de vouloir effectuer cette action ?"
      confirm-text="Oui, sûr(e)"
      cancel-text="Non, retour"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { usePostStore } from "@/stores/post";
import PostCard from "@/components/PostCard.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";

const store = usePostStore();
const loading = ref(true);
const showDeleteDialog = ref(false);
const postToDelete = ref(null);
const deleteType = ref('single');

const deleteDialogTitle = computed(() => {
  return deleteType.value === 'all' ? 'Supprimer toutes les notes' : 'Supprimer la note';
});

const searchTerm = ref("");

const displayedPosts = computed(() => {
  if (!searchTerm.value) return store.posts;
  const q = searchTerm.value.toLowerCase().trim();
  return store.posts.filter(post => {
    const title = (post.title || "").toLowerCase().trim();
    const content = ((post.content && post.content[0]) || "").toLowerCase().trim();
    return title.includes(q) || content.includes(q);
  });
});

onMounted(async () => {
  try {
    await store.fetchPosts();
    if (store.dynamicFetch) {
      store.dynamicFetch();
    }
  } catch (error) {
    console.error("Erreur lors du chargement des posts:", error);
  } finally {
    loading.value = false;
  }
});

const handleDeleteSingle = (post) => {
  postToDelete.value = post;
  deleteType.value = 'single';
  showDeleteDialog.value = true;
};

const handleDeleteAll = () => {
  if (store.posts.length === 0) return;
  deleteType.value = 'all';
  showDeleteDialog.value = true;
};

const confirmDelete = async () => {
  try {
    if (deleteType.value === 'single' && postToDelete.value) {
      await store.deletePosts(postToDelete.value._id);
    } else if (deleteType.value === 'all') {
      for (const post of store.posts) {
        await store.deletePosts(post._id);
      }
    }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
  } finally {
    cancelDelete();
  }
};

const cancelDelete = () => {
  showDeleteDialog.value = false;
  postToDelete.value = null;
  deleteType.value = 'single';
};
</script>