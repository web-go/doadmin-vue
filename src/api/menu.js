import request from '@/utils/request'

export function fetchMenus(query) {
  return request({
    url: '/menus',
    method: 'get',
    params: query
  })
}

export function fetchMenu(id) {
  return request({
    url: '/menus/' + id,
    method: 'get'
  })
}

export function createMenu(data) {
  return request({
    url: '/menus',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/menus/' + data.id,
    method: 'put',
    data
  })
}

export function deleteMenu(data) {
  return request({
    url: '/menus/' + data.id,
    method: 'delete'
  })
}

export function addRoleMenus(id, data) {
  return request({
    url: '/roles/' + id + '/menus',
    method: 'post',
    data
  })
}
