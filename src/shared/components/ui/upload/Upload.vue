<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { AlertCircle, ImagePlus, X } from 'lucide-vue-next'
import { cn } from '@/shared/utils/cn.util'
import Spinner from '../Spinner.vue'
import type { UploadItem, UploadProps } from './upload.type'

const props = withDefaults(defineProps<UploadProps>(), {
  accept: 'image/*',
  multiple: true,
  disabled: false,
})

const emit = defineEmits<{
  success: [item: UploadItem]
  error: [item: UploadItem]
}>()

const paths = defineModel<string[]>('paths', { default: () => [] })

const items = ref<UploadItem[]>([])
const inputRef = ref<HTMLInputElement>()

const canAddMore = computed(() => !props.maxFiles || items.value.length < props.maxFiles)

// Only image/* is wired up today; other accept patterns (e.g. 'application/pdf') can be
// passed in once this component grows a non-image preview (see UploadItem/previewUrl).
function matchesAccept(file: File): boolean {
  return props.accept
    .split(',')
    .map((pattern) => pattern.trim())
    .some((pattern) => (pattern.endsWith('/*') ? file.type.startsWith(pattern.slice(0, -1)) : file.type === pattern))
}

function openPicker() {
  if (props.disabled) return
  inputRef.value?.click()
}

function onInputChange(event: Event) {
  const input = event.target as HTMLInputElement
  addFiles(input.files)
  input.value = '' // allow re-selecting the same file right after removing it
}

function addFiles(fileList: FileList | null) {
  if (!fileList) return

  const remaining = props.maxFiles ? props.maxFiles - items.value.length : undefined
  const files = Array.from(fileList).slice(0, remaining)

  for (const file of files) {
    if (!matchesAccept(file)) continue
    if (props.maxSizeMB && file.size > props.maxSizeMB * 1024 * 1024) continue

    const item = reactive<UploadItem>({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'uploading',
      progress: 0,
    })
    items.value.push(item)
    upload(item)
  }
}

async function upload(item: UploadItem) {
  item.status = 'uploading'
  item.error = undefined

  try {
    item.path = await props.uploadFn(item.file, (percent) => (item.progress = percent))
    item.status = 'success'
    item.progress = 100
    paths.value = [...paths.value, item.path]
    emit('success', item)
  } catch (err) {
    item.status = 'error'
    item.error = err instanceof Error ? err.message : 'Tải lên thất bại'
    emit('error', item)
  }
}

function retry(item: UploadItem) {
  upload(item)
}

function removeItem(item: UploadItem) {
  URL.revokeObjectURL(item.previewUrl)
  items.value = items.value.filter((i) => i.id !== item.id)
  if (item.path) paths.value = paths.value.filter((path) => path !== item.path)
}

onBeforeUnmount(() => items.value.forEach((item) => URL.revokeObjectURL(item.previewUrl)))
</script>

<template>
  <div :class="cn('flex flex-wrap gap-sm', props.class)">
    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      @change="onInputChange"
    />

    <div
      v-for="item in items"
      :key="item.id"
      class="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border"
    >
      <img
        :src="item.previewUrl"
        class="h-full w-full object-cover"
        :class="item.status === 'error' && 'opacity-40'"
        alt=""
      />

      <div
        v-if="item.status === 'uploading'"
        class="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-bg-mask text-primary-foreground"
      >
        <Spinner size="1.4rem" />
        <span v-if="item.progress > 0" class="text-xs">{{ item.progress }}%</span>
      </div>

      <div
        v-if="item.status === 'error'"
        :title="item.error"
        class="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-bg-mask p-1 text-center text-primary-foreground"
      >
        <AlertCircle :size="16" />
        <button type="button" class="text-xs underline" @click="retry(item)">Thử lại</button>
      </div>

      <button
        type="button"
        aria-label="Xóa ảnh"
        class="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-round bg-bg-mask text-primary-foreground"
        @click="removeItem(item)"
      >
        <X :size="12" :stroke-width="2" />
      </button>
    </div>

    <button
      v-if="canAddMore"
      type="button"
      :disabled="disabled"
      class="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-text-secondary hover:bg-bg-active disabled:cursor-not-allowed disabled:opacity-40"
      @click="openPicker"
    >
      <slot name="trigger">
        <ImagePlus :size="20" />
      </slot>
    </button>
  </div>
</template>
