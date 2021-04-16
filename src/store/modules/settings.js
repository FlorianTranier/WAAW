import { createStore } from 'vuex'

const state = () => ({
    infosHidden: false
})

const mutations = {
    toggleInfos(state) {
        state.infosHidden = !state.infosHidden
    }
}

export default {
    namespaced: true,
    state,
    mutations
}