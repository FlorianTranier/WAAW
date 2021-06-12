<template>
    <canvas ref="canvasElement" id="canvas" />
</template>

<script lang="ts">
import { defineComponent, ref, watch, toRefs, watchEffect, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
    props: {
        analyser: AnalyserNode,
        render: Boolean
    },
    setup(props) {
        const store = useStore()
        const { analyser, render } = toRefs(props)
        const canvasElement = ref<HTMLCanvasElement | null>(null)

        let dataArray: Uint8Array
        let canvasCtx: CanvasRenderingContext2D
        let coef: number
        let barWidth: number
        let barHeight: number
        const backgroundColor = computed(() => store.state.settings.videoHidden ? 'black' : 'transparent')

        function initCanvas() {
            if (!canvasElement.value) throw Error('Failed to load canvas element !')
            canvasElement.value.width = window.innerWidth;
            canvasElement.value.height = window.innerHeight;
            canvasCtx = <CanvasRenderingContext2D>canvasElement.value.getContext("2d");
            canvasCtx.fillStyle = backgroundColor.value;
            canvasCtx.fillRect(0, 0, canvasElement.value.width, canvasElement.value.height);
        }

        function renderWaveform() {
            if (!canvasElement.value) throw Error('Failed to load canvas element !')
            if (!analyser?.value) throw Error('Failed to load analyser !')

            requestAnimationFrame(renderWaveform);
            
            canvasCtx.clearRect(0, 0, canvasElement.value.width, canvasElement.value.height);
            let x = 0;

            analyser.value?.getByteFrequencyData(dataArray);

            canvasCtx.fillStyle = backgroundColor.value;
            canvasCtx.fillRect(0, 0, canvasElement.value.width, canvasElement.value.height);

            for (let [i, j] = [40, 41]; i < dataArray?.length; i = j) {

                j *= coef

                const sum = dataArray.slice(i, j).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
                const mean = sum / (j - i)

                barHeight = mean ** (1.2 + i / 10000) + 1;

                canvasCtx.fillStyle = "white";
                canvasCtx.fillRect(x, (canvasElement.value.height - barHeight) / 2, barWidth, barHeight);

                x += barWidth + 10;
            }
        }

        watchEffect(() => {
            if (!canvasElement.value) throw Error('Failed to load canvas element !')

            initCanvas()

            watch(render, (render, _) => { 
                if (render) {
                    if (!canvasElement.value) throw Error('Failed to load canvas element !')
                    if (!analyser?.value) throw Error('Failed to load analyser !')
                    const bufferLength = analyser.value.frequencyBinCount;
                    dataArray = new Uint8Array(analyser.value.frequencyBinCount)
                    barWidth = (canvasElement.value.width / bufferLength) * 52;
                    coef = canvasElement.value.width <= 1920 ? 1.04 : 1.03
                    renderWaveform()
                }
            })
        }, { flush: 'post' })

        return {
            canvasElement
        }
    },
})
</script>

<style scoped>
    #canvas {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
</style>
