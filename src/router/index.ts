import { createRouter, createWebHistory } from 'vue-router'
import { useTitle } from '@vueuse/core'
import canvasRoutes from './canvas-routes'

const routes = [
  {
    path: '/',
    redirect: '/k',

  },
  ...canvasRoutes
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach((to, _, next) => {
  const title = useTitle()
  title.value = <string>to.name || ''
  next()
})

export default router