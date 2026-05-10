<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  createTodo: (text: string) => void
}>()

const newTodoText = ref('')

function addTodo() {
  if (newTodoText.value.trim() !== '') {
    props.createTodo(newTodoText.value)
    newTodoText.value = ''
  }
}
</script>
<template>
  <div class="input-row">
    <input
      type="text"
      v-model="newTodoText"
      placeholder="Add a new todo"
      className="px-2 py-2 bg-surface-white border border-border-input rounded-4xl mr-2
             focus:border-brand-accent focus:outline-none
             transition-colors duration-200"
    />
    <button
      @click="addTodo"
      className="btn-pill bg-brand-accent text-surface-white border border-brand-accent"
    >
      Add
    </button>
  </div>
</template>
