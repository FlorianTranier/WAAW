<template>
    <main class="text-center p-4 mx-0">
        <Infos id="infos" v-show="!loading && !hideInfos" :audioElement="audioRef" />
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
        <canvas ref="canvasElement" id="canvas" />
    </main>
    <Loader v-if="loading" />
</template>

<script lang="ts">
import { computed, onMounted, ref } from 'vue'
import AudioService from '../services/audio/AudioService'
import Controls from './Controls.vue'
import Loader from './Loader.vue'
import Infos from './Infos.vue'
import { useStore } from 'vuex'

export default {
    components: {
        Controls, Loader, Infos
    },
    setup() {
        const store = useStore()

        const hideBtn = ref(true)
        const audioRef = ref<HTMLAudioElement | null>(null)
        const loading = ref(true)

        const currentTime = computed(() => audioRef.value?.currentTime)
        const audioService = new AudioService()
        let audioCtx: AudioContext = new AudioContext(),
            analyser: AnalyserNode,
            dataArray: Uint8Array,
            canvasCtx: CanvasRenderingContext2D,
            canvasElement: HTMLCanvasElement, 
            barWidth: number,
            barHeight: number,
            coef: number

        function initAudioProcessing() {
            if (!audioRef.value) return

            audioRef.value.src = audioService.getAudioSource();
            audioRef.value.volume = 0.5

            const src = audioCtx.createMediaElementSource(audioRef.value);
            analyser = audioCtx.createAnalyser();

            src.connect(analyser);
            analyser.connect(audioCtx.destination);

            analyser.fftSize = 32768;
            analyser.minDecibels = -80;
            analyser.maxDecibels = -10;
            analyser.smoothingTimeConstant = 0.0

            const bufferLength = analyser.frequencyBinCount;

            dataArray = new Uint8Array(bufferLength);

            barWidth = (canvasElement.width / bufferLength) * 52;

            coef = canvasElement.width <= 1920 ? 1.04 : 1.03
        }

        function initCanvas() {
            canvasElement = <HTMLCanvasElement>document.getElementById('canvas')
            canvasElement.width = window.innerWidth;
            canvasElement.height = window.innerHeight;
            canvasCtx = <CanvasRenderingContext2D>canvasElement.getContext("2d");
            canvasCtx.fillStyle = "black";
            canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        }

        function renderWaveform() {
            requestAnimationFrame(renderWaveform);
            
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            let x = 0;

            analyser.getByteFrequencyData(dataArray);

            canvasCtx.fillStyle = "black";
            canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

            for (let [i, j] = [40, 41]; i < dataArray.length; i = j) {

                j *= coef

                const sum = dataArray.slice(i, j).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                const mean = sum / (j - i)

                barHeight = mean ** (1.2 + i / 10000) + 1;

                canvasCtx.fillStyle = "white";
                canvasCtx.fillRect(x, (canvasElement.height - barHeight) / 2, barWidth, barHeight);

                x += barWidth + 10;
            }
        }

        function playAudio() {
            audioRef.value?.play().catch((e) => console.error(e))
            audioCtx.resume()
            hideBtn.value = true;
        }

        onMounted(() => {
            initCanvas()
            initAudioProcessing()
            audioRef.value?.addEventListener('loadeddata', () => {
                audioRef.value?.play()
                .then(() => hideBtn.value = true)
                .catch(e => hideBtn.value = false);
                loading.value = false;
                renderWaveform();
            })
        })

        return {
            hideBtn,
            playAudio,
            audioRef,
            audioCtx,
            currentTime,
            loading,
            hideInfos: computed(() => store.state.settings.infosHidden)
        }
    },
}
</script>

<style scoped>

    #canvas {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

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