import { createWebHistory, createRouter, RouteLocationNormalized } from 'vue-router'
import Waveform from '../components/Waveform.vue'
import Hello from '../components/Hello.vue'

const routes = [
    {
        path: "/",
        name: "Hello",
        component: Hello
    },
    {
        path: "/watch",
        name: "Waveform",
        component: Waveform,
        props: (route: RouteLocationNormalized) => ({
            videoPath: route.query.v,
            listeningMode: false
        })
    },
    {
        path: "/listen",
        name: "Listen",
        component: Waveform,
        props: {
            listeningMode: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;