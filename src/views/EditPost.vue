<template>
  <div class="relative bg-[url('../assets/images/bg.jpg')] bg-cover bg-center flex justify-center items-center bg-gradient-to-r from-blue-200 to-purple-300 min-h-screen p-4">
    <div class="flex bg-white justify-center items-center rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all duration-300 scale-100 opacity-100 text-gray-600">
      <fieldset class="flex items-center justify-center py-9 border-b border-gray-100 w-full">
        
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4 mx-auto"></div>
          <p class="text-gray-500">Chargement de la note...</p>
        </div>

        <form v-else @submit.prevent="handleUpdatePost" class="space-y-6 w-full max-w-xl mx-auto px-8">
          <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Modifier la note</h1>
            <p class="text-gray-500 text-sm">Apportez vos modifications</p>
          </div>
          
          <div class="space-y-2">
            <label for="title" class="block text-sm font-medium text-gray-700">Titre</label>
            <input
              id="title"
              type="text"
              v-model="form.title"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-150 outline-none text-sm text-gray-900',
                errors.title ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              ]"
              placeholder="Donnez un titre à votre note..."
              :disabled="updating"
              @input="clearError('title')"
            />
            <div v-if="errors.title" class="text-red-600 text-xs mt-1">
              {{ errors.title }}
            </div>
          </div>
          
          <div class="space-y-2">
            <label for="content" class="block text-sm font-medium text-gray-700">Contenu</label>
            <textarea
              id="content"
              v-model="form.content"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-150 outline-none resize-none text-sm h-32 text-gray-900',
                errors.content ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              ]"
              placeholder="Écrivez le contenu de votre note..."
              :disabled="updating"
              @input="clearError('content')"
            ></textarea>
            <div class="flex justify-between items-center">
              <div v-if="errors.content" class="text-red-600 text-xs">
                {{ errors.content }}
              </div>
              <div class="text-xs text-gray-500 ml-auto">
                {{ form.content.length }} caractères
              </div>
            </div>
          </div>
          
          <div class="flex gap-30 pt-4">
            <button
              type="button"
              @click="handleCancel"
              :disabled="updating"
              class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              Annuler
            </button>
            
            <button
              type="submit"
              :disabled="!isFormValid || updating || !hasChanges"
              class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 hover:cursor-pointer"
            >
              <span v-if="updating" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Modification...
              </span>
              <span v-else>Modifier</span>
            </button>
          </div>
        </form>
      </fieldset>
    </div>

    <ErrorDialog
      :show="showErrorDialog"
      :title="errorDialog.title"
      :message="errorDialog.message"
      @close="closeErrorDialog"
    />
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePostStore } from "@/stores/post";
import ErrorDialog from "@/components/ErrorDialog.vue";

const route = useRoute();
const router = useRouter();
const store = usePostStore();

const id = route.params.id;
const loading = ref(true);
const updating = ref(false);
const showErrorDialog = ref(false);

const form = reactive({
  title: "",
  content: ""
});

const originalData = reactive({
  title: "",
  content: ""
});

const errors = reactive({
  title: null,
  content: null
});

const errorDialog = reactive({
  title: "",
  message: ""
});

const isFormValid = computed(() => {
  return form.title.trim().length > 0 && 
         form.content.trim().length > 0 && 
         form.title.trim().length <= 100 &&
         form.content.trim().length <= 3000;
});

const hasChanges = computed(() => {
  return form.title.trim() !== originalData.title.trim() || 
         form.content.trim() !== originalData.content.trim();
});

onMounted(async () => {
  try {
    await store.fetchPost(id);
    
    if (store.selectedPost) {
      const title = store.selectedPost.title || "";
      const content = Array.isArray(store.selectedPost.content) 
        ? store.selectedPost.content[0] || ""
        : store.selectedPost.content || "";
      
      form.title = title;
      form.content = content;
      originalData.title = title;
      originalData.content = content;
    } else {
      showError("Note introuvable", "La note que vous essayez de modifier n'existe pas ou a été supprimée.");
      setTimeout(() => router.push("/"), 2000);
    }
  } catch (error) {
    console.error("Erreur lors du chargement de la note:", error);
    showError("Erreur de chargement", "Impossible de charger la note. Veuillez réessayer.");
  } finally {
    loading.value = false;
  }
});

const validateForm = () => {
  let isValid = true;
  
  errors.title = null;
  errors.content = null;
  
  const trimmedTitle = form.title.trim();
  const trimmedContent = form.content.trim();
  
  if (!trimmedTitle) {
    errors.title = "Le titre est requis";
    isValid = false;
  } else if (trimmedTitle.length < 2) {
    errors.title = "Le titre doit contenir au moins 2 caractères";
    isValid = false;
  } else if (trimmedTitle.length > 100) {
    errors.title = "Le titre ne peut pas dépasser 100 caractères";
    isValid = false;
  }
  
  if (!trimmedContent) {
    errors.content = "Le contenu est requis";
    isValid = false;
  } else if (trimmedContent.length < 2) {
    errors.content = "Le contenu doit contenir au moins 2 caractères";
    isValid = false;
  } else if (trimmedContent.length > 3000) {
    errors.content = "Le contenu ne peut pas dépasser 3000 caractères";
    isValid = false;
  }
  
  return isValid;
};

const clearError = (field) => {
  if (errors[field]) {
    errors[field] = null;
  }
};

const showError = (title, message) => {
  errorDialog.title = title;
  errorDialog.message = message;
  showErrorDialog.value = true;
};

const closeErrorDialog = () => {
  showErrorDialog.value = false;
  errorDialog.title = "";
  errorDialog.message = "";
};

const resetForm = () => {
  form.title = originalData.title;
  form.content = originalData.content;
  errors.title = null;
  errors.content = null;
};

const handleUpdatePost = async () => {
  if (!validateForm()) {
    return;
  }
  
  if (!hasChanges.value) {
    router.push("/");
    return;
  }
  
  try {
    updating.value = true;
    
    const postData = {
      title: form.title.trim(),
      content: [form.content.trim()]
    };
    
    await store.updatePost(id, postData);
    router.push("/");
    
  } catch (error) {
    console.error("Erreur lors de la modification de la note:", error);
    
    let errorMessage = "Une erreur inattendue s'est produite. Veuillez réessayer.";
    
    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = "Données invalides. Vérifiez votre titre et votre contenu.";
      } else if (error.response.status === 404) {
        errorMessage = "La note que vous essayez de modifier n'existe plus.";
      } else if (error.response.status === 500) {
        errorMessage = "Erreur du serveur. Veuillez réessayer plus tard.";
      }
    } else if (error.request) {
      errorMessage = "Impossible de contacter le serveur. Vérifiez votre connexion internet.";
    }
    
    showError("Erreur lors de la modification", errorMessage);
    
  } finally {
    updating.value = false;
  }
};

const handleCancel = () => {
  if (hasChanges.value) {
    if (confirm("Êtes-vous sûr de vouloir annuler ? Vos modifications seront perdues.")) {
      router.push("/");
    }
  } else {
    router.push("/");
  }
};
</script>