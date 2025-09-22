<template>
  <div 
    v-if="show"
    class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm transition-all"
    @click="handleClose"
  >
    <div 
      class="bg-white max-w-md mx-4 p-6 rounded-lg shadow-xl border border-gray-200"
      @click.stop
    >
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ title }}
        </h3>
        
        <p class="text-gray-600 mb-6 text-sm leading-relaxed">
          {{ message }}
        </p>
        
        <button
          @click="handleClose"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-colors"
        >
          Compris
        </button>
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
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};
</script>