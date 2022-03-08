import Greeting from "./app/components/greeting.js";
import {push, Router} from "./lib/router.js";
import {register, resolvePage} from "./lib/inc/component.js";

import IndexPage from './app/pages/index.js'

/**
 * Root container
 * @type {Element}
 */
const $root = document.querySelector('#root');

/**
 * Register custom-components
 */

register('greeting', Greeting);

/**
 * Start router
 */

const routes = [
    { url: "/", page: IndexPage },
    { url: "login", page: null },
];

const openCallback = async (target) => {
    if(target.page) resolvePage($root, target.page)
}

const notFoundCallback = () => {
    $root.innerHTML = 'not found page';
}

Router(
    routes,
    openCallback,
    notFoundCallback
);
// console.log(render(Greeting));
