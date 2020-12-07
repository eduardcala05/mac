import Vue from 'vue'
import { upperFirst, camelCase } from 'lodash'
import { HasError, AlertError,AlertErrors, AlertSuccess } from 'vform'

// Components that are registered globaly.
[
  HasError,
  AlertError,
  AlertErrors,
  AlertSuccess
].forEach(Component => {
  Vue.component(Component.name, Component)
})

const requireComponent = require.context(
  '@/components', true, /\.vue$/
);

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, ''))
  )

  Vue.component(componentName, componentConfig.default || componentConfig)
})
