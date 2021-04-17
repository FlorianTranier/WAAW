import { createStore } from 'vuex'
import settings, { SettingsState } from './modules/settings'

export default createStore<SettingsState>({
    modules: {
        settings
    }
})