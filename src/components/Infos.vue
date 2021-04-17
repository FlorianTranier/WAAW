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
import { ref, onBeforeUnmount } from 'vue'
import AudioService from '../services/audio/AudioService'
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        audioElement: HTMLAudioElement
    },
    setup(props) {
        const currentTime = ref('')
        const audioService = new AudioService()
        const thumbnailUrl = ref('')
        const title = ref('')
        const duration = ref('')
        
        audioService.getAudioInfos().then(data => {
            title.value = data.title
            thumbnailUrl.value = data.thumbnail
            const seconds = parseInt(data.duration)
            duration.value = `${~~(seconds / 60)}`.padStart(2, '0')
                + ':' 
                + `${~~(seconds % 60)}`.padStart(2, '0')
                ?? '00:00'
        })

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
            title,
            thumbnailUrl,
            duration
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