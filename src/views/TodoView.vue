<script setup lang="ts">
import { useTodos } from '@/composables/useTodos'
import AddTodoBar from '@/components/todo/AddTodoBar.vue'
import TodoHeader from '@/components/todo/TodoHeader.vue'
import TodoList from '@/components/todo/TodoList.vue'

const { createTodo, todos } = useTodos()
</script>

<template>
  <TodoHeader />
  <AddTodoBar :createTodo="createTodo" />
  <TodoList :todos="todos" />
</template>
