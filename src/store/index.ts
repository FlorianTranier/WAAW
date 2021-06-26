import { createStore } from 'vuex'
import settings, { SettingsState } from './modules/settings'
import video, { VideoState } from './modules/video'

export default createStore<SettingsState & VideoState>({
    modules: {
        settings,
        video
    }
})