codoodler
=========

Doodle with strangers on InterWeb!


This is a very simple multi-user doodling web app, using [PubNub][pubnub] real-time network JavaScript API, that enable you to draw on the canvas with strangers.

This little toy app also supports multiple inputs methods by using `mouse`, `touch`, and `pointer` events do the app is supported on desktop and touch-screen devices, including iOS and Android phones and tablet, and Windows 8 devices.

## Demo

[Try it now!][demo]

If nobody else is present, try launching the URL on multiple tabs/browsers/devices and try doodling on all browser windows.
 
![Screencast](http://girliemac.github.io/assets/images/articles/2014/09/doodle.gif "CoDoodler Screencast")

### With PubNub History API

Also, there is another demo with the `history()` API, which preloads the past 50 drowing strokes, while the first demo starts with a fresh canvas.

[Try it now!][demo-history]

## Tutorial

I wrote an article about this demo! If you want to see how I created, check it out on [PubNub blog][blog] :-)
And [the sequel][blog2] tutorial too!

[demo]: http://pubnub.github.io/codoodler/index.html
[demo-history]: http://pubnub.github.io/codoodler/history.html
[pubnub]: http://www.pubnub.com/docs/javascript/javascript-sdk.html
[blog]: http://www.pubnub.com/blog/multiuser-draw-html5-canvas-tutorial/
[blog2]: http://www.pubnub.com/blog/collaborative-whiteboard-with-html5-canvas-and-history/
