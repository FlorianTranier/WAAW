export interface SettingsState {
    infosHidden: boolean
    videoHidden: boolean
    videoBlurred: boolean
    template: string
}

const state = () => ({
    infosHidden: false,
    videoHidden: false,
    videoBlurred: false,
    template: 'waveform'
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
    },

    setTemplate(state: SettingsState, value: string) {
        state.template = value
    }
}

export default {
    namespaced: true,
    state,
    mutations
}