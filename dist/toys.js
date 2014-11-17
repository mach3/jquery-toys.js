/**
 * jQuery-Toys.js
 * --------------
 * Too trifling extentions for jQuery
 * 
 * @version 0.1.2 (2014/11/17)
 * @author mach3 <http://github.com/mach3>
 * @license MIT
 */
(function($, global){

    /**
     * Extend Supports
     * ---------------
     */
    $.extend($.support, {
        scriptAsync: document.createElement("script").async !== void 0,
        scriptOnLoad: document.createElement("script").onreadystatechange === void 0
    });

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
     * Apply attributes feature to object
     *
     * options:
     * - defaults: Property name for default options
     * - options: Property name for options 
     * - eventType: Event type name for changing options
     *
     * @param {Object} obj
     * @param {Object} options
     */
    $.applyConfig = function(obj, options){
        var o = $.extend({
            defaults: "defaults",
            options: "options",
            eventType: "change"
        }, options);

        obj[o.options] = obj[o.options] || {};
        if(o.defaults in obj){
            obj[o.options] = $.extend(true, obj[o.options], obj[o.defaults]);
        }

        obj.config = function(){
            var type, args, options, my = this;

            args = arguments;
            type = $.type(args[0]);
            options = this[o.options];

            if(type === "string"){
                if(args.length < 2){
                    return options[args[0]];
                }
                if(options[args[0]] === args[1]){
                    return this;
                }
                options[args[0]] = args[1];
                if("trigger" in this && "on" in this){
                    this.trigger(o.eventType, {key: args[0], value: args[1]});
                }
                return this;
            }
            else if(type === "object"){
                $.each(args[0], function(key, value){
                    my.config(key, value);
                });
                return this;
            }
            else if(type === "undefined"){
                return options;
            }
            return this;
        };
        
        return obj;
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
     * Values for formatDate
     */
    $.FORMAT_DATE_MONTHS = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", 
        "Oct", "Nov", "Dec"
    ];
    $.FORMAT_DATE_MONTHS_FULL = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];
    $.FORMAT_DATE_DAYS = [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
    ];
    $.FORMAT_DATE_DAYS_FULL = [
        "Sunday", "Monday", "Friday", "Wednesday",
        "Thursday", "Friday", "Saturday"
    ];
    $.FORMAT_DATE_AMPM = [
        "am",
        "pm"
    ];

    /**
     * Format date string
     * @param {Date} date
     */
    $.formatDate = function(date, template){
        var vars, tokens, escaped;

        date = (date instanceof Date) ? date : new Date(date);
        escaped = [];
        vars = {
            y: date.getFullYear(),
            m: date.getMonth(),
            d: date.getDate(),
            day: date.getDay(),
            hour: date.getHours(),
            min: date.getMinutes(),
            sec: date.getSeconds()
        };
        tokens = [
            "[y]{2,4}",
            "[m]{1,4}",
            "[d]{1,2}",
            "[h]{1,2}",
            "[H]{1,2}",
            "[M]{1,2}",
            "[s]{1,2}",
            "[D]{1,2}",
            "[a]{1}"
        ];

        return template.replace(/\[([\s\S]+?)\]/g, function(token, e){
            escaped.push(e);
            return "%%%";
        })
        .replace(new RegExp($.format("(%s)", tokens.join("|")), "g"), function(token){
            switch(token){
                case "yyyy":
                    return vars.y;
                case "yy":
                case "yyy":
                    return vars.y.toString().substr(2);
                case "mmm":
                    return $.FORMAT_DATE_MONTHS[vars.m];
                case "mmmm":
                    return $.FORMAT_DATE_MONTHS_FULL[vars.m];
                case "mm":
                    return $.zerofill(vars.m + 1, 2);
                case "m":
                    return vars.m + 1;
                case "dd":
                    return $.zerofill(vars.d, 2);
                case "d":
                    return vars.d;
                case "hh":
                    return $.zerofill(vars.hour, 2);
                case "h":
                    return vars.hour;
                case "HH":
                    return $.zerofill(vars.hour % 12, 2);
                case "H":
                    return vars.hour % 12;
                case "MM":
                    return $.zerofill(vars.min, 2);
                case "M":
                    return vars.min;
                case "ss":
                    return $.zerofill(vars.sec, 2);
                case "s":
                    return vars.sec;
                case "D":
                    return $.FORMAT_DATE_DAYS[vars.day];
                case "DD":
                    return $.FORMAT_DATE_DAYS_FULL[vars.day];
                case "a":
                    return $.FORMAT_DATE_AMPM[vars.hour < 12 ? 0 : 1];
                default: break;
            }
            return "";
        })
        .replace(/%%%/g, function(){
            return escaped.length ? escaped.shift() : "";
        });
    };

    /**
     * Separate number with comma
     * @param {Number} num
     */
    $.formatNumber = function(num){
        return num.toString()
        .replace(/([0-9]+?)(?=(?:[0-9]{3})+$)/g , "$1,");
    };

    /**
     * Load image, return Deferred object
     * @param {String} src
     * @returns {Deferred}
     */
    $.loadImage = function(src){
        var img = new Image(), df = $.Deferred();
        img.onload = function(){ df.resolve(this); };
        img.onerror = function(){ df.reject(this); };
        img.src = src;
        return df.promise();
    };

    /**
     * Parse url string, return location-like object
     * @param {String} url
     */
    $.parseURL = function(url){
        var el = document.createElement("a");
        el.href = url;
        return {
            hash: el.hash,
            host: el.host,
            hostname: el.hostname,
            href: el.href,
            origin: el.origin,
            pathname: el.pathname,
            port: el.port,
            protocol: el.protocol
        };
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
     * Include script by url(s), return Deferred object
     * - if async is `FALSE`, try to load synchronously (only for browser which supports scriptElement.async)
     * - async is `FALSE` as default
     * @param {String|Array} url
     * @param {Boolean} sync
     */
    $.require = function(url, async){
        var df, stack, count, process;

        df = $.Deferred();
        url = ($.type(url) !== "array") ? [url] : url;
        count = url.length;
        async = async || false;

        process = function(e){
            if((!! e && e.type === "load") || this.readyState === "loaded"){
                if(count -= 1){ return; }
                df.resolve();
            }
        };

        $.each(url, function(i, src){
            var node = $("<script>")
            .on($.support.scriptOnLoad ? "load" : "readystatechange", process)
            .prop("async", async).appendTo("body");
            node.attr("src", src);
        });

        return df.promise();
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
     * Zero-fill number
     * @param {Number} num
     * @param {Integer} length
     */
    $.zerofill = function(num, length){
        var count;
        num = num.toString();
        if(count = length - num.length){
            while(count--){ num = "0" + num; }
        }
        return num;
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
     * Return key-value object from input nodes in form
     * @returns {Object}
     */
    $.fn.serializeObject = function(){
        var vars = {};
        $.each(this.serializeArray(), function(i, item){
            if(vars[item.name] === void 0){
                return vars[item.name] = item.value;
            }
            if($.type(vars[item.name]) !== "array"){
                vars[item.name] = [vars[item.name]];
            }
            vars[item.name].push(item.value);
        });
        return vars;
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

}(jQuery, this));