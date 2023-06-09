import { createRouter, createWebHashHistory } from 'vue-router'
import { useTitle } from '@vueuse/core'
import canvasRoutes from './canvas-routes'

const routes = [
  {
    path: '/',
    redirect: '/a',

  },
  ...canvasRoutes
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
router.beforeEach((to, _, next) => {
  const title = useTitle()
  title.value = <string>to.name || ''
  next()
})

export default router