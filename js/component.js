/* global jQuery */
;(function (window, ns, $) {
  'use strict'

  var namespace = window[ns] || {}
  window[ns] = namespace
  var getComponentSelector = namespace.components.getComponentSelector

  namespace.attach('hello-link', {
    events: {
      'click': 'onClick'
    },
    initialize: function () {
      this.$target = this.$el.next(getComponentSelector('target'))
      this.$main = this.$el.parents(getComponentSelector('main'))
    },
    onClick: function (ev) {
      ev.preventDefault()
      var template = namespace.render('hello <%= user %>!', { 'user': 'fred' })
      this.$el.text(template)
      var html = this.$main.html()
      this.$target.html(html)
    }
  })

  namespace.attach('target', {
    events: {
      'mutation:inserted': 'onInsert',
      'mutation:removed': 'onRemove'
    },
    onInsert: function () {
      console.log('inserted')
    },
    onRemove: function () {
      console.log('removed')
    }
  })

  namespace.attach('clean-link', {
    events: {
      'click': 'onClick'
    },
    initialize: function () {
      this.$main = this.$el.parents(getComponentSelector('main'))
      this.$target = this.$main.find(getComponentSelector('target'))
    },
    onClick: function (ev) {
      ev.preventDefault()
      this.$target.html('')
    }
  })

})(window, 'core', jQuery)
