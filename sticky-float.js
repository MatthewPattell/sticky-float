/**
 * Created by Matthew on 13.05.2016.
 */

(function( $ ){

    var jWindow = jQuery(window);

    // All tracked element
    var elements = [];

    /**
     * Default options for element
     * @type {{top: number, spacer: boolean, saveWidth: boolean, parent: boolean|object}}
     */
    var options = {
        top: 0,           // top margin (in px)
        spacer: true,     // create spacer
        saveWidth: true, // save width element
        parent: false     // change parent element
    };

    /**
     * Default variables values for element
     * @type {{distance: number, parent: null|jQuery, offset: number, spacer: boolean|object, stick: boolean, stop: boolean}}
     */
    var variables = {
        distance: 0,
        parent: null,
        offset: 0,
        spacer: false,
        stick: false,
        stop: false
    };

    var methods = {

        /**
         * Construct plugin
         * @param args argument plugin
         * @returns object
         */
        init: function ( args ) {

            if( !this.data('sticky') ) {

                var new_element = {
                    object: this,
                    options: $.extend({}, options, args),
                    variables: $.extend({}, variables, {})
                };

                new_element.variables.distance = this.offset().top - new_element.options.top;
                new_element.variables.parent   = new_element.options.parent ? new_element.options.parent : this.parent();
                new_element.variables.offset   = new_element.variables.parent.offset().top - new_element.options.top - this.outerHeight(true);

                if (new_element.options.spacer) {
                    new_element.variables.spacer = $("<div />");
                    this.before( new_element.variables.spacer );
                }

                this
                    .addClass('plg-sticky')
                    .data('sticky', true);

                if(!elements.length)
                    jWindow.scroll( _scroll );

                elements.push(new_element );
            }

            return this;
        },

        /**
         * Destroy plugin for element
         */
        destroy: function () {

            var self   = this;

            if( self.data('sticky') ) {
                $.each(elements, function (counter, element) {
                    if(element && element.object.get(0) === self.get(0)) {

                        _unstick(element);
                        elements.splice(counter, 1);
                        self
                            .removeClass('plg-sticky')
                            .removeData('sticky')
                            .off('stickyfloat');

                        return true;
                    }
                });
            }

            if( !elements.length )
                jWindow.off('scroll', _scroll);
        }
    };

    /**
     * Function event scroll
     */
    var _scroll = $.throttle(10, function () {

        if( elements.length ) {

            // window scroll
            var scrollTop = jWindow.scrollTop();

            $.each(elements, function (counter, el) {

                // parent height
                var parentHeight = el.variables.parent.outerHeight();

                if (!el.variables.stick && !el.variables.stop && (scrollTop >= el.variables.distance)) {
                    _stick(el);
                } else if (el.variables.stick && scrollTop <= el.variables.distance) {
                    _unstick(el);
                }

                if (!el.variables.stop && (scrollTop >= (parentHeight + el.variables.offset))) {
                    _stop(el);
                } else if (el.variables.stop  && (scrollTop <= (parentHeight + el.variables.offset))) {
                    _stick(el);
                }

            });
        }
    });

    /**
     * Make sticky element
     * @param element
     * @private
     */
    var _stick = function (element) {

        _unstick(element);

        var elWidth = element.object.outerWidth(true);

        if( element.options.saveWidth )
            element.object.css({width: elWidth + 'px'});

        element.object
            .css({top: element.options.top + 'px'})
            .addClass('plg-sticked');

        if(element.variables.spacer && element.variables.spacer.css('display') !== 'inherit' && !element.object.is(':empty')) {
            element.variables.spacer.css({
                width: elWidth + 'px',
                height: element.object.outerHeight(true),
                display: 'inherit'
            });
        }

        element.variables.stick = true;
    };

    /**
     * Unmake sticky element
     * @param element
     * @returns {boolean}
     * @private
     */
    var _unstick = function (element) {

        if(!element.variables.stick)
            return false;

        element.object
            .css({top:''})
            .removeClass('plg-sticked-stop')
            .removeClass('plg-sticked');

        if( element.options.saveWidth )
            element.object.css({width:''});

        if(element.variables.spacer && !element.variables.stop && !element.object.is(':empty'))
            element.variables.spacer.css({display: 'none'});

        element.variables.stop = false;
        element.variables.stick= false;
    };

    /**
     * Stop sticky element at bottom border parent
     * @param element
     * @private
     */
    var _stop = function (element) {

        if(element.variables.parent.css('position') !== 'relative' || element.variables.parent.css('position') !== 'absolute')
            element.variables.parent.css('position', 'relative');

        element.object
            .addClass('plg-sticked-stop')
            .removeClass('plg-sticked');

        element.variables.stop  = true;

        element.object.trigger('stickyfloat.stopEvent');
    };

    $.fn.stickyfloat = function( method ) {

        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method with name ' +  method + ' does not exist for jQuery.stickyfloat' );
        }

    };

})( jQuery );