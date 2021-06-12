<template>
    <div>
        <div v-if="audioElement !== null" id="wrapper" :class="{ hidden: !paused }">
            <div class="control" id="play-pause-btn" @click="playPause">
                <font-awesome-icon v-if="paused" icon="play" />
                <font-awesome-icon v-else icon="pause" />
            </div>
            <div class="control">
                <label for="toggleInfos">
                    Hide infos
                    <input type="checkbox" id="toggleInfos" @change="toggleInfos" />
                </label>
            </div>
            <div class="control">
                <label for="toggleVideo">
                    Hide video
                    <input type="checkbox" id="toggleVideo" @change="toggleVideo" />
                </label>
            </div>
            <div class="control">
                <label for="toggleVideoBlur">
                    Toggle video blur
                    <input type="checkbox" id="toggleVideoBlur" @change="toggleVideoBlur" />
                </label>
            </div>
            <div class="control" id="volume-controls">
                <font-awesome-icon icon="volume-down" />
                <input @change="changeVolume" min=0 max=1 step=0.01 value='0.50' type="range" name="volume-slider" id="volume-slider" ref="volumeSliderRef" />
                <font-awesome-icon icon="volume-up" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ref } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
    props: {
        audioElement: HTMLVideoElement,
        audioContext: AudioContext
    },
    setup(props) {
        const store = useStore()
        const paused = ref(true)
        const volumeSliderRef = ref<HTMLInputElement | null>(null)

        const changeVolume = () => {
            if (!props.audioElement) return
            props.audioElement.volume = parseFloat(volumeSliderRef.value?.value ?? '0.5')
        }

        paused.value = props.audioElement?.paused ?? true

        const playPause = () => {
            if (paused.value) {
                props.audioContext?.resume()
                props.audioElement?.play()
            }
            else props.audioElement?.pause()

            paused.value = props.audioElement?.paused ?? true
        }

        const toggleInfos = () => {
            store.commit("settings/toggleInfos")
        }

        const toggleVideo = () => {
            store.commit("settings/toggleVideo")
        }

        const toggleVideoBlur = () => {
            store.commit("settings/toggleVideoBlur")
        }

        return {
            volumeSliderRef,
            changeVolume,
            paused,
            playPause,
            toggleInfos,
            toggleVideo,
            toggleVideoBlur
        }
    },
})
</script>

<style scoped>

    #wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 90vh;
        font-size: 2rem;
        transition: all 2s;
        background-color: black;
        padding-top: 10vh;
        padding-bottom: 10vh;
    }

    .hidden {
        opacity: 0;
        background: none;
    }

    #wrapper:hover {
        opacity: 1;
        transition: none;
    }

    .control {
        flex-grow: 1;
    }

    #volume-controls {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }

    #play-pause-btn {
        cursor: pointer;
    }

</style>