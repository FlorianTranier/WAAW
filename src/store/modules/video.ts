export interface VideoState {
    title: string
    thumbnailUrl: string
    duration: string
}

const state = () => ({
    title: '',
    thumbnailUrl: '',
    duration: ''
})

const mutations = {
    setTitle(state: VideoState, value: string) {
        state.title = value
    },

    setThumbnailUrl(state: VideoState, value: string) {
        state.thumbnailUrl = value
    },

    setDuration(state: VideoState, value: string) {
        state.duration = value
    }
}

export default {
    namespaced: true,
    state,
    mutations
}