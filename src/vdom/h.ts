import VNode from './vnode/vnode'
import createVText from './create-vtext'
import { isVNode, isVText, isWidget, isStateLess } from './vnode/types'
import { isString, isArray, isNumber } from '../util'

function h (tagName, props, children) {
  let key
  let namespace
  let owner
  const childNodes = []
  if (!children && isChildren(props)) {
    children = props
    props = {}
  }
  props = props || {}
  if (props.hasOwnProperty('key') && props.key) {
    key = props.key
    delete props.key
  }
  if (props.hasOwnProperty('namespace') && props.namespace) {
    namespace = props.namespace
    delete props.namespace
  }
  if (props.hasOwnProperty('owner')) {
    owner = props.owner
    delete props.owner
  }
  if (props.hasOwnProperty('children') && props.children) {
    if (!children || !children.length) {
      children = props.children
    }
    delete props.children
  }
  if (children) {
    addChildren(childNodes, children, tagName)
  }
  return new VNode(tagName, props, childNodes, key, namespace, owner)
}

function addChildren (childNodes, children, tagName) {
  if (isString(children) || isNumber(children)) {
    children = String(children)
    childNodes.push(createVText(children))
  } else if (isChild(children)) {
    childNodes.push(children)
  } else if (isArray(children)) {
    children.forEach(child => addChildren(childNodes, child, tagName))
  }
}

function isChild (node) {
  return isVNode(node) || isVText(node) || isWidget(node) || isStateLess(node)
}

function isChildren (x) {
  return isString(x) || isArray(x) || isChild(x)
}

export default h