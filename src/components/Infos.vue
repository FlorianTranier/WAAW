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

<script>
import { ref, onBeforeUnmount } from 'vue'
import AudioService from '../services/audio/AudioService'

export default {
    props: {
        audioElement: HTMLAudioElement
    },
    setup(props) {
        const currentTime = ref(0)
        const audioService = new AudioService()
        const thumbnailUrl = ref('')
        const title = ref('')
        const duration = ref('')
        
        audioService.getAudioInfos().then(data => {
            title.value = data.title
            thumbnailUrl.value = data.thumbnail
            duration.value = parseInt(data.duration / 60).toString().padStart(2, '0')
                + ':' 
                + parseInt(data.duration % 60).toString().padStart(2, '0')
                ?? '00:00'
        })

        const interval = setInterval(() => {
            currentTime.value = 
                parseInt(props.audioElement?.currentTime / 60).toString().padStart(2, '0')
                + ':' 
                + parseInt(props.audioElement?.currentTime % 60).toString().padStart(2, '0')
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
}
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