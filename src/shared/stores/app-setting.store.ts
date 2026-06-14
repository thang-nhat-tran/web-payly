import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SupportedLanguage, SupportedLocale, SupportedCurrency } from '@/shared/types/app-setting.type'

export const useAppSettingStore = defineStore('app-setting', () => {
  const language = ref<SupportedLanguage>('vi')
  const locale = ref<SupportedLocale>('vi-VN')
  const currency = ref<SupportedCurrency>('VND')

  function setLanguage(value: SupportedLanguage) {
    language.value = value
  }

  function setLocale(value: SupportedLocale) {
    locale.value = value
  }

  function setCurrency(value: SupportedCurrency) {
    currency.value = value
  }

  return { language, locale, currency, setLanguage, setLocale, setCurrency }
})
