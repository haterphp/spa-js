import {Component, resolve} from "../../lib/inc/component.js";

const Greeting = class extends Component {
    constructor() {
        super(
            "greeting",
            {greeting: "Hello"},
        );
    }

    static get observedAttributes() {
        return ['name'];
    }

    template() {
        return `
            <h1 class="greeting"><span>{{greeting}}</span>, {{name}}</h1>
            <h1 class="greeting-greeting">{{greeting}}</h1>
            <h1 class="greeting-name">{{name}}</h1>
            ${resolve('greeting', { class: "qweasd123" })}
        `;
    }
}

export default Greeting;
