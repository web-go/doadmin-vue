// function keysrt(key, desc) {
//   return function(a, b) {
//     return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key])
//   }
// }
function compare(property) {
  return function(a, b) {
    var value1 = a[property]
    var value2 = b[property]
    return value1 - value2
  }
}

export function transformTozTreeFormat(sNodes) {
  sNodes.sort(compare('position'))
  console.log('snodes', sNodes)
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
