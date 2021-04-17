import { createWebHistory, createRouter } from 'vue-router'
import Waveform from '../components/Waveform.vue'
import Hello from '../components/Hello.vue'

const routes = [
    {
        path: "/",
        name: "Hello",
        component: Hello
    },
    {
        path: "/:videoUrl",
        name: "Waveform",
        component: Waveform
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;