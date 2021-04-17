export interface SettingsState {
    infosHidden: boolean
}

const state = () => ({
    infosHidden: false
})

const mutations = {
    toggleInfos(state: SettingsState) {
        state.infosHidden = !state.infosHidden
    }
}

export default {
    namespaced: true,
    state,
    mutations
}