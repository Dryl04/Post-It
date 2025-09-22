<template>
  <div class="relative bg-[url('../assets/images/bg.jpg')] bg-cover bg-center flex justify-center items-center bg-gradient-to-r from-blue-200 to-purple-300 min-h-screen p-4">
    <div class="flex bg-white justify-center items-center rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all duration-300 scale-100 opacity-100 text-gray-600">
      <fieldset class="flex items-center justify-center py-9 border-b border-gray-100 w-full">
        <form @submit.prevent="handleAddPost" class="space-y-6 w-full max-w-xl mx-auto px-8">
          <div class="text-center">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Créer une note</h1>
            <p class="text-gray-500 text-sm">Organisez vos idées en quelques clics</p>
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
              :disabled="loading"
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
              :disabled="loading"
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
              :disabled="loading"
              class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              Annuler
            </button>
            
            <button
              type="submit"
              :disabled="!isFormValid || loading"
              class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 hover:cursor-pointer"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création...
              </span>
              <span v-else>Créer</span>
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
import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { usePostStore } from "@/stores/post";
import ErrorDialog from "@/components/ErrorDialog.vue";

const router = useRouter();
const store = usePostStore();

const loading = ref(false);
const showErrorDialog = ref(false);

const form = reactive({
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
  form.title = "";
  form.content = "";
  errors.title = null;
  errors.content = null;
};

const handleAddPost = async () => {
  if (!validateForm()) {
    return;
  }
  
  try {
    loading.value = true;
    
    const postData = {
      title: form.title.trim(),
      content: [form.content.trim()]
    };
    
    await store.addPost(postData);
    
    resetForm();
    router.push("/");
    
  } catch (error) {
    console.error("Erreur lors de la création de la note:", error);
    
    let errorMessage = "Une erreur inattendue s'est produite. Veuillez réessayer.";
    
    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = "Données invalides. Vérifiez votre titre et votre contenu.";
      } else if (error.response.status === 500) {
        errorMessage = "Erreur du serveur. Veuillez réessayer plus tard.";
      }
    } else if (error.request) {
      errorMessage = "Impossible de contacter le serveur. Vérifiez votre connexion internet.";
    }
    
    showError("Erreur lors de la création", errorMessage);
    
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  if (form.title.trim() || form.content.trim()) {
    if (confirm("Êtes-vous sûr de vouloir annuler ? Vos modifications seront perdues.")) {
      resetForm();
      router.push("/");
    }
  } else {
    router.push("/");
  }
};
</script>