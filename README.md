# sticky-float
Plugin sticky float for html elements

Demo
-----
<a href="http://matthewpattell.github.io/sticky-float/" target="_blank">Go to demo page</a>

Installation
-----

With bower:
```bash
$ bower install jquery-stickyfloat
```

Usage
-----

Include on your web page:

1. jQuery
2. jQuery Throttle plugin

```html
<script src="https://code.jquery.com/jquery-2.2.3.min.js"></script>
<script src="https://rawgit.com/cowboy/jquery-throttle-debounce/master/jquery.ba-throttle-debounce.min.js"></script>
```

Then include this plugin:

```html
<script src="sticky-float/sticky-float.js"></script>
```

And simple usage:
```js
$('.example').stickyfloat();
```

Options:
```js
$('.example').stickyfloat({
    top: 0,           // top margin (number in px)
    spacer: true,     // create spacer (boolean)
    saveWidth: false, // save width element (boolean)
    parent: false     // change parent element (boolean or jQuery element)
});
```

That's all. Check it.