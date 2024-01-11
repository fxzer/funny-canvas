import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routeModules = import.meta.glob('../views/*/index.vue')
const canvasRoutes: RouteRecordRaw[] = 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => ({
  path: `/${letter}`,
  name: letter.toUpperCase(),
  component: routeModules[`../views/${letter}/index.vue`],
}))

const routes = [
  {
    path: '/',
    redirect: '/a',

  },
  ...canvasRoutes,
]
const router = createRouter({
  history: createWebHashHistory('/funny-canvas/'),
  routes,
})
router.beforeEach((to, _, next) => {
  const title = useTitle()
  title.value = `Funny Canvas - ${<string>to.name || ''}`
  next()
})

export default router
