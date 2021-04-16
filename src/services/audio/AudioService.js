import axios from "axios";

export default class AudioService {

    #BASE_URL = import.meta.env.DEV ? 'http://localhost:4000' : 'https://boiling-tundra-34239.herokuapp.com'

    #VIDEO_ID = window.location.search.split("?v=")[1]
        || window.location.pathname.substr(1);

    getAudioSource() {
        return `${this.#BASE_URL}?videoId=${this.#VIDEO_ID}`
    }

    async getAudioInfos() {
        const response = await axios.get(`${this.#BASE_URL}/info?videoId=${this.#VIDEO_ID}`)
        return response.data
    }

}