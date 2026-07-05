import type { Component, HTMLAttributes } from 'vue'

export type MenuMode = 'vertical' | 'horizontal'
export type MenuVariant = 'flat' | 'elevated'
export type Item = MenuItem

export type MenuItem = {
  key: string
  label: string
  icon?: Component
  disabled?: boolean
  danger?: boolean
}

export type MenuProps = {
  items: Item[]
  variant?: MenuVariant
  defaultSelectedKeys?: string[]
  mode?: MenuMode
  selectable?: boolean
  multiple?: boolean
  class?: HTMLAttributes['class']
}

export type MenuItemProps = {
  item: Item
  variant?: MenuVariant
  selected?: boolean
  class?: HTMLAttributes['class']
}
