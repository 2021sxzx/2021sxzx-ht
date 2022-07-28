import service from './http'

const request = (method, url, data) => service.request({method, url, data})
export default {
  GetBackupCycle: data => request('get', 'v1/mongo-backup-cycle', data),
  ChangeBackupCycle: data => request('post', 'v1/change-backup-cycle', data),
  HandleBackup: data => request('get', 'v1/handle-backup', data),
  GetBackup: data => request('get', 'v1/mongo-backup', data),
  DeleteSystemBackup: data => request('post', 'v1/delete-system-backup', data),
}