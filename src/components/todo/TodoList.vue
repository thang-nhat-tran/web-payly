<script setup lang="ts">
import type { Todo } from '@/types/todo.type'

const { todos } = defineProps<{ todos: Array<Todo> }>()
</script>

<template>
  <ul v-if="todos.length > 0" class="todo-list">
    <li v-for="todo in todos" :key="todo.id">
      <span>{{ todo.text }}</span>
    </li>
  </ul>

  <p v-else>No todos yet. Add one above!</p>
</template>

<style scoped>
.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  padding: 10px;
}
</style>
