<template>
    <main class="text-center p-4 mx-0">
        <button v-if="!hideBtn" @click="playAudio" id="play-btn">Play</button>
        <audio
            controls
            crossorigin="anonymous"
            id="audio"
            ref="audioElement"
        />
        <canvas ref="canvasElement" id="canvas" />
    </main>
</template>

<script>
import { onMounted, ref } from 'vue'

export default {

    setup() {

        const hideBtn = ref(true);
        let audioCtx;

        function process() {
            let audioElement = document.getElementById('audio');
            let canvasElement = document.getElementById('canvas');
            const videoId = window.location.search.split("?v=")[1] || window.location.pathname.substr(1);
            audioElement.src = `https://boiling-tundra-34239.herokuapp.com?videoId=${videoId}`;
            canvasElement.width = window.innerWidth;
            canvasElement.height = window.innerHeight;
            const ctx = canvasElement.getContext("2d");

            audioCtx = new AudioContext();
            const src = audioCtx.createMediaElementSource(audioElement);
            const analyser = audioCtx.createAnalyser();

            src.connect(analyser);
            analyser.connect(audioCtx.destination);

            analyser.fftSize = 32768;
            analyser.minDecibels = -85;
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

                    barHeight = mean ** 1.1 + 1;
                    ctx.fillStyle = "white";
                    ctx.fillRect(x, (HEIGHT - barHeight) / 2, barWidth, barHeight);
                    //ctx.fillText(i, x, (HEIGHT - barHeight) / 2)
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
            playAudio
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
</style>