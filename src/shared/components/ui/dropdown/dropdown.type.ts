import type { Component, HTMLAttributes } from 'vue'
import type { ButtonSize } from '../Button.vue'

export type DropdownOption = {
  key: string
  label: string
  icon?: Component
  disabled?: boolean
}

export type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
export type DropdownSize = ButtonSize

export type DropdownProps = {
  options: DropdownOption[]
  placement?: DropdownPlacement
  size?: DropdownSize
  disabled?: boolean
  class?: HTMLAttributes['class']
}
