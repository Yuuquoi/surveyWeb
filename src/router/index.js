import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    // Main
      path: '/',
      name: 'main',
      component: ()=> import('../views/Main.vue'),
      children: [{
        path: '/',
        name: 'home',
        component: ()=> import('../components/main/Home.vue')
      },
      {
        path: '/search/',
        name: 'search',
        component: () => import('../components/main/Search.vue')
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue')
      },
      {
        path: '/login/signin',
        name: 'signIn',
        component: () => import('../components/main/SignIn.vue')
      },      
      {
        path: '/member',
        name: 'Member',
        component: () => import('../components/main/Member.vue')
      },      
      ]
    },
    // Survey
    {
      path: '/reply/:surveyNo',
      name: 'Reply',
      props: true,
      component: ()=> import('../views/SurveyReply.vue')
    },
    {
      path: '/create/:ac',
      name: 'Create',
      props: true,
      component: ()=> import('../views/SurveyCreate.vue')
    },
    {
      path: '/edit/:surveyNo',
      name: 'Edit',
      props: true,
      component: ()=> import('../views/SurveyUpdate.vue')
    },
    {
      path: '/result/:surveyNo',
      name: 'Result',
      props: true,
      component: ()=> import('../views/SurveyResult.vue')
    },
    {
      path: '/statistics/:surveyNo',
      name: 'Statistics',
      props: true,
      component: ()=> import('../views/SurveyStatictis.vue')
    },
    // 404
    {
      path: '/:pathMatch(.*)*',
      name: '404NotFound',
      component:() => import('../views/404NotFound.vue'),
    }
  ]
})

export default router
