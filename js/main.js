/* global MutationObserver, jQuery, _, Backbone */
;(function (window, ns, $) {
  'use strict'

  var namespace = window[ns] || {}
  window[ns] = namespace
  namespace.components = namespace.components || {
    kinds: {},
    initialize: function (component, el) {
      var componentName = _.camelCase(component)
      if (this.kinds[componentName]) {
        this.add(componentName, this.kinds[componentName], el)
      }
    },
    detect: function (context) {
      context = context || 'body'
      _.each($(context).find('[data-' + ns + ']'), this.find)
    },
    find: function (el) {
      _.each($(el).data(ns).split(' '), function (component) {
        namespace.components.initialize(component, el)
      })
    },
    add: function (name, Component, el) {
      var $el = $(el)
      var components = $el.data('components') || {}
      if (components[name]) {
        console.log(name, 'already initialized on', el)
        return
      }

      components[name] = new Component({
        el: el
      })

      $el.data('components', components)
    },
    getComponentSelector: function (componentName) {
      return '[data-' + ns + '~="' + componentName + '"]'
    }
  }

  namespace.render = function (template, data) {
    var compiled = _.template(template)
    return compiled(data)
  }

  namespace.attach = function (name, behaviour) {
    var componentName = _.camelCase(name)
    namespace.components.kinds[componentName] = Backbone.View.extend(behaviour)
  }

  var onMutation = function onMutation (mutations) {
    mutations.forEach(function (mutation) {
      var addedCount = mutation.addedNodes.length
      var removedCount = mutation.removedNodes.length
      // TODO: skip single textnode?
      // TODO: throttle?
      // console.log(mutation)
      if (removedCount > 0) {
        $(mutation.target).trigger('mutation:removed')
      // TODO: detach
      }
      if (addedCount > 0) {
        $(mutation.target).trigger('mutation:inserted')
        namespace.components.detect(mutation.target)
      }
    })
  }
  var mutiationConfig = {
    childList: true,
    subtree: true
  }
  var root = document.querySelector(namespace.components
    .getComponentSelector('app-root'))
  var observer = new MutationObserver(onMutation)

  $(window).on('load', function () {
    namespace.components.detect()
    observer.observe(root, mutiationConfig)
  })
})(window, 'core', jQuery)
