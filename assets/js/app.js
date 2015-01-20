/**
 * Main.js
 */
// Object basic
var fr;
if (!fr) {
    fr = {};
} else {
    if (typeof fr !== "object") {
        throw new Error('fr already exists and not an object');
    }
}

if (!fr.wc_acf) {
    fr.wc_acf = {};
} else {
    if (typeof fr.wc_acf !== "object") {
        throw new Error('fr.wc_acf already exists and not an object');
    }
}


Backbone.sync = function( method, model, success ) {"use strict";
    success.success( );
};

fr.wc_acf = {
    views : {},
    models : {},
    collections : {}
};


fr.wc_acf.tools = {
    uniqid : function( prefix, more_entropy ) {
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +    revised by: Kankrelune (http://www.webfaktory.info/)
        // %        note 1: Uses an internal counter (in php_js global) to avoid collision
        // *     example 1: uniqid();
        // *     returns 1: 'a30285b160c14'
        // *     example 2: uniqid('foo');
        // *     returns 2: 'fooa30285b1cd361'
        // *     example 3: uniqid('bar', true);
        // *     returns 3: 'bara20285b23dfd1.31879087'
        if( typeof prefix == 'undefined' ) {
            prefix = "";
        }

        var retId;
        var formatSeed = function( seed, reqWidth ) {
            seed = parseInt( seed, 10 ).toString( 16 );
            // to hex str
            if( reqWidth < seed.length ) {// so long we split
                return seed.slice( seed.length - reqWidth );
            }
            if( reqWidth > seed.length ) {// so short we pad
                return Array( 1 + ( reqWidth - seed.length ) ).join( '0' ) + seed;
            }
            return seed;
        };

        // BEGIN REDUNDANT
        if( !this.php_js ) {
            this.php_js = {};
        }
        // END REDUNDANT
        if( !this.php_js.uniqidSeed ) {// init seed with big random int
            this.php_js.uniqidSeed = Math.floor( Math.random( ) * 0x75bcd15 );
        }
        this.php_js.uniqidSeed++;

        retId = prefix;
        // start with prefix, add current milliseconds hex string
        retId += formatSeed( parseInt( new Date( ).getTime( ) / 1000, 10 ), 8 );
        retId += formatSeed( this.php_js.uniqidSeed, 5 );
        // add seed hex string
        if( more_entropy ) {
            // for more entropy we add a float lower to 10
            retId += ( Math.random( ) * 10 ).toFixed( 8 ).toString( );
        }

        return retId;
    },
    selected : function( value, check ) {"use strict";
        return fr.wc_acf.tools.checked_selected_helper( value, check, 'selected' );
    },
    checked : function( value, check ) {"use strict";
        return fr.wc_acf.tools.checked_selected_helper( value, check, 'checked' );
    },
    checked_selected_helper : function( helper, current, type ) {"use strict";
        return ( helper === current ) ? type + '="' + type + '"' : '';
    },
    remove_accents : function( value ) {
        // thanks to https://gist.github.com/richardsweeney/5317392 for this code!
        var replace = {
            'ä' : 'a',
            'à' : 'a',
            'æ' : 'a',
            'å' : 'a',
            'ö' : 'o',
            'ø' : 'o',
            'é' : 'e',
            'ë' : 'e',
            'ü' : 'u',
            'ó' : 'o',
            'ő' : 'o',
            'ú' : 'u',
            'è' : 'e',
            'á' : 'a',
            'ű' : 'u',
            'í' : 'i',
            ' ' : '_',
            '\'' : '_',
            ',' : '_',
            '\'' : '_',
            '"' : '_',
            'ç' : 'c',
            'ù' : 'u'
        };

        _.each( replace, function( v, k ) {
            var regex = new RegExp( k, 'g' );
            value = value.replace( regex, v );
        } );
        return value.toLowerCase( );
    },
    template : _.memoize( function ( id ) {
        var compiled;

        return function ( data ) {
            compiled = compiled || _.template( jQuery( '#wc-acf-' + id ).html() || '' );
            return compiled( data );
        };
    })
};

/**
 * |-------------------|
 * | Backbone-Mediator |
 * |-------------------|
 *  Backbone-Mediator is freely distributable under the MIT license.
 *
 *  <a href="https://github.com/chalbert/Backbone-Mediator">More details & documentation</a>
 *
 * @author Nicolas Gilbert
 *
 * @requires _
 * @requires Backbone
 */
(function(factory){
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone'], factory);
  } else {
    factory(_, Backbone);
  }

})(function (_, Backbone){
  'use strict';

  /**
   * @static
   */
  var channels = {},
      Subscriber,
      /** @borrows Backbone.View#delegateEvents */
      delegateEvents = Backbone.View.prototype.delegateEvents,
      /** @borrows Backbone.View#delegateEvents */
      undelegateEvents = Backbone.View.prototype.undelegateEvents;

  /**
   * @class
   */
  Backbone.Mediator = {

    /**
     * Subscribe to a channel
     *
     * @param channel
     */
    subscribe: function(channel, subscription, context, once) {
      if (!channels[channel]) channels[channel] = [];
      channels[channel].push({fn: subscription, context: context || this, once: once});
    },

    /**
     * Trigger all callbacks for a channel
     *
     * @param channel
     * @params N Extra parametter to pass to handler
     */
    publish: function(channel) {
      if (!channels[channel]) return;

      var args = [].slice.call(arguments, 1),
          subscription;

      for (var i = 0; i < channels[channel].length; i++) {
        subscription = channels[channel][i];
        subscription.fn.apply(subscription.context, args);
        if (subscription.once) {
          Backbone.Mediator.unsubscribe(channel, subscription.fn, subscription.context);
          i--;
        }
      }
    },

    /**
     * Cancel subscription
     *
     * @param channel
     * @param fn
     * @param context
     */

    unsubscribe: function(channel, fn, context){
      if (!channels[channel]) return;

      var subscription;
      for (var i = 0; i < channels[channel].length; i++) {
        subscription = channels[channel][i];
        if (subscription.fn === fn && subscription.context === context) {
          channels[channel].splice(i, 1);
          i--;
        }
      }
    },

    /**
     * Subscribing to one event only
     *
     * @param channel
     * @param subscription
     * @param context
     */
    subscribeOnce: function (channel, subscription, context) {
      Backbone.Mediator.subscribe(channel, subscription, context, true);
    }

  };

  /**
   * Allow to define convention-based subscriptions
   * as an 'subscriptions' hash on a view. Subscriptions
   * can then be easily setup and cleaned.
   *
   * @class
   */


  Subscriber = {

    /**
     * Extend delegateEvents() to set subscriptions
     */
    delegateEvents: function(){
      delegateEvents.apply(this, arguments);
      this.setSubscriptions();
    },

    /**
     * Extend undelegateEvents() to unset subscriptions
     */
    undelegateEvents: function(){
      undelegateEvents.apply(this, arguments);
      this.unsetSubscriptions();
    },

    /** @property {Object} List of subscriptions, to be defined */
    subscriptions: {},

    /**
     * Subscribe to each subscription
     * @param {Object} [subscriptions] An optional hash of subscription to add
     */

    setSubscriptions: function(subscriptions){
      if (subscriptions) _.extend(this.subscriptions || {}, subscriptions);
      subscriptions = subscriptions || this.subscriptions;
      if (!subscriptions || _.isEmpty(subscriptions)) return;
      // Just to be sure we don't set duplicate
      this.unsetSubscriptions(subscriptions);

      _.each(subscriptions, function(subscription, channel){
        var once;
        if (subscription.$once) {
          subscription = subscription.$once;
          once = true;
        }
        if (_.isString(subscription)) {
          subscription = this[subscription];
        }
        Backbone.Mediator.subscribe(channel, subscription, this, once);
      }, this);
    },

    /**
     * Unsubscribe to each subscription
     * @param {Object} [subscriptions] An optional hash of subscription to remove
     */
    unsetSubscriptions: function(subscriptions){
      subscriptions = subscriptions || this.subscriptions;
      if (!subscriptions || _.isEmpty(subscriptions)) return;
      _.each(subscriptions, function(subscription, channel){
        if (_.isString(subscription)) {
          subscription = this[subscription];
        }
        Backbone.Mediator.unsubscribe(channel, subscription.$once || subscription, this);
      }, this);
    }
  };

  /**
   * @lends Backbone.View.prototype
   */
  _.extend(Backbone.View.prototype, Subscriber);

  /**
   * @lends Backbone.Mediator
   */
  _.extend(Backbone.Mediator, {
    /**
     * Shortcut for publish
     * @function
     */
    pub: Backbone.Mediator.publish,
    /**
     * Shortcut for subscribe
     * @function
     */
    sub: Backbone.Mediator.subscribe
  });

  return Backbone;

});

//
// backbone.stickit - v0.8.0
// The MIT License
// Copyright (c) 2012 The New York Times, CMS Group, Matthew DeLambo <delambo@gmail.com> 
//
(function(t){"function"==typeof define&&define.amd?define(["underscore","backbone","exports"],t):"object"==typeof exports?t(require("underscore"),require("backbone"),exports):t(_,Backbone,{})})(function(t,e,n){n._handlers=[],n.addHandler=function(e){e=t.map(t.flatten([e]),function(e){return t.extend({updateModel:!0,updateView:!0,updateMethod:"text"},e)}),this._handlers=this._handlers.concat(e)},n.ViewMixin={_modelBindings:null,unstickit:function(e,n){if(t.isObject(n))return t.each(t.keys(n),function(t){this.unstickit(e,t)},this),void 0;var i=[],a=[];t.each(this._modelBindings,function(t,o){e&&t.model!==e||n&&t.config.selector!=n||(a.push(t.config._destroy),t.model.off(t.event,t.fn),i.push(t.model),delete this._modelBindings[o])},this),t.invoke(t.uniq(i),"trigger","stickit:unstuck",this.cid),t.each(t.uniq(a),function(t){t.call(this)},this),this._modelBindings=t.compact(this._modelBindings),this.$el.off(".stickit"+(e?"."+e.cid:""),n)},stickit:function(e,n){var i=e||this.model,a=n||t.result(this,"bindings")||{};this._modelBindings||(this._modelBindings=[]),this.addBinding(i,a);var o=this.remove;o.stickitWrapped||(this.remove=function(){var t=this;return this.unstickit(),o&&(t=o.apply(this,arguments)),t}),this.remove.stickitWrapped=!0},addBinding:function(e,n,i){var o,f,v,g,b,m=e||this.model,_=".stickit."+m.cid,k=i||{},y=t.uniqueId();if(!t.isString(n)){var x=n;return t.each(x,function(t,e){this.addBinding(m,e,x[e])},this),void 0}b=n,o=":el"===b?this.$el:this.$(b),this.unstickit(m,b),o.length&&(t.isString(k)&&(k={observe:k}),t.isFunction(k.observe)&&(k.observe=k.observe.call(this)),g=c(o,k),g.selector=b,v=g.observe,g.bindId=y,g.view=this,f=t.extend({stickitChange:g},g.setOptions),g._destroy=function(){a(this,g.destroy,o,m,g)},d(this,o,g,m,v),h(this,o,g,m,v),v&&(t.each(g.events,function(e){var n=e+_,i=function(e){var n=g.getVal.call(this,o,e,g,t.rest(arguments));r(this,g.updateModel,n,e,g)&&u(m,v,n,f,this,g)};i=t.bind(i,this),":el"===b?this.$el.on(n,i):this.$el.on(n,b,i)},this),t.each(t.flatten([v]),function(t){s(m,this,"change:"+t,g,function(t,e,n){var i=n&&n.stickitChange&&n.stickitChange.bindId||null;i!==y&&p(this,o,g,l(t,v,g,this),t)})},this),p(this,o,g,l(m,v,g,this),m,!0)),a(this,g.initialize,o,m,g))}},t.extend(e.View.prototype,n.ViewMixin);var i=function(e,n){var i=(n||"").split("."),a=t.reduce(i,function(t,e){return t[e]},e);return null==a?e:a},a=function(e,n){return n?(t.isString(n)?i(e,n):n).apply(e,t.rest(arguments,2)):void 0},o=function(t){return t.find("option").not(function(){return!this.selected})},r=function(e,n){return t.isBoolean(n)?n:t.isFunction(n)||t.isString(n)?a.apply(this,arguments):!1},s=function(t,e,n,i,a){t.on(n,a,e),e._modelBindings.push({model:t,event:n,fn:a,config:i})},u=function(e,n,i,o,r,s){var u={};s.onSet&&(i=a(r,s.onSet,i,s)),s.set?a(r,s.set,n,i,o,s):(u[n]=i,t.isArray(n)&&t.isArray(i)&&(u=t.reduce(n,function(e,n,a){return e[n]=t.has(i,a)?i[a]:null,e},{})),e.set(u,o))},l=function(e,n,i,o){var r,s=function(t){return e[i.escape?"escape":"get"](t)},u=function(t){return null==t?"":t};return r=t.isArray(n)?t.map(n,s):s(n),i.onGet&&(r=a(o,i.onGet,r,i)),t.isArray(r)?t.map(r,u):u(r)},c=n.getConfiguration=function(e,i){var a=[{updateModel:!1,updateMethod:"text",update:function(t,e,n,i){t[i.updateMethod]&&t[i.updateMethod](e)},getVal:function(t,e,n){return t[n.updateMethod]()}}];a=a.concat(t.filter(n._handlers,function(t){return e.is(t.selector)})),a.push(i);var o=t.extend.apply(t,a);return o.visible&&!t.has(o,"updateView")?o.updateView=!1:t.has(o,"updateView")||(o.updateView=!0),o},d=function(e,n,i,a,o){var r=["autofocus","autoplay","async","checked","controls","defer","disabled","hidden","indeterminate","loop","multiple","open","readonly","required","scoped","selected"];t.each(i.attributes||[],function(u){var c,d,h="";u=t.clone(u),c=u.observe||(u.observe=o),d=function(){var i=t.indexOf(r,u.name,!0)>-1?"prop":"attr",o=l(a,c,u,e);"class"===u.name?(n.removeClass(h).addClass(o),h=o):n[i](u.name,o)},t.each(t.flatten([c]),function(t){s(a,e,"change:"+t,i,d)}),d()})},h=function(e,n,i,o,r){if(null!=i.visible){var u=function(){var s=i.visible,u=i.visibleFn,c=l(o,r,i,e),d=!!c;(t.isFunction(s)||t.isString(s))&&(d=!!a(e,s,c,i)),u?a(e,u,n,d,i):n.toggle(d)};t.each(t.flatten([r]),function(t){s(o,e,"change:"+t,i,u)}),u()}},p=function(t,e,n,i,o,s){r(t,n.updateView,i,n)&&(a(t,n.update,e,i,o,n),s||a(t,n.afterUpdate,e,i,n))};return n.addHandler([{selector:'[contenteditable="true"]',updateMethod:"html",events:["input","change"]},{selector:"input",events:["propertychange","input","change"],update:function(t,e){t.val(e)},getVal:function(t){return t.val()}},{selector:"textarea",events:["propertychange","input","change"],update:function(t,e){t.val(e)},getVal:function(t){return t.val()}},{selector:'input[type="radio"]',events:["change"],update:function(t,e){t.filter('[value="'+e+'"]').prop("checked",!0)},getVal:function(t){return t.filter(":checked").val()}},{selector:'input[type="checkbox"]',events:["change"],update:function(n,i){if(n.length>1)i||(i=[]),n.each(function(n,a){var o=e.$(a),r=t.indexOf(i,o.val())>-1;o.prop("checked",r)});else{var a=t.isBoolean(i)?i:i===n.val();n.prop("checked",a)}},getVal:function(n){var i;if(n.length>1)i=t.reduce(n,function(t,n){var i=e.$(n);return i.prop("checked")&&t.push(i.val()),t},[]);else{i=n.prop("checked");var a=n.val();"on"!==a&&null!=a&&(i=i?n.val():null)}return i}},{selector:"select",events:["change"],update:function(n,o,r,s){var u,l=s.selectOptions,c=l&&l.collection||void 0,d=n.prop("multiple");if(!l){l={};var h=function(t){return t.map(function(){return{value:this.value,label:this.text}}).get()};n.find("optgroup").length?(c={opt_labels:[]},n.find("> option").length&&(c.opt_labels.push(void 0),t.each(n.find("> option"),function(t){c[void 0]=h(e.$(t))})),t.each(n.find("optgroup"),function(t){var n=e.$(t).attr("label");c.opt_labels.push(n),c[n]=h(e.$(t).find("option"))})):c=h(n.find("option"))}l.valuePath=l.valuePath||"value",l.labelPath=l.labelPath||"label";var p=function(n,a,o){t.each(n,function(n){var r=e.$("<option/>"),s=n,u=function(e,n){r.text(e),s=n,r.data("stickit_bind_val",s),t.isArray(s)||t.isObject(s)||r.val(s)};"__default__"===n?u(l.defaultOption.label,l.defaultOption.value):u(i(n,l.labelPath),i(n,l.valuePath)),!d&&null!=s&&null!=o&&s===o||t.isObject(o)&&t.isEqual(s,o)?r.prop("selected",!0):d&&t.isArray(o)&&t.each(o,function(e){t.isObject(e)&&(e=i(e,l.valuePath)),(e===s||t.isObject(e)&&t.isEqual(s,e))&&r.prop("selected",!0)}),a.append(r)})};n.find("*").remove();var f=function(t,e){var n=window;return 0===e.indexOf("this.")&&(n=t),e=e.replace(/^[a-z]*\.(.+)$/,"$1"),i(n,e)};if(u=t.isString(c)?f(this,c):t.isFunction(c)?a(this,c,n,s):c,u instanceof e.Collection&&(u=u.toJSON()),l.defaultOption&&p(["__default__"],n),t.isArray(u))p(u,n,o);else if(u.opt_labels)t.each(u.opt_labels,function(t){var i=e.$("<optgroup/>").attr("label",t);p(u[t],i,o),n.append(i)});else{var v,g=[];for(var b in u)v={},v[l.valuePath]=b,v[l.labelPath]=u[b],g.push(v);p(t.sortBy(g,l.comparator||l.labelPath),n,o)}},getVal:function(t){var n;return n=t.prop("multiple")?e.$(o(t).map(function(){return e.$(this).data("stickit_bind_val")})).get():o(t).data("stickit_bind_val")}}]),e.Stickit=n,e.Stickit});

/**
 * Field view
 */
'use strict';
fr.wc_acf.views.Field = Backbone.View.extend({
    template : '',
    tagName: 'table',
    className : 'field_settings',
    events : {
        'click .wc_acf_delete' : 'delete',
        'change .wc_acf_type' : 'change_type',
        'keyup .wc_acf_title' : 'update_title',
        'keyup .wc_acf_name' : 'update_name',
        'blur .wc_acf_title' : 'clear_name',
        'keyup .wc_acf_description' : 'update_description',
        'keyup .wc_acf_settings' : 'update_settings'
    },
    bindings: {
        '.wc_acf_title_label .title': {
            observe: 'title',
            onGet: function(title) {
                return title || 'Nouveau champ';
            }
        },
        '.wc_acf_name': {
            attributes: [{
                name: 'value',
                observe: 'name'
            }]
        }
    },
    initialize : function() {
        this.template = fr.wc_acf.tools.template( 'field' );
    },
    render : function() {
        this.settings = new fr.wc_acf.views.Settings( {
            model : this.model
        });

        this.$el.html( this.template( {
            id : this.model.get('id'),
            type : this.model.get( 'type' ),
            title : this.model.get( 'title' ),
            name : this.model.get( 'name' ),
            settings : this.model.get( 'settings' ),
            description : this.model.get( 'description' ),
            html_field: this.settings.render().$el.html()
        } ) );

        this.stickit();

        return this;
    },
    delete : function( e ) {
        e.preventDefault();
        this.remove();
        Backbone.Mediator.publish( 'field:remove' );
    },
    change_type : function() {
        this.model.set( 'type', this.$el.find( '.wc_acf_type').val() );
        this.render();
    },
    clear_name : function( e ) {
        if( _.isEmpty( this.model.get( 'name' ) ) ) {
            this.model.set( 'name', fr.wc_acf.tools.remove_accents( e.currentTarget.value ) );
        }
    },
    update_title : function(e) {
        this.model.set( 'title', e.currentTarget.value );
    },
    update_name : function(e) {
        this.model.set( 'name', fr.wc_acf.tools.remove_accents( e.currentTarget.value ) );
    },
    update_description : function(e) {
        this.model.set( 'description', e.currentTarget.value );
    },
    update_settings : function(e) {
        this.model.set( 'settings', e.currentTarget.value );
    }
});

/**
 * Main view
 */
'use strict';
fr.wc_acf.views.Main = Backbone.View.extend({
    el : jQuery( '#wc-acf-edit' ),
    events :{
      'click #wc_acf_add_field' : 'add'
    },
    subscriptions: {
        'field:remove': 'field_remove'
    },
    initialize : function() {
      this.counter = 0;
    },
    add : function( e ) {
        'use strict';

        e.preventDefault();

        this.append_item( {
            id : fr.wc_acf.tools.uniqid()
        } );
    },
    append_item : function( data ) {
        'use strict';

        var self = this,
            model = new fr.wc_acf.models.Field( data ),
            item_view = new fr.wc_acf.views.Field( {
                model : model
            } );
        self.counter++;
        var rendered = item_view.render( ).$el;

        self.$el.find( '.wc_acf_fields .fields' ).append( rendered );

        rendered.find( 'input:first').focus();

        // Update the fields
        this.on_empty_fields();
    },
    field_remove : function() {
        this.counter--;
        this.on_empty_fields();
    },
    on_empty_fields : function() {
        if( this.counter <= 0 ) {
            this.$el.find('.no_fields_message').show();
        } else {
            this.$el.find('.no_fields_message').hide();
        }
    }
});

/**
 * Settings view
 */
'use strict';
fr.wc_acf.views.Settings = Backbone.View.extend({
    template : '',
    tagName: 'tr',
    className : 'field_setting field_label',
    initialize : function() {
        this.template = fr.wc_acf.tools.template( 'field-'+this.model.get( 'type' ) );
    },
    render : function() {
        this.$el.html( this.template( {
            id : this.model.get( 'id' ),
            settings : this.model.get( 'settings' )
        } ) );

        return this;
    }
});

/**
 * Field model
 */
'use strict';
fr.wc_acf.models.Field = Backbone.Model.extend({
    defaults: {
        type : 'text',
        title : '',
        name : '',
        settings : '',
        description : ''
    }
});

/**
 * Created by Nicolas on 16/01/2015.
 */

fr.wc_acf.main_view = new fr.wc_acf.views.Main();

// Fill the view
if( !_.isUndefined( wc_acf_vars.fields_data ) ) {
    _.each( wc_acf_vars.fields_data , function(field) {
        fr.wc_acf.main_view.append_item(field);
    } );
}

//# sourceMappingURL=app.js.map