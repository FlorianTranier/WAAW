import axios from "axios";
import { useStore } from "vuex";
import { AudioInfos } from "./entities/AudioInfos";

export default class AudioService {

    private _videoId: string | undefined;

    private store = useStore()
    
    public set videoId(value: string | undefined) {
        this._videoId = value?.split("?v=")[1]
            || value;
    }

    constructor(videoPath: string) {
        this._videoId = videoPath
    }

    private BASE_URL = (<ImportMetaEnv>import.meta.env).DEV
        ? 'http://localhost:4000'
        : 'https://api.waaw.space'

    getAudioSource() {
        return `${this.BASE_URL}?videoId=${this._videoId}`
    }

    async getMicStream(): Promise<MediaStream> {
        return navigator.mediaDevices.getUserMedia(
            { video: false, audio: true });
    }

    async getAudioInfos(): Promise<AudioInfos> {
        const response = await axios.get(`${this.BASE_URL}/info?videoId=${this._videoId}`)
        return response.data
    }

    async updateVideoInfos() {
        const infos = await this.getAudioInfos()
        this.store.commit("video/setTitle", infos.title)
        this.store.commit("video/setThumbnailUrl", infos.thumbnail)
        const seconds = parseInt(infos.duration)
        this.store.commit("video/setDuration", `${~~(seconds / 60)}`.padStart(2, '0')
                + ':' 
                + `${~~(seconds % 60)}`.padStart(2, '0')
                ?? '00:00')
    }

}