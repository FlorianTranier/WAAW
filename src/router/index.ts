import { createWebHistory, createRouter, RouteLocationNormalized } from 'vue-router'
import Main from '../components/Main.vue'
import HomePage from '../components/HomePage.vue'

const routes = [
    {
        path: "/",
        name: "HomePage",
        component: HomePage
    },
    {
        path: "/watch",
        name: "Main",
        component: Main,
        props: (route: RouteLocationNormalized) => ({
            videoPath: route.query.v,
            listeningMode: false
        })
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;