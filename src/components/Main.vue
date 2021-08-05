<template>
    <main class="text-center p-4 mx-0">
        <Loader v-if="loading" />
        <Infos id="infos" v-show="!loading && !hideInfos" :audioElement="audioRef" :audioService="audioService" />
        <Controls v-if="hideBtn && !loading" id="controls" :audioElement="audioRef" :audioContext="audioCtx" />
        <button v-if="!hideBtn && !loading" @click="playAudio" id="play-btn">
            <font-awesome-icon icon="play" />
        </button>
        <div id="video-wrapper" v-show="!loading && !hideVideo">
            <video
                crossorigin="anonymous"
                id="audio"
                ref="audioRef"
                :class="{ blur: isBlurred }"
            />
        </div>
        <component :is="template" :analyser="analyser" :render="render">
        </component>
    </main>
</template>

<script lang="ts">
import { computed, onMounted, ref } from 'vue'
import AudioService from '../services/audio/AudioService'
import Controls from './Controls.vue'
import Loader from './Loader.vue'
import Infos from './Infos.vue'
import { templatesComponents } from './templates/templates'
import { useStore } from 'vuex'
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        videoPath: String
    },
    components: {
        Controls, Loader, Infos, ...templatesComponents
    },
    setup(props) {
        const store = useStore()

        const hideBtn = ref(true)
        const render = ref(false)
        const audioRef = ref<HTMLVideoElement | undefined>(undefined)
        const loading = ref(true)
        const analyser = ref<AnalyserNode | undefined>(undefined)

        const currentTime = computed(() => audioRef.value?.currentTime)
        const audioService = new AudioService(props.videoPath || '')
        let audioCtx: AudioContext = new AudioContext()

        function initAnalyser(src: MediaElementAudioSourceNode | MediaStreamAudioSourceNode) {
            analyser.value = audioCtx.createAnalyser();
            src.connect(analyser.value);
            analyser.value.connect(audioCtx.destination);

            analyser.value.fftSize = 32768;
            analyser.value.minDecibels = -80;
            analyser.value.maxDecibels = -10;
            analyser.value.smoothingTimeConstant = 0.0

            if (!audioRef.value) throw Error('Failed to load audio reference !')
            audioRef.value.volume = 0.5
        }

        function initAudioProcessing() {
            if (!audioRef.value) return
            
            audioRef.value.src = audioService.getAudioSource();
            const src = audioCtx.createMediaElementSource(audioRef.value);
            initAnalyser(src)
        }

        function playAudio() {
            audioRef.value?.play().catch((e) => console.error(e))
            audioCtx.resume()
            hideBtn.value = true;
        }

        onMounted(() => {
            initAudioProcessing()
            audioRef.value?.addEventListener('loadeddata', async () => {
                audioRef.value?.play()
                .then(() => hideBtn.value = true)
                .catch(e => hideBtn.value = false);
                loading.value = false;
                render.value = true;
                await audioService.updateVideoInfos()
            })

            audioRef.value?.addEventListener('ended', async () => {
                const { nextVideo } = await audioService.getAudioInfos()
                audioService.videoId = nextVideo
                initAudioProcessing()
                await audioService.updateVideoInfos()
            })
        })

        return {
            hideBtn,
            playAudio,
            audioRef,
            audioCtx,
            currentTime,
            analyser,
            render,
            loading,
            hideInfos: computed(() => store.state.settings.infosHidden),
            hideVideo: computed(() => store.state.settings.videoHidden),
            isBlurred: computed(() => store.state.settings.videoBlurred),
            template: computed(() => store.state.settings.template),
            audioService,
        }
    },
})
</script>

<style scoped>
    #play-btn {
        position: absolute;
        left: 50%;
        top: 10%;
        width: 20rem;
        height: 5rem;
        background: black;
        color: white;
        font-size: 2rem;
        border: solid 0.1rem white;
        transform: translate(-50%, -50%);
        z-index: 10;
    }

    #controls {
        position: absolute;
        right: 0%;
        top: 0%;
        width: 15vw;
        height: 100vh;
        color: white;
        font-size: 2rem;
        z-index: 10;
    }

    #infos {
        position: absolute;
        z-index: 10;
        height: 7rem;
        bottom: 2rem;
    }

    #video-wrapper {
        z-index: -1;
        display: flex;
        justify-content: center;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: black;
    }

    .blur {
        filter: blur(10px);
        -webkit-filter: blur(10px);
    }

    main {
        background-color: black;
    }
</style>