import axios from 'axios'
export const Param = {
    getParam(val){
        var instance = axios.create({
          headers: {"Cliente": val}
        });
        return instance('/configuracion')
    }
}

export default Param
