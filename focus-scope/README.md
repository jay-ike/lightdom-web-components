
# focus-scope Component
This is a web component that when added in a page restrict the focus to stay with its scope

## Table of Contents
- [Features](\#features)
- [Attributes](\#attributes)
- [API](\#api)
    - focus-scope instance methods
    - focus-scope static methods
- [How to Use](\#how-to)
    - styling
    - integration
- [Contributing](\#contribution)
- [License](\#license)

## Features
- prevent the focus from getting out of its scope
- can be useful in dialog when we don't want the focus to get away from it
- can be customized to define its behavior

## Attributes

| Name | Purpose | Default Value |
| ------| ------- | ------- |
| unscoped | allow non-children to gain focus | no |

## API
### focus-scope instance methods
#### scopeFocus
This method is used to restrict the focus only the element's children

#### unscopeFocus
This method is used to remove the focus restriction to the element's children

#### destroyScope
This method is used to remove the focus listener

#### enterScope
This method is used to apply the focus scope (it's mostly used at initialization)


### focus-scope static methods

#### define
This method help you to define your component in the light DOM
You can optionally set the name by providing it as parameter to this method (the default name is **focus-scope**)

## How To Use
To use this component we should setup the styling and integrate the component to the DOM with javascript

To integrate it to the DOM we have to first of all grap the code in a file

In the javascript file we just do this
```javascript
import FocusScope from "./path/to/focus-scope";
FocusScope.define(); //if you provide a name it should be seperated by a - ex: my-scope
```

Because the FocusScope is set as a javascript we should add it to the page as a module script assuming your main javascript file is called **index.js**
```html
    <body>
        <focus-scope>
            <section class="step">
                <button>
                    action 1
                </button>
            </section>
            <section class="step">
                <button>
                    action 2
                </button>

            </section>
            <section class="step">
                <button>
                    action 3
                </button>
            </section>
        </focus-scope>
        <script type="module" src="index.js"></script>
    </body>
```

## Contributing
Any questions, suggestions are welcome so feel free to let me know about it. I will really appreciate it

## License
To be honest I'm a big fan of free software so do whatever you want with this component (*please do good things with it and share it if you want*)
