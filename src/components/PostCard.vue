<template>
  <div 
    class="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-clip"
    @click="handleCardClick"
  >
    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400"></div>

    <div class="space-y-4">
      <h3 class="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
        {{ post.title }}
      </h3>

      <div class="text-gray-600 text-sm leading-relaxed line-clamp-4">
        {{ post.content[0] }}
      </div>

      <div class="flex items-center justify-between pt-2 border-t border-gray-50">
        <span class="text-xs text-gray-400 font-medium">
          {{ post.content[0].length }} caractères
        </span>

        <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <router-link :to="`/edit/${post._id}`">
            <button 
              @click.stop
              class="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </router-link>
          
          <button
            @click.stop="handleDelete"
            class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['delete']);

const handleCardClick = () => {
  router.push(`/details/${props.post._id}`);
};

const handleDelete = () => {
  emit('delete', props.post);
};
</script>