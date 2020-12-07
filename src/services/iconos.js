import axios from 'axios'
export const Icons = {
    getAll(){
        var instance = axios.create({
            baseURL: "/"

        });
        return instance.get('fontello/config.json')
    }
}
export default Icons
