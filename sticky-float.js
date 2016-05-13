/**
 * Created by Matthew on 13.05.2016.
 */

(function( $ ){

    var $window = jQuery(window),
        $elements = [],       // all tracked element
        /**
         * Default options for element
         * @type {{top: number, spacer: boolean, saveWidth: boolean, parent: boolean|object}}
         */
        $options = {
            top: 0,           // top margin (in px)
            spacer: true,     // create spacer
            saveWidth: false, // save width element
            parent: false     // change parent element
        };

    var methods = {

        /**
         * Construct plugin
         * @param args argument plugin
         * @returns object
         */
        init: function ( args ) {

            var self   = this,
                isInit = self.data('sticky');

            if( !isInit ) {

                self.options = $.extend({}, $options, args);
                self.varibles = {};

                self.varibles.distance = self.offset().top - self.options.top;
                self.varibles.parent   = self.options.parent ? self.options.parent : self.parent();
                self.varibles.offset   = self.varibles.parent.offset().top - self.options.top - self.outerHeight(true);

                self.varibles.stick = false;
                self.varibles.stop  = false;

                if (self.options.spacer) {
                    self.varibles.spacer = $("<div />");
                    self.before( self.varibles.spacer );
                }

                this.data('sticky', true);

                $elements.push( self );
            }

            $window.scroll( _scroll );

            return this;
        },

        /**
         * Destroy plugin for element
         */
        destroy: function () {

            var self   = this,
                isInit = self.data('sticky');

            if(isInit) {
                $.each($elements, function (counter, $element) {
                    if($element && $element.get(0) === self.get(0)) {

                        _unstick($element);
                        $elements.splice(counter, 1);
                        self
                            .removeData('sticky')
                            .off('stickyfloat');

                        return true;
                    }
                });
            }

            if( !$elements.length )
                $window.off('scroll', _scroll);
        }
    };

    /**
     * Function event scroll
     */
    var _scroll = $.throttle(50, function () {

        if( $elements.length ) {
            $.each($elements, function (counter, $elm) {

                if (!$elm.varibles.stick && !$elm.varibles.stop && ($window.scrollTop() >= $elm.varibles.distance)) {
                    _stick($elm);
                }

                if ($elm.varibles.stick && $window.scrollTop() <= $elm.varibles.distance) {
                    _unstick($elm);
                }

                if (!$elm.varibles.stop && ($window.scrollTop() >= ($elm.varibles.parent.outerHeight() + $elm.varibles.offset))) {
                    _stop($elm);
                }

                if ($elm.varibles.stop && ($window.scrollTop() <= ($elm.varibles.parent.outerHeight() + $elm.varibles.offset))) {
                    _stick($elm);
                }

            });
        }
    });

    /**
     * Make sticky element
     * @param $element
     * @private
     */
    var _stick = function ($element) {

        _unstick($element);

        if( $element.options.saveWidth )
            $element.css({width: $element.outerWidth(true) + 'px'});

        $element
            .css({top: $element.options.top + 'px'})
            .addClass('sticked');

        if(!$element.is(':empty') && $element.varibles.spacer) {
            $element.varibles.spacer.css({
                width: '20px',
                height: $element.outerHeight(true),
                display: 'inherit'
            });
        }

        $element.varibles.stick = true;
    };

    /**
     * Unmake sticky element
     * @param $element
     * @returns {boolean}
     * @private
     */
    var _unstick = function ($element) {

        if(!$element.varibles.stick)
            return false;

        $element
            .css({top:''})
            .removeClass('sticked-stop')
            .removeClass('sticked');

        if( $element.options.saveWidth )
            $element.css({width:''});

        if(!$element.is(':empty') && $element.varibles.spacer) {
            $element.varibles.spacer.css({display: 'none'});
        }

        $element.varibles.stop = false;
        $element.varibles.stick= false;
    };

    /**
     * Stop sticky element at bottom border parent
     * @param $element
     * @private
     */
    var _stop = function ($element) {

        $element
            .css({top: $element.varibles.parent.outerHeight() - $element.outerHeight()})
            .addClass('sticked-stop')
            .removeClass('sticked');

        $element.varibles.stop = true;
        $element.trigger('stickyfloat.stopEvent');
    };

    /**
     * New property-function for jQuery
     * @param method
     * @returns {*}
     */
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