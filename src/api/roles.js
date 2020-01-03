import request from '@/utils/request'

export function fetchRoles(query) {
  return request({
    url: '/roles',
    method: 'get',
    params: query
  })
}

export function fetchRole(id) {
  return request({
    url: '/roles/' + id,
    method: 'get'
  })
}

export function createRole(data) {
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/roles/' + data.id,
    method: 'put',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/roles/' + data.id,
    method: 'delete'
  })
}
