# Step-by-Step Component
This is a web component that wraps a set of block elements to show them step by step (the first element is assumed to be the first step and the last, the last step)

## Table of Contents
- [Features](\#features)
- [Attributes](\#attributes)
- [API](\#api)
    - Step-by-Step parts
    - Step-by-Step methods
- [How to Use](\#how-to)
    - styling
    - integration
- [Contributing](\#contribution)
- [License](\#license)

## Features
- initial step setting
- restrict the modification of the current step manually
- ability to listen to step update
- highly customizable Step-by-Step layout

## Attributes

| Name | Purpose | Default Value |
| ------| ------- | ------- |
| out-indicator | define the class to indicate that a step is out of view | **step-out** |
| initial-index | define the step by which we should start | **0** |

## CSS Variables

| Name | Purpose | Default Value |
| ---- | ------- |  ------------ |
| --curent | give the ability to style the steps based on the value of the current step | the value of the **initial-index** attribute(internally updated) |
| --i | set the index of a step so that the styling can be done | the initial index of the step upon initialization(should not be updated) |

## API
### Step-by-Step events
#### indexupdated
This event is fired when the current step has been updated
The detail's properties of this event are:

- current: the value of the index after update
- previous: the value of the index before update

### Step-by-Step instance methods
#### nextStep
This method is used to update the current step and set it to the one next to it

#### previousStep
This method is used to update the current step and set it to the one prior to it

#### gotoStep
This method is used to update the current step and set it to the value given as argument

*Note:* this will have no effect if the step requested does not exists

### Step-by-Step static methods

#### define
This method help you to define your component in the light DOM
You can optionally set the name by providing it as parameter to this method (the default name is **step-by-step**)

## How To Use
To use this component we should setup the styling and integrate the component to the DOM with javascript

An example of styling can be the following:
```css
    .step-out {
        position: fixed;
        visibility: hidden;
        z-index: -1;
        inset: 0;
    }

    .step {
        --max: max(var(--i), var(--current));
        --min: min(var(--i), var(--current));
        --opacity: clamp(0, 1 + var(--min) - var(--max), 1);
        opacity: var(--opacity);
    }
```

To integrate it to the DOM we have to first of all grap the code in a file

In the javascript file we just do this
```javascript
import StepByStep from "./path/to/step-by-step";
StepByStep.define(); //if you provide a name it should be seperated by a - ex: my-stepper
```

Because the StepByStep is set as a javascript we should add it to the page as a module script assuming your main javascript file is called **index.js**

```html
    <body>
        <step-by-step>
            <section class="step">
                <p>
                    first page content
                </p>
            </section>
            <section class="step">
                <p>
                    second page content
                </p>

            </section>
            <section class="step">
                <p>
                    third page content
                </p>
            </section>
        </step-by-step>
        <script type="module" src="index.js"></script>
    </body>
```

## Contributing
Any questions, suggestions are welcome so feel free to let me know about it I will really appreciate it

## License
To be honest I'm a big fan of free software so do whatever you want with this component (*please do good things with it and share it if you want*)
