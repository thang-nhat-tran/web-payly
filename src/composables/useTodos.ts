import type { Todo } from '@/types/todo.type'
import { ref } from 'vue'

export function useTodos() {
  const todos = ref<Array<Todo>>([])
  function createTodo(text: string) {
    todos.value.push({
      id: Date.now(),
      text,
      completed: false,
    })
  }
  return { todos, createTodo }
}
