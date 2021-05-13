import axios from "axios";

export default class AudioService {

    videoId: string | undefined

    constructor(videoPath: string) {
        this.videoId = videoPath?.split("?v=")[1]
            || videoPath;
    }

    private BASE_URL = (<ImportMetaEnv>import.meta.env).DEV
        ? 'http://localhost:4000'
        : 'https://api.waaw.space'

    getAudioSource() {
        return `${this.BASE_URL}?videoId=${this.videoId}`
    }

    async getMicStream(): Promise<MediaStream> {
        return navigator.mediaDevices.getUserMedia(
            { video: false, audio: true });
    }

    async getAudioInfos(): Promise<AudioInfos> {
        const response = await axios.get(`${this.BASE_URL}/info?videoId=${this.videoId}`)
        return response.data
    }

}