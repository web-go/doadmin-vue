import { asyncRoutes, constantRoutes } from '@/router'
import { transformTozTreeFormat } from '@/utils/tree'
import { dataArrayToRoutes } from '@/utils/asyncRouter'
import Layout from '@/layout'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  getMenus({ commit }, menus) {
    return new Promise(resolve => {
      var asyncRouter
      const baseRouter = [
        {
          path: '/',
          name: 'layout',
          component: Layout,
          children: []
        },
        {
          path: '*',
          redirect: '/404'
        }
      ]

      asyncRouter = transformTozTreeFormat(menus)
      // console.log(asyncRouter, 'asnyc')
      // baseRouter[0].children = asyncRouter
      // baseRouter[0].children = [
      //   {
      //     path: 'dashboard2',
      //     name: 'Dashboard2',
      //     component: 'dashboard',
      //     meta: { title: 'Dashboard2', icon: 'dashboard' }
      //   }
      // ]
      // baseRouter[0].children = baseRouter.push({
      //   path: '*',
      //   redirect: '/404'
      // })
      baseRouter[0].children = asyncRouter
      const routes = dataArrayToRoutes(baseRouter)
      commit('SET_ROUTES', routes)
      resolve(routes)
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
