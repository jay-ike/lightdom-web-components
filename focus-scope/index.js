
class FocusScope extends HTMLElement {
    #focusRetained;
    #controller = new AbortController();
    #firstFocusable;
    static define(name = "focus-scope") {
        let construct;
        if (typeof window.customElements === "undefined") {
            console.warn("custom elements are not supported in this browser");
            return;
        }
        construct = window.customElements.get(name);
        if (construct !== undefined) {
            console.warn(
                "a custom element with the name " + name +
                " already exists"
            );
        } else {
            window.customElements.define(name, FocusScope);
        }
    }

    constructor() {
        super();
    }

    connectedCallback() {
        const self = this;

        if (!self.isConnected) {
            return;
        }
        self.#firstFocusable = self.querySelector("button, a[href], input, [tabindex]");
        self.#focusRetained = self.getAttribute("unscoped") === null;
        self.addEventListener("focusout", function(event) {
            const { relatedTarget} = event;
            let relatedParent;

            event.preventDefault();
            if (self.isEqualNode(relatedTarget)) {
                return;
            }
            if (relatedTarget === null) {
                self.#keepFocus();
                return;
            }
            relatedParent = relatedTarget.closest(self.tagName.toLowerCase());
            if (!self.isEqualNode(relatedParent) && self.#focusRetained) {
                self.#keepFocus(relatedTarget);
            }
        }, { signal: self.#controller.signal });
    }

    #keepFocus(target = this) {
        target.blur();
        if (this.#firstFocusable !== null) {
            this.#firstFocusable.focus();
        }
    }

    scopeFocus() {
        this.#focusRetained = true;
    }
    unscopeFocus() {
        this.#focusRetained = false;
    }
    destroyScope() {
        this.#controller.abort();
    }
    enterScope() {
        this.#keepFocus();
    }
}
export default FocusScope;
