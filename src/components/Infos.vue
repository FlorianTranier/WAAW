<template>
    <div>
        <div id="box">
            <img :src="thumbnailUrl" alt="" id="thumbnail">
            <div id="texts">
                <div id="title">{{title}}</div>
                <br>
                <div id="duration">{{currentTime}} / {{duration}}</div>
            </div>
        </div>
    </div>
    
</template>

<script lang="ts">
import { ref, onBeforeUnmount, onMounted, computed } from 'vue'
import AudioService from '../services/audio/AudioService'
import { defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
    props: {
        audioElement: HTMLVideoElement,
        audioService: AudioService
    },
    setup(props) {
        const store = useStore()
        const currentTime = ref('')

        const interval = setInterval(() => {
            if (!props.audioElement) return
            currentTime.value = 
                `${~~(props.audioElement.currentTime / 60)}`.padStart(2, '0')
                + ':' 
                + `${~~(props.audioElement.currentTime % 60)}`.padStart(2, '0')
                ?? '00:00'
        }, 1000)

        onBeforeUnmount(() => clearInterval(interval))
        
        return {
            currentTime,
            title: computed(() => store.state.video.title),
            thumbnailUrl: computed(() => store.state.video.thumbnailUrl),
            duration: computed(() => store.state.video.duration)
        }
    },
})
</script>

<style scoped>
    #box {
        display: flex;
        align-items: center;
        justify-content: center;
        column-gap: 1rem;
        width: 100%;
        height: 100%;
        color: white;
    }

    #box > * {
        flex-grow: 1;
    }

    #thumbnail {
        height: 100%;
        display: inline-block;
        aspect-ratio: 16/9;
    }

    #title {
        flex-grow: 2;
        vertical-align: middle;
    }

    #texts {
        font-size: 1.3rem;
    }
</style>