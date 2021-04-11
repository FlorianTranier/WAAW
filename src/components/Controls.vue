<template>
    <div>
        <div v-if="audioElement !== null" id="wrapper" :class="{ hidden: !paused }">
            <div class="control" id="play-pause-btn" @click="playPause">
                <font-awesome-icon v-if="paused" icon="play" />
                <font-awesome-icon v-else icon="pause" />
            </div>
            <div class="control" id="volume-controls">
                <font-awesome-icon icon="volume-down" />
                <input @change="changeVolume" min=0 max=1 step=0.01 value='0.50' type="range" name="volume-slider" id="volume-slider" ref="volumeSliderRef" />
                <font-awesome-icon icon="volume-up" />
            </div>
            <div class="control">{{ currentTime }}</div>
        </div>
    </div>
    
</template>

<script>
import { ref,onBeforeUnmount } from 'vue'
export default {
    props: {
        audioElement: HTMLAudioElement,
        audioContext: AudioContext
    },
    setup(props) {
        const currentTime = ref(0)
        const paused = ref(true)
        const volumeSliderRef = ref(null)

        const interval = setInterval(() => {
            paused.value = props.audioElement?.paused
            currentTime.value = 
                parseInt(props.audioElement?.currentTime / 60).toString().padStart(2, '0')
                + ':' 
                + parseInt(props.audioElement?.currentTime % 60).toString().padStart(2, '0')
                ?? '00:00'
        }, 1000)

        const changeVolume = () => {
            props.audioElement.volume = volumeSliderRef.value.value
        }

        const playPause = () => {
            if (paused.value) {
                props.audioContext?.resume()
                props.audioElement?.play()
            }
            else props.audioElement?.pause()

            paused.value = props.audioElement?.paused
        }

        onBeforeUnmount(() => clearInterval(interval))

        return {
            currentTime,
            volumeSliderRef,
            changeVolume,
            paused,
            playPause
        }
    },
}
</script>

<style scoped>

    #wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        width: 100%;
        height: 100%;
        font-size: 2rem;
        transition: all 2s;
    }

    .hidden {
        opacity: 0;
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