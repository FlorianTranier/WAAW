<template>
    <main class="text-center p-4 mx-0">
        <Loader v-if="loading" />
        <Infos id="infos" v-show="!loading && !hideInfos" :audioElement="audioRef" :audioService="audioService" />
        <Controls v-if="hideBtn && !loading" id="controls" :audioElement="audioRef" :audioContext="audioCtx" />
        <button v-if="!hideBtn && !loading" @click="playAudio" id="play-btn">
            <font-awesome-icon icon="play" />
        </button>
        <audio
            controls
            crossorigin="anonymous"
            id="audio"
            ref="audioRef"
        />
        <Waveform :analyser="analyser" :render="render" />
    </main>
</template>

<script lang="ts">
import { computed, onMounted, ref } from 'vue'
import AudioService from '../services/audio/AudioService'
import Controls from './Controls.vue'
import Loader from './Loader.vue'
import Infos from './Infos.vue'
import Waveform from './Waveform.vue'
import { useStore } from 'vuex'
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        videoPath: String
    },
    components: {
        Controls, Loader, Infos, Waveform
    },
    setup(props) {
        const store = useStore()

        const hideBtn = ref(true)
        const render = ref(false)
        const audioRef = ref<HTMLAudioElement | undefined>(undefined)
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
            audioRef.value?.addEventListener('loadeddata', () => {
                audioRef.value?.play()
                .then(() => hideBtn.value = true)
                .catch(e => hideBtn.value = false);
                loading.value = false;
                render.value = true;
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
            audioService
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
        left: 50%;
        top: 10%;
        width: 40vw;
        height: 5vh;
        background: black;
        color: white;
        font-size: 2rem;
        transform: translate(-50%, -50%);
        z-index: 10;
    }

    #infos {
        position: absolute;
        z-index: 10;
        height: 7rem;
        bottom: 2rem;
    }
</style>