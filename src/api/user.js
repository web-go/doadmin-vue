import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/users/profile',
    method: 'get',
    params: { token }
  })
}

export function me() {
  return request({
    url: '/user/me',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// user api
export function fetchUsers(query) {
  return request({
    url: '/users',
    method: 'get',
    params: query
  })
}

export function fetchUser(id) {
  return request({
    url: '/users/' + id,
    method: 'get'
  })
}

export function createUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/users/' + data.id,
    method: 'put',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/users/' + data.id,
    method: 'delete'
  })
}

export function addUserRoles(id, data) {
  return request({
    url: '/users/' + id + '/roles',
    method: 'post',
    data
  })
}
