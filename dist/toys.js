/**
 * jQuery-Toys.js
 * --------------
 * Too trifling extentions for jQuery
 * 
 * @version 0.1.0 (2014/10/21)
 * @author mach3 <http://github.com/mach3>
 * @license MIT
 */
(function($){

    /**
     * Extend jQuery
     * -------------
     */

    /**
     * Get type by [object Xxx] string
     * - Validate by second argument
     * @param {*} obj
     * @param {String} test (optional)
     * @returns {Boolean|String}
     */
    $._type = function(obj, test){
        var m, name;
        m = Object.prototype.toString.call(obj).match(/^\[object (\w+)\]$/);
        name = m ? m[1] : null;
        return (test !== void 0) ? test === name : name;
    };

    /**
     * Apply event feature to object
     * - `propName` is property name for jQuery object
     * @param {Object} obj
     * @param {String} propName
     */
    $.applyEvents = function(obj, propName){
        propName = propName || "_emitter";
        obj[propName] = $(obj);
        $.each(["on", "off", "trigger"], function(i, name){
            obj[name] = function(){
                this[propName][name].apply(this[propName], arguments);
                return this;
            };
        });
        return obj;
    };

    /**
     * Escape HTML string
     * @param {String} str
     * @returns {String}
     */
    $.escapeHTML = function(str){
        return $("<i>").append(document.createTextNode(str)).html();
    };

    /**
     * Escape RegExp string
     * @param {String} str
     * @returns {String}
     */
    $.escapeRegExp = function(str){
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };

    /**
     * Get formatted string or get elements by the selector
     * @param {String} format
     * @param {String...} str1, str2, str3...
     * @param {Boolean} asObject (optional)
     * @returns {String|jQuery}
     */
    $.format = function(/* format, str1, str2, str3 ... [, asObject] */){
        var args, asObject, str;
        args = Array.prototype.slice.call(arguments);
        asObject = ($.type(args[args.length - 1]) === "boolean") ? args.pop() : false;
        str = args.shift().replace(/%s/g, function(){
            return args.length ? args.shift() : "";
        });
        return asObject ? $(str) : str;
    };

    /**
     * Load image, return Deferred object
     * @param {String} src
     * @returns {Deferred}
     */
    $.loadImage = function(src){
        var img = new Image(), df = $.Deferred();
        img.onload = function(){ df.resolve(this); };
        img.src = src;
        return df.promise();
    };

    /**
     * Get random value from start, end integer
     * @param {Number} start
     * @param {Number} end
     */
    $.random = function(start, end){
        return start + Math.floor(Math.random() * (end - start + 1));
    };

    /**
     * Get random value from array
     * @param {Array} list
     */
    $.randomFrom = function(list){
        return list[$.random(0, list.length - 1)];
    };

    /**
     * Rebase the method as object's one
     * `props` is
     * - property name string
     * - array of method name
     * - regexp
     * @param {Object} obj
     * @param {String|Array|RegExp} props
     */
    $.rebase = function(obj, props){
        var reg;
        switch($.type(props)){
            case "array": break;
            case "string":
                props = [props]; break;
            case "regexp":
                var reg = props;
                props = [];
                $.each(obj, function(name){
                    if(reg.test(name)){ props.push(name); }
                });
                break;
            default: break;
        }
        $.each(props, function(i, name){
            obj[name] = $.proxy(obj[name], obj);
        });
        return obj;
    };

    /**
     * Render from template and vars
     * @param {String} template
     * @param {Object|Array} vars
     * @returns {String}
     */
    $.render = function(template, vars){
        var res = "", render;
        render = function(template, vars){
            return template.replace(/(\{{2,3})(\w+)\}{2,3}/g, function(a, b, c){
                var value = vars[c] || "";
                return (b.length === 2) ? $.escapeHTML(value) : value;
            });
        };
        vars = ($.type(vars) === "array") ? vars : [vars];
        $.each(vars, function(i, o){
            res += render(template, o);
        });
        return res;
    };

    /**
     * Scroll to element's position with animation
     * @param {String} selector
     * @param {Number} duration
     * @param {String} easing
     * @param {Function} complete
     * @param {Number} offset
     */
    $.scrollTo = function(selector, duration, easing, complete, offset){
        var top = ($.type(selector) === "number") ? selector : $(selector).offset().top;
        top = (offset === void 0) ? top : top + offset;
        duration = (duration === void 0) ? 500 : duration;
        easing = easing || "swing";
        complete = complete || $.noop;
        return $("html, body").animate({scrollTop: top}, duration, easing, complete);
    };

    /**
     * Call function [count] times
     * @param {Integer} count
     * @param {Function} callback
     */
    $.times = function(count, callback){
        for(var i=0; i<count; i+=1){ callback(i); }
    };


    /**
     * Extend jQuery.fn
     * ----------------
     */

    /**
     * Scroll to the position of element represented by #hash on click link
     * @param {Object} options
     */
    $.fn.anchorTo = function(options){
        var o, handler;

        o = $.extend({
            easing: "swing",
            duration: 500,
            complete: $.noop,
            offset: 0
        }, options);

        handler = function(e){
            var m;
            if(m = this.href.match(/#([\w\-]+)$/)){
                e.preventDefault();
                $.scrollTo(m[0], o.duration, o.easing, o.complete, o.offset);
            }
        };

        this.on("click", handler);

        return this;
    };

    /**
     * Return node rendered `this.html()` by vars
     * @param {Object|Array} vars
     * @returns {jQuery}
     */
    $.fn.render = function(vars){
        return $("<i>").html($.render(this.html(), vars)).children();
    };

    /**
     * Swap image source on mouseover
     */
    $.fn.swapImage = function(options){
        var o, handler;

        o = $.extend({
            suffix: "-hover",
            keyHover: "_swapHover",
            keyDefault: "_swapDefault"
        });

        handler = function(e){
            this.src = (e.type === "mouseenter") ? this[o.keyHover] : this[o.keyDefault];
        };

        this.each(function(){
            var node = $(this);
            if(this.nodeName === "IMG"){
                this[o.keyDefault] = this.src;
                this[o.keyHover] = node.data("swap") || (function(src){
                    return src.replace(/\.\w+$/, function(ext){
                        return o.suffix + ext;
                    });
                }(this.src));
                $.loadImage(this[o.keyHover]).done(function(){
                    node.hover(handler, handler);
                });
            }
        });

        return this;
    };

    /**
     * Toggle ".checked" class when input[type=radio|checkbox] changed
     * @param {String} className
     */
    $.fn.togglable = function(className){
        className = className || "checked";
        this.on("change", function(e){
            $("input[name=" + this.name + "]").each(function(){
                $(this).toggleClass(className, this.checked);
            });
        });
        return this;
    };

}(jQuery));