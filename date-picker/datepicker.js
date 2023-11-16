/*jslint browser*/
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];
const attributeMap = Object.freeze({
    "date-format": "dateFormat",
    "ignore-on-focus": "ignoreOnFocus",
    "init-date": "initDate",
    "sunday-first": "sundayFirst"
});
function dayNames(sundayFirst) {
    return (
        sundayFirst
        ? [days[6]].concat(days.slice(0, 6))
        : days
    );
}
function areSameDay(date1, date2) {
    if (date1 === undefined || date2 === undefined) {
        return false;
    }
    return (
        date1.getDate() === date2.getDate()
        && date1.getMonth() === date2.getMonth()
        && date1.getFullYear() === date2.getFullYear()
    );
}

function getInitialConfig() {
    return {
        dateFormat: "en-GB",
        ignoreOnFocus: false,
        initDate: null,
        sundayFirst: false
    };
}

function buildActions() {
    let currentMonth = document.createElement("div");
    let actions = [
        "previous year",
        "previous month",
        "next month",
        "next year"
    ];
    const result = document.createElement("div");
    currentMonth.classList.add("month-display");
    currentMonth.dataset.display = "currentMonth";
    result.classList.add("space-around", "fill-grid-row");
    actions = actions.map(function (action) {
        let btn = document.createElement("button");
        btn.dataset.action = action;
        btn.type = "button";
        btn.setAttribute("aria-label", "switch to " + action);
        btn.classList.add("inline-padding", "control");
        return btn;
    });
    actions = actions.slice(0, 2).concat([currentMonth]).concat(
        actions.slice(2)
    );
    actions.forEach((action) => result.appendChild(action));
    return result;
}

function buildCalendarGrid({actionBuilder, getDayNames}) {
    const grid = document.createElement("div");
    let actions = actionBuilder();
    let names = getDayNames().map(function (name) {
        let result = document.createElement("div");
        result.classList.add("day-name", "flow-row");
        result.textContent = name;
        return result;
    });
    let numbers = new Array(42).fill(0).map(function () {
        let button = document.createElement("button");
        button.type = "button";
        button.classList.add("date");
        return button;
    });
    grid.classList.add("calendar-grid");
    grid.appendChild(actions);
    names.concat(numbers).forEach((elt) => grid.appendChild(elt));
    grid.tabIndex = 0;
    return grid;
}

function isLeapYear(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}

function endingDay(currentDay, sundayFirst) {
    if (sundayFirst) {
        return currentDay;
    }
    return (
        currentDay === 0
        ? 6
        : currentDay - 1
    );
}

function daysInMonth(month, year) {
    const monthsWith31 = [1, 3, 5, 7, 8, 10, 12];
    const monthsWith30 = [4, 6, 9, 11];
    if (month < 1 || month > 12) {
        return 0;
    }
    if (monthsWith30.includes(month)) {
        return 30;
    }
    if (monthsWith31.includes(month)) {
        return 31;
    }
    return (
        isLeapYear(year)
        ? 29
        : 28
    );
}

function parseDate(date) {
    let newDate;
    if (!Number.isFinite(Date.parse(date))) {
        newDate = new Date();
    } else {
        newDate = new Date(Date.parse(date));
    }
    return {
        value: newDate,
        with({date, month, year}) {
            newDate.setFullYear(
                year ?? newDate.getFullYear(),
                month ?? newDate.getMonth(),
                date ?? newDate.getDate()
            );
            return newDate;
        }
    };
}

function calendarDay(day, currentMonth) {
    return {
        active: day.getMonth() === currentMonth,
        content: day.getDate(),
        date: day
    };
}

function generateDays(firstDayOfMonth, sundayFirst) {
    let index = 0;
    let tmpDate;
    let result = [];
    const dateObj = {};
    if (!Number.isFinite(Date.parse(firstDayOfMonth))) {
        return result;
    }
    dateObj.initialDate = parseDate(firstDayOfMonth).value;
    dateObj.currentDay = dateObj.initialDate.getDay();
    dateObj.currentMonth = dateObj.initialDate.getMonth();
    dateObj.previousDay = parseDate(firstDayOfMonth).with({
        date: dateObj.initialDate.getDate() - 1
    });
    dateObj.thisMonthDays = daysInMonth(
        dateObj.initialDate.getMonth() + 1,
        dateObj.initialDate.getFullYear()
    );
    dateObj.previousMonthDays = daysInMonth(
        dateObj.previousDay.getMonth() + 1,
        dateObj.previousDay.getFullYear()
    );
    dateObj.endDay = endingDay(dateObj.currentDay, sundayFirst);
    while (index < dateObj.endDay) {
        tmpDate = parseDate(dateObj.previousDay).with({
            date: dateObj.previousMonthDays
        });
        result.unshift(calendarDay(tmpDate, dateObj.currentMonth));
        dateObj.previousMonthDays -= 1;
        index += 1;
    }
    index = 0;
    while (index < dateObj.thisMonthDays) {
        tmpDate = parseDate(dateObj.initialDate).with({date: index + 1});
        result.push(calendarDay(tmpDate, dateObj.currentMonth));
        index += 1;
    }
    index = 0;
    dateObj.nextMonthDays = 42 - result.length;
    dateObj.initialDate.setMonth(dateObj.currentMonth + 1);
    while (index < dateObj.nextMonthDays) {
        tmpDate = parseDate(dateObj.initialDate).with({date: index + 1});
        result.push(calendarDay(tmpDate, dateObj.currentMonth));
        index += 1;
    }
    return result;
}
/*jslint-disable*/
class Datepicker extends HTMLElement {
    #config;
    #shown = false;
    #selectedDate;
    #displayedDate;
    #currentMonth;
    #container;
  constructor () {
    let self;
    super();
    self = this;
    this.#config = getInitialConfig();
    this.getAttributeNames().forEach(function (attribute) {
        if (self.#config[attributeMap[attribute]] === undefined) {
            return;
        }
        if (self.getAttribute(attribute).length === 0) {
            self.#config[attributeMap[attribute]] = true;
        } else {
            self.#config[attributeMap[attribute]] = self.getAttribute(attribute);
        }
    });
    this._css = `
    date-picker {
        position: relative;
        isolation: isolate;
    }
    .space-around {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    .fill-grid-row {
        grid-column: -1 / 1;
    }
    .grow-2 {
        flex-grow: 2;
    }
    .actions {
        margin-block-end: .5rem;
    }
    .inline-padding {
        padding-inline: var(--i-pad, .5rem);
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
    }
    .flow-row + .flow-row {
        margin-inline-start: .25rem;
    }
    .date:is(:hover,:focus):not(:disabled) {
        --day-color: var(--day-color-focus, white);
        --day-bg: var(--day-bg-focus, black);
    }
    .calendar-grid > button:disabled {
        color: var(--day-color-disabled, #c4c4c4);
    }
    `
  }

  static get observedAttributes () {
      return ["data-show"];
  }

  attributeChangedCallback (name, ignore, newValue) {
      if (this.#shown === true && newValue === null) {
          this.dataset.show = "";
      }
      if (this.#shown === false && typeof newValue === "string") {
          delete this.dataset.show;
      }
  }

  connectedCallback () {
      let style = document.createElement("style");
      style.innerHTML = this._css;
      this.appendChild(style);
      if (this.isConnected) {
          this.init();
      }
  }

  #renderCalendar() {
      const selectedDate = this.#selectedDate;
      let firstDay = parseDate(this.#displayedDate).with({date: 1});
      let dates = this.querySelectorAll("button.date");
      let days = generateDays(firstDay, this.#config.sundayFirst);
      this.#currentMonth.textContent = monthNames[firstDay.getMonth()];
      this.#currentMonth.textContent += " " + firstDay.getFullYear();
      dates.forEach(function (date, index) {
          let day = days[index];
          if (day === undefined) {
              return;
          }
          if (areSameDay(new Date(), day.date)) {
              date.classList.add("today");
          } else {
              date.classList.remove("today");
          }
          if (areSameDay(day.date, selectedDate)) {
              date.classList.add("selected");
          } else {
              date.classList.remove("selected");
          }
          date.textContent = day.content;
          date.disabled = !day.active;
          date.date = day.date;
      });
  }

  #updateMonth(monthUpdater) {
      let month = monthUpdater(this.#displayedDate.getMonth());
      let year = this.#displayedDate.getFullYear();
      if (month < 0) {
          month = 12 + month;
          year -= 1;
      }
      if (month > 11) {
          month = 12 % month;
          year += 1;
      }
      this.#displayedDate.setFullYear(year, month, 1);
      this.#renderCalendar();
  }
  #updateYear(yearUpdater) {
      let year = yearUpdater(this.#displayedDate.getFullYear());
      let month = this.#displayedDate.getMonth();
      this.#displayedDate.setFullYear(year, month);
      this.#renderCalendar();
  }
  #showCalendar() {
      this.#shown = true;
      this.#renderCalendar();
      this.dataset.show = "";
      this.#container.focus();
  }

  init() {
    let mainContainer;
    const self = this;
    this.#config.input = this.querySelector('input')
    if (this.#config.input === null) {
      return
    }
    this.#displayedDate = parseDate(this.#config.initDate).value;

    mainContainer = buildCalendarGrid({
        actionBuilder: buildActions,
        getDayNames: () => dayNames(this.#config.sundayFirst)
    });
    this.addEventListener("focusout", function (event) {
        const {relatedTarget, target} = event;
        const shouldStop = (
            relatedTarget !== null
            && (
                relatedTarget.parentElement === target
                || relatedTarget.parentElement.parentElement === target
            )
        );
        if (target.classList.contains("calendar-grid")) {
            if (shouldStop) {
                return;
            }
            this.#shown = false;
            delete this.dataset.show;
        }
    });
    this.#currentMonth = mainContainer.querySelector("[data-display]");
    this.addEventListener("click", function (event) {
        const {target} = event;
        event.preventDefault();
        event.stopImmediatePropagation();
        if (target.classList.contains("date")) {
            this.#selectedDate = target.date;
            this.#config.input.value = new Intl.DateTimeFormat(
                self.#config.dateFormat
            ).format(target.date);
            this.#shown = false;
            delete this.dataset.show;
        }
        if (target.dataset.action === "previous month") {
            this.#updateMonth((month) => month - 1);
        }
        if (target.dataset.action === "next month") {
            this.#updateMonth((month) => month + 1);
        }
        if (target.dataset.action === "previous year") {
            this.#updateYear((year) => year - 1);
        }
        if (target.dataset.action === "next year") {
            this.#updateYear((year) => year + 1);
        }
    });
    this.addEventListener("focusin", function ({target}) {
        if (target === this.#config.input && !this.#config.ignoreOnFocus) {
            this.#showCalendar();
        }
    });
    this.#container = this.appendChild(mainContainer);
  }
  showPicker() {
      if (this.#config.ignoreOnFocus) {
          this.#showCalendar();
      }
  }
}
customElements.define('date-picker', Datepicker)
/*jslint-enable*/
