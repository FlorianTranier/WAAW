<template>
    <main class="text-center p-4 mx-0">
        <Controls v-if="hideBtn" id="controls" :audioElement="audioRef" :audioContext="audioCtx" />
        <button v-if="!hideBtn" @click="playAudio" id="play-btn">
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
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import Controls from './Controls.vue'

export default {
    components: {
        Controls
    },
    setup() {

        const hideBtn = ref(true);
        const audioRef = ref(null)
        const currentTime = computed(() => audioRef.value.currentTime)
        let audioCtx;

        function process() {
            let audioElement = audioRef.value
            
            let canvasElement = document.getElementById('canvas');
            const videoId = window.location.search.split("?v=")[1] || window.location.pathname.substr(1);
            audioElement.src = `https://boiling-tundra-34239.herokuapp.com?videoId=${videoId}`;
            audioElement.volume = 0.5
            canvasElement.width = window.innerWidth;
            canvasElement.height = window.innerHeight;
            const ctx = canvasElement.getContext("2d");

            audioCtx = new AudioContext();
            const src = audioCtx.createMediaElementSource(audioElement);
            const analyser = audioCtx.createAnalyser();

            src.connect(analyser);
            analyser.connect(audioCtx.destination);

            analyser.fftSize = 32768;
            analyser.minDecibels = -80;
            analyser.maxDecibels = -10;
            analyser.smoothingTimeConstant = 0.0

            const bufferLength = analyser.frequencyBinCount;

            const dataArray = new Uint8Array(bufferLength);

            const WIDTH = canvasElement.width;
            const HEIGHT = canvasElement.height;

            const barWidth = (WIDTH / bufferLength) * 52;

            let barHeight;
            let x = 0;

            let coef = WIDTH <= 1920 ? 1.04 : 1.03

            function renderFrame() {
                requestAnimationFrame(renderFrame);
                
                ctx.clearRect(0, 0, WIDTH, HEIGHT);
                x = 0;

                analyser.getByteFrequencyData(dataArray);

                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, WIDTH, HEIGHT);

                for (let [i, j] = [40, 41]; i < dataArray.length; i = j) {

                    j *= coef

                    const sum = dataArray.slice(i, j).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                    const mean = sum / (j - i)

                    barHeight = mean ** (1.2 + i / 10000) + 1;

                    ctx.fillStyle = "white";
                    ctx.fillRect(x, (HEIGHT - barHeight) / 2, barWidth, barHeight);
                    //ctx.fillText(barHeight, x, (HEIGHT - barHeight) / 2)
                    x += barWidth + 10;
                }
            }

            audioElement.play()
                .then(() => hideBtn.value = true)
                .catch(e => hideBtn.value = false);
            
            renderFrame();
        }

        function playAudio() {
            let audioElement = document.getElementById('audio');
            audioElement.play().catch((e) => console.log(e))
            audioCtx.resume()
            hideBtn.value = true;
        }

        onMounted(process)

        return {
            hideBtn,
            playAudio,
            audioRef,
            audioCtx,
            currentTime
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
</style>