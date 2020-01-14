const _import = require('./_import')
export const asyncRouterHandle = asyncRouter => {
  asyncRouter.forEach(item => {
    if (item.component) {
      if (typeof item.component === 'string') {
        item.component = _import(item.component)
      }
    } else {
      delete item['component']
    }
    if (item.children) {
      asyncRouterHandle(item.children)
    }
  })
  return asyncRouter
}
export const dataArrayToRoutes = data => {
  const res = []
  data.forEach(item => {
    const tmp = { ...item }
    if (tmp.component) {
      if (tmp.component === 'Layout') {
        tmp.component = () => import('@/layout')
      } else if (typeof tmp.component === 'string') {
        let sub_view = tmp.component
        sub_view = sub_view.replace(/^\/*/g, '')
        tmp.component = _import(sub_view)
        tmp.meta = {
          ...tmp.meta
        }
      }
    }
    if (tmp.children && tmp.children.length > 0) {
      tmp['redirect'] = 'noRedirect'
      if (tmp.children.length < 2) {
        tmp['alwaysShow'] = true
      }
      tmp.children = dataArrayToRoutes(tmp.children)
    }
    res.push(tmp)
  })
  return res
}
