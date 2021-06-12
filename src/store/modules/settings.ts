export interface SettingsState {
    infosHidden: boolean
    videoHidden: boolean
    videoBlurred: boolean
}

const state = () => ({
    infosHidden: false,
    videoHidden: false,
    videoBlurred: false,
})

const mutations = {
    toggleInfos(state: SettingsState) {
        state.infosHidden = !state.infosHidden
    },

    toggleVideo(state: SettingsState) {
        state.videoHidden = !state.videoHidden
    },

    toggleVideoBlur(state: SettingsState) {
        state.videoBlurred = !state.videoBlurred
    }
}

export default {
    namespaced: true,
    state,
    mutations
}