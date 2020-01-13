import NProgress from 'nprogress' // progress bar
import { Message } from 'element-ui'

module.exports = file => () => {
  return new Promise(resolve => {
    import(`@/views/${file}`)
      .then(module => {
        resolve(module.default)
      })
      .catch(() => {
        NProgress.done()
        Message.error('加载组件失败')
      })
  })
}
