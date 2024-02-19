# Datepicker Component
This is a web component that wraps an input element to create a stylable date picker
Note: this component is highly inspired by this [repo](https://github.com/vanillawc/wc-datepicker) with some tweaks

## Table of Contents
- [Features](\#features)
- [Attributes](\#attributes)
- [API](\#api)
    - calendar parts
    - calendar methods
- [How to Use](\#how-to)
    - styling
    - integration
- [Contributing](\#contribution)
- [License](\#license)

## Features
- custom date formating (locale based actually ex: "en-US")
- initial date setting
- first day of the week selection: sunday or monday
- ability to rapidly move by years
- accessible calendar
- highly customizable calendar layout

## Attributes

| Name | Purpose | Default Behavior |
| ------| ------- | ------- |
| date-format | define the locale in which you want the date to be formatted | formatted according to the current locale |
| switch-year | do we need to add the previous and next year actions | No |
| ignore-on-focus | do we need to ignore the fact that we show the calendar once the input is focused ? | No |
| sunday-first | do we need to set sunday as the first day of the week ? |  No |
| init-day | date by which we should start showing the current month | the current date |
| data-show | wheter we should show the calendar or not | No (cannot be modified manually) |

## API
### Calendar events
#### dateselected
the event fired when a date is selected by a user
The detail's property of this event is
- date: which is a Date Object representing the selected date

### Calendar parts
| Part | Role | How to access |
| ------ | ------ | -------- |
| calendar grid | This is the container holding the entire calendar | look for the div having the **calendar-grid** class |
| current month | This is the container displaying the current month (and year) | look for div having the **month-display** class or the **data-display** attribute equals to **currentMonth** |
| actions | This is the container holding the actions available in the calendar | look for div having the **actions** class |
| The previous year action (if enabled) | enable us to present the current month in the year prior to the current year | look for button with the **data-action** attribute  of **previous year** |
| The next year action (if enabled) | enable us to present the current month in the year next to the current year | look for button with the **data-action** attribute of **next year** |
| The previous month | enable us to present the month prior to the current month | look for a button with the **data-action** attribute of **previous month** |
| The next month | enable us to present the month next to the current month | look for a button with the **data-action** attribute of **next month** |
| The days names| These are the containers holding the names of each days of the week | look for divs having the **day-name** class |
| The dates | These are the buttons representing the days displayed for the current month if a day is not within the current month the button is disabled | look for buttons having the **date** class |
| The selected date | as his name says | look for a button having both the **date** and **selected** classes |
| The current day | to allow the styling of the current day | look for a button having both the **date** and **today** classes |

### Calendar instance methods

#### init
This method is used to dynamically initialize the component

*Note:* this will have no effect if the component is already initialized
#### showPicker
Used to show the calendar when we have decided not to show it once the input is focused (through the ignore-on-focus attribute)
*Note:* this will have no effect if the ignore-on-focus attribute is not present at initialization

### Calendar static methods

#### define
This method help you to define your component in the light DOM
You can optionally set the name by providing it as parameter to this method (the default name is **date-picker**)

## How To Use
To use this component we should setup the styling and integrate the component to the DOM with javascript

An example of styling can be the following:
```css
    date-picker {
        position: relative;
        isolation: isolate;
    }
    [data-show] > .calendar-grid {
        --calendar-display: grid;
    }
    .calendar-grid {
        display: var(--calendar-display, none);
        grid-template-columns: repeat(7, auto);
        gap: var(--c-gap, 0px);
        padding: 10px;
        position: absolute;
        inset-block-end: calc(100% + .5rem);
        background-color: var(--calendar-bg, white);
    }
    .actions {
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-block-end: .5rem;
        grid-column: -1 / 1;
    }

    .month-display {
        flex-grow: 2;
    }

    .calendar-grid  button {
        font-size: var(--button-font, 1.25em);
        border: var(--button-bdr, none);
        color: var(--day-color, currentColor);
        background-color: var(--day-bg, transparent);
        padding: 5px;
    }
    .calendar-grid .selected {
        --day-color: var(--day-color-selected, red);
    }
    .day-name {
        font-size: var(--day-font, 1.25em);
        text-align: center;
        padding-inline: var(--i-pad, .5rem);
    }
    .day-name + .day-name {
        margin-inline-start: .25rem;
    }
    .date:is(:hover,:focus):not(:disabled) {
        --day-color: var(--day-color-focus, white);
        --day-bg: var(--day-bg-focus, black);
    }
    .calendar-grid > button:disabled {
        color: var(--day-color-disabled, #c4c4c4);
    }

```

To integrate it to the DOM we have to first of all grap the code in a file

In the javascript file we just do this
```javascript
import Datepicker from "./path/to/datepicker";
Datepicker.define(); //if you provide a name it should be seperated by a - ex: my-picker
```

Because the Datepicker is set as a javascript we should add it to the page as a module script assuming your main javascript file is called **index.js**
```html
    <body>
        <date-picker>
            <input type="text" />
        </date-picker>
        <script type="module" src="index.js"></script>
    </body>
```

## Contributing
Any questions, suggestions are welcome so feel free to let me know about it

## License
To be honest I'm a big fan of free software so do whatever you want with this component (*please do good things with it and share it if you want*)
