<template lang='pug'>
include base/VisualizerTemplate.pug
</template>

<script lang="ts">
import { defineComponent, ref, watch, toRefs, watchEffect, computed } from 'vue'
import { useStore } from 'vuex'
import VisualizerTemplate from './base/VisualizerTemplate.vue'

export default defineComponent({
    extends: VisualizerTemplate,
    setup(props) {
        const store = useStore()
        const { analyser, render } = toRefs(props)
        const canvasElement = ref<HTMLCanvasElement | null>(null)

        let dataArray: Uint8Array
        let canvasCtx: CanvasRenderingContext2D
        const backgroundColor = computed(() => store.state.settings.videoHidden ? 'black' : 'transparent')

        function initCanvas() {
            // Initialize your canvas properties
        }

        function renderWaveform() {
            if (!canvasElement.value) throw Error('Failed to load canvas element !')
            if (!analyser?.value) throw Error('Failed to load analyser !')

            requestAnimationFrame(renderWaveform);
            
            // Draw your waveform

            // Here's an example (from Waveform.vue)

            // Clear canvas at each frames to avoid ghosting
            canvasCtx.clearRect(0, 0, canvasElement.value.width, canvasElement.value.height);

            let x = 0;

            // Get data from the analyser, each value is a number of decibels (0 to 255) for a given frequency
            // Frequency goes from low to high in this array
            analyser.value?.getByteFrequencyData(dataArray);

            // Render canvas background
            canvasCtx.fillStyle = background.value;
            canvasCtx.fillRect(0, 0, canvasElement.value.width, canvasElement.value.height);

            // For each segment in the analyser node data array, build a white rectangle
            // Maths inside are made to put the value on a logarithmic scale
            // We take the mean of a certain amount of data to smooth the curve
            // Each time, we grow exponentially the amount of data used to calculate the mean as we iterate through the array
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

        function initRendering() {
            if (!canvasElement.value) throw Error('Failed to load canvas element !')
            if (!analyser?.value) throw Error('Failed to load analyser !')
            const bufferLength = analyser.value.frequencyBinCount;
            dataArray = new Uint8Array(analyser.value.frequencyBinCount)
            barWidth = (canvasElement.value.width / bufferLength) * 52;
            coef = canvasElement.value.width <= 1920 ? 1.04 : 1.03
            renderWaveform()
        }
        
        // Wait for the canvas to be ready before doing anything
        watchEffect(() => {
            if (!canvasElement.value) throw Error('Failed to load canvas element !')

            initCanvas()

            if (render.value) {
                initRendering()
            }

            watch(render, (render, _) => { 
                if (render) {
                    initRendering()
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
