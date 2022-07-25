import service from './http'

const api = {
  CreateSystemFailure(data) {
    return service.request({method: 'post', url: 'v1/create-system-failure', data})
  }, GetSystemFailure(data) {
    return service.request({method: 'get', url: 'v1/failure', data})
  }, DeleteSystemFailure(data) {
    return service.request({method: 'post', url: 'v1/delete-system-failure', data})
  }, UploadSystemFailurePicture(data) {
    return service.request({method: 'post', url: 'v1/system-failure-picture-upload', data})
  }
}

export default api