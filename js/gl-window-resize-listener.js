/* jshint esversion: 6 */

import $ from 'jquery';
import debounce from 'lodash/debounce';

export class GlWindowResizeListener {

    constructor(options) {
        
        this.debug = typeof window.debug !== 'undefined' ? window.debug : false;
        
        this.functions = [];
    }
    
    consoleLog(log = '', prefix = 'GlWindowResizeListener: ') {
        if (this.debug || window.debug) {
            if (prefix !== false) {
                console.log(prefix + log);
            } else {
                console.log(log);
            }
        }
    }
    
    init() {
        if (this.check()) {
            this.prepare();
            this.run();
        }
    }
    
    check() {
        return true;
    }
    
    prepare() {
        this.consoleLog('prepare [' + $().jquery + ']');
        
        this.$window = $(window);
        this.$document = $(document);
    }
    
    run() {
        this.consoleLog('run [' + $().jquery + ']');
        
        this.addResizeBinding();
    }
    
    addEvent(func, context) {
        if (typeof context === 'undefined') {
            context = window; // is it good?
        }
        this.functions.push({
            func,
            context,
        });
    }
    
    addResizeBinding() {
        
        let saveWindowWidth = () => {
            $('body').data('width', this.$window.width());
        }
        
        saveWindowWidth();
        
        this.debouncedResize = debounce(() => {
            // only horizontal resize
            if ($('body').data('width') === this.$window.width()) {
                return;
            }
            
            this.consoleLog('run resize window events');
            
            this.functions.forEach((f) => {
                f.func.apply(f.context);
            });
            
            // OR
            
            // for (let f of this.functions) {
            //     f.func.apply(f.context);
            // }
            
        }, 1000, {
            leading: false,
            trailing: true,
        });
        
        $(window).on('resize', () => {
            this.debouncedResize();
        });
        
    }
}

///////////
// init  //
///////////

let xGlWindowResizeListener = new GlWindowResizeListener();

$(() => {
    xGlWindowResizeListener.init();
});

export default xGlWindowResizeListener;