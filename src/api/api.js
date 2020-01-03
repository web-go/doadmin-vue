import request from '@/utils/request'

export function fetchApis(query) {
  return request({
    url: '/apis',
    method: 'get',
    params: query
  })
}

export function fetchApi(id) {
  return request({
    url: '/apis/' + id,
    method: 'get'
  })
}

export function createApi(data) {
  return request({
    url: '/apis',
    method: 'post',
    data
  })
}

export function updateApi(data) {
  return request({
    url: '/apis/' + data.id,
    method: 'put',
    data
  })
}

export function deleteApi(data) {
  return request({
    url: '/apis/' + data.id,
    method: 'delete'
  })
}

export function addRoleApis(id, data) {
  return request({
    url: '/roles/' + id + '/apis',
    method: 'post',
    data
  })
}
