
# jQuery-Toys.js

Too trifling extentions for jQuery

## Extend $

### $._type(obj [, test]) :String|Boolean

- obj :Object
- test :Boolean

Get type by [object Xxx] string.
Validate by second argument.

```javascript
$._type({}); // "Object"
$._type(new String("foo"), "String"); // TRUE
```

### $.applyConfig(obj [, options]) :Object

- obj :Object
- options :Object

Add config feature to object.
If obj has event feature (by $.applyEvents), "change" event triggered when value is changed.

``` javascript
$.applyConfig(obj);
obj.config("name", "john");
obj.config("name"); // "john"
```

### $.applyEvents(obj [, propName]) :Object

- obj :Object
- propName :String

Add events feature to object.
on()/off()/trigger() is available.

```javascript
$.applyEvents(obj);
obj.on("change", function(){...});
obj.trigger("change");
```

### $.escapeHTML(str) :String

- str :String

Return escaped HTML string

### $.escapeRegExp(str) :String

- str :String

Return escaped RegExp string

### $.format(template, str1, str2, ... [, asObject]) :String|jQuery

- template :String
- str1 :String
- str2 :String
- asObject :String

Replace "%s" in template to following strings.
Return result string, or if last argument is TRUE, return jQuery object.

```javascript
$.format("My %s is %s", "name", "John"); // "My name is John"
```

### $.formatDate(date, template) :String

- date :Date|String
- template :String

Format date string. Wrap with [] to escape.

```javascript
$.formatDate("2014/1/23 01:23:45", "D mmm dd yyyy hh:MM:ss a");
// Thu Jan 23 2014 12:34:56 pm
```

### $.formatNumber(num) :String

- num :Number

Format a number with grouped thousands.

```javascript
$.formatNumber(1234567890); // 1,234,567,890
```

### $.loadImage(src) :jQuery.Deferred

- src :String

Load image and return deferred object.

```javascript
$.loadImage("sample.png").done(function(){ ... });
```

### $.parseURL(url) :Object

- url :String

Parse url string, return location-like object.

```javascript
$.parseURL("http://www.excample.com/the/path/to/?q=foo").protocol; // http:
```

### $.random(start, end) :Number

- start :Number
- end :Number

Get random value from start, end integer.

```javascript
$.random(0, 8); // random value: 0-8
```

### $.randomFrom(list) :*

- list :Array

Get random value from list values.

```javascript
$.randomFrom(["foo", "bar", "baz"]); // random "foo|bar|baz"
```

### $.rebase(obj, props) :Object

- obj :Object
- props :Array|String|RegExp

Fix `this` in methods to the object.

```javascript
$.rebase(obj, "onClick");
$(some).click(obj.onClick); // `this` in onClick() is obj
```

### $.render(template, vars) :String

- template :String
- vars :Object

Mustache-like simplest rendering method.

```javascript
var template = "My {{key}} is {{value}}";
$.render(template, {key: "name", value: "John"}); // "My name is John"
```


### $.scrollTo(selector [,duration, easing, complete, offset]) :jQuery.Deferred

- selector :String|Number
- duration :Number (500)
- easing :String ("swing")
- complete :Function ($.noop)
- offset :Number (0)

Scroll with animation.

```javascript
$.scrollTo("#target").done(function(){ ... });
```

### $.times(count, callback) :void

- count :Number
- callback :Function

Repeatedly run callback function by count times.

```javascript
$.times(10, function(index){ ... });
```

### $.zerofill(num, length) :String

- num :Number
- length :Number

Fill string by "0".

```javascript
$.zerofill(123, 8); // 00000123
```


## Extend $.fn

### $.fn.anchorTo(options)

Scroll with animation to the position of element represented by #hash on click link.
Options are passed to $.scrollTo.
If href is not started with "#", this does nothing.

- options :Object

```javascript
$("a").anchorTo();
```

### $.fn.render(vars)

- vars :Object

Render template (its content) with vars using $.render.
This returns jQuery object initialized by the result HTML.

```html
<script type="text/template" id="template"> ... </script>
<script>
	$("#template").render({ ... });
</script>
```

### $.fn.serializeObject()

Get key-value object from form element.

```javascript
$("form#my-form").serializeObject();
```

### $.fn.swapImage(options)

- options :Object

Swap image on mouseover.
Find image for mouseover state using suffix (-hover).

```javascript
$("img.swap-image").swapImage();
```

### $.fn.togglable(className)

- className :String

Toggle ".checked" class when input[type=radio|checkbox] changed.

```javascript
$("input[type=radio], input[type=checkbox]").togglable();
```

