import {CustomEventManager} from "./event.js";

export const customElementsArray = [];

export class Component extends HTMLElement {

    #eventManager;
    #state;
    #triggers

    constructor(name, state) {
        super();
        this.#eventManager = new CustomEventManager(name);
        this.#state = Component.#prepareStateObserver(state);
        this.#triggers = {};
    }

    static #prepareStateObserver(state) {
        return new Proxy(state, {
            set(target, p, value, receiver) {
                console.log(receiver)
            }
        })
    }

    #getHtml() {
        const dom = new DOMParser();
        const doc = dom.parseFromString(this.template().trim(), 'text/html')
            .documentElement.querySelector('body');
        const children = [...doc.children];
        return {doc, children}
    }

    #prepareChildToRender($html) {
        console.log(this.#triggers)
        const stringVariables = Component.#getVariablesFromString($html);
    }

    static #getVariablesFromString(child) {
        const str = child.outerHTML.match(/{{(.*)}}/);
        if(!str) return [];
        console.log(str)
        return []
        // return str[0].replaceAll("{{", "")
        //     .replaceAll("}}", '')
        //     .split(" ")
        //     .map(item => item.replace(/[^\w\s]/gi, ''))
    }

    _bindRenderTriggers() {
        const {doc, children} = this.#getHtml()
        children.forEach((child) => {
            Component.#getVariablesFromString(child)
                .forEach(variable => {
                    const prev = this.#triggers[variable] || [];
                    this.#triggers = {...this.#triggers, [variable]: [...prev, child]};
                })
        })
    }

    _render() {
        const {doc, children} = this.#getHtml();
        children.forEach((child) => {
            console.log(this.#prepareChildToRender(child));
        })
        console.log(this.#triggers)
    }

    connectedCallback() {
        console.log(this.constructor.name.toLowerCase() + " is connected")
        if (!this.rendered) {
            this._bindRenderTriggers();
            this._render();
            this.rendered = true;
        }
    }

    template() {
        return "";
    }
}

export const register = (componentName, Component) => {
    customElementsArray.push({key: componentName, pseudonym: componentName + "-component"})
    customElements.define(componentName + "-component", Component);
}

export const resolve = (componentName, args = {}) => {
    const pseudonym = customElementsArray.find(item => item.key === componentName)?.pseudonym;
    if (pseudonym) {
        args = Object.keys(args).map((key) => `${key}="${args[key]}"`).join(" ")
        return `<${pseudonym} ${args}/>`
    }
    return "";
}

export const resolvePage = ($root, page) => {
    $root.innerHTML = "";
    $root.innerHTML = page.template;
    return $root;
}
