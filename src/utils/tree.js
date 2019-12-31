export function transformTozTreeFormat(sNodes) {
  let i, l
  var r = []
  var tmpMap = {}
  for (i = 0, l = sNodes.length; i < l; i++) {
    tmpMap[sNodes[i].id] = sNodes[i]
  }

  for (i = 0, l = sNodes.length; i < l; i++) {
    var p = tmpMap[sNodes[i].parent_id]

    if (p && sNodes[i].id !== sNodes[i].parent_id) {
      var children = nodeChildren(p)
      if (!children) {
        children = nodeChildren(p, [])
      }
      children.push(sNodes[i])
    } else {
      r.push(sNodes[i])
    }
  }

  return r
}
export function nodeChildren(node, newChildren) {
  if (typeof newChildren !== 'undefined') {
    node.children = newChildren
  }
  return node.children
}
