import axios from './http';

const api = {
  test () {
    axios.get('/v1/test').then(value => {
      console.log(value);
    })
  }
}

export default api;