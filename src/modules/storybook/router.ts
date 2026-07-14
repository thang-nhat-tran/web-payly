import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/storybook', name: 'Storybook', component: () => import('./views/StorybookHomeView.vue') },
  { path: '/storybook/button', name: 'StorybookButton', component: () => import('./views/ButtonStoryView.vue') },
  { path: '/storybook/input', name: 'StorybookInput', component: () => import('./views/InputStoryView.vue') },
  { path: '/storybook/label', name: 'StorybookLabel', component: () => import('./views/LabelStoryView.vue') },
  {
    path: '/storybook/skeleton',
    name: 'StorybookSkeleton',
    component: () => import('./views/SkeletonStoryView.vue'),
  },
  {
    path: '/storybook/typography',
    name: 'StorybookTypography',
    component: () => import('./views/TypographyStoryView.vue'),
  },
  { path: '/storybook/menu', name: 'StorybookMenu', component: () => import('./views/MenuStoryView.vue') },
  {
    path: '/storybook/dropdown',
    name: 'StorybookDropdown',
    component: () => import('./views/DropdownStoryView.vue'),
  },
  {
    path: '/storybook/upload',
    name: 'StorybookUpload',
    component: () => import('./views/UploadStoryView.vue'),
  },
]

export default routes
