import Axios from 'axios'

const Auth = {
    login(payload={}){
        return Axios.post('/login',payload)
    },
    getUser(){
        return Axios('/user')
    }
}
export default Auth
