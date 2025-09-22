<template>
  <div 
    v-if="show"
    class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm transition-all"
    @click="handleCancel"
  >
    <div 
      class="border bg-white rounded-lg shadow relative max-w-sm mx-4"
      @click.stop
    >
      <div class="p-8 text-center justify-center items-center">
        <div class="flex justify-center items-center">
          <svg class="w-20 h-20 text-red-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-900 mt-4 mb-2">
          {{ title }}
        </h3>
        
        <p class="text-lg font-normal text-gray-500 mb-6">
          {{ message }}
        </p>
        <br>  
        <div class="flex justify-center gap-4 mt-8">
          <button
            @click="handleConfirm"
            class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-4 py-2.5 text-center transition-colors hover:cursor-pointer"
          >
            {{ confirmText }}
          </button>
          
          <button
            @click="handleCancel"
            class="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-4 py-2.5 text-center transition-colors hover:cursor-pointer"
          >
            {{ cancelText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmer l\'action'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirmer'
  },
  cancelText: {
    type: String,
    default: 'Annuler'
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};
</script>