import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '@/components/Home.vue'
//import Social from '@/components/Social.vue'
import HelloWorld from '@/components/HelloWorld.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HelloWorld, // era social
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
