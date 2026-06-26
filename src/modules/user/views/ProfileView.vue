<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import { authApi } from '@/modules/auth/api/auth.api'
import AppHeader from '@/shared/components/app/AppHeader.vue'
import UserAvatar from '@/shared/components/ui/Avatar.vue'
import { Button } from '@/shared/components/ui/button'
import { ArrowLeft, LogOut, Mail, CalendarDays, User } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const router = useRouter()
const auth = useAuthStore()
const signingOut = ref(false)

async function handleSignOut() {
  signingOut.value = true
  try {
    await authApi.signOut()
    router.push('/sign-in')
  } catch (error) {
    toast.error('Đăng xuất thất bại', { description: (error as Error).message })
  } finally {
    signingOut.value = false
  }
}

function formatDate(dateString: string | null) {
  if (!dateString) return '—'
  return new Intl.DateTimeFormat('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }).format(
    new Date(dateString),
  )
}
</script>

<template>
  <div class="min-h-screen">
    <AppHeader class="px-sm">
      <template #left>
        <button class="flex items-center gap-xs" @click="router.back()">
          <ArrowLeft :size="20" />
        </button>
      </template>
      <template #center>
        <h3>Tài khoản</h3>
      </template>
    </AppHeader>

    <main class="px-sm py-md">
      <div class="flex flex-col gap-md rounded-md bg-bg-surface p-md shadow-md">
        <!-- Avatar & name -->
        <div class="flex flex-col items-center gap-sm border-b border-text-disabled pb-md">
          <UserAvatar :src="auth.profile?.avatarUrl" :name="auth.profile?.fullName ?? auth.user?.email" size="2xl" />
          <div class="text-center">
            <p class="text-md font-semibold text-text-main">{{ auth.profile?.fullName ?? '—' }}</p>
            <p class="text-sm text-text-muted">{{ auth.profile?.email }}</p>
          </div>
        </div>

        <!-- Info rows -->
        <div class="flex flex-col">
          <div class="flex items-center gap-sm border-b border-text-disabled py-sm">
            <span
              class="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-bg-soft text-text-muted"
            >
              <User :size="16" />
            </span>
            <div class="flex min-w-0 flex-col">
              <span class="text-xs text-text-muted">Tên hiển thị</span>
              <span class="truncate text-sm font-medium text-text-main">{{ auth.profile?.fullName ?? '—' }}</span>
            </div>
          </div>

          <div class="flex items-center gap-sm border-b border-text-disabled py-sm">
            <span
              class="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-bg-soft text-text-muted"
            >
              <Mail :size="16" />
            </span>
            <div class="flex min-w-0 flex-col">
              <span class="text-xs text-text-muted">Email</span>
              <span class="truncate text-sm font-medium text-text-main">{{ auth.profile?.email }}</span>
            </div>
          </div>

          <div class="flex items-center gap-sm py-sm">
            <span
              class="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-bg-soft text-text-muted"
            >
              <CalendarDays :size="16" />
            </span>
            <div class="flex min-w-0 flex-col">
              <span class="text-xs text-text-muted">Ngày tham gia</span>
              <span class="truncate text-sm font-medium text-text-main">{{
                formatDate(auth.profile?.createdAt ?? null)
              }}</span>
            </div>
          </div>
        </div>

        <!-- Sign out -->
        <Button variant="destructive" class="w-full" :loading="signingOut" @click="handleSignOut">
          <LogOut :size="16" />
          Đăng xuất
        </Button>
      </div>
    </main>
  </div>
</template>
