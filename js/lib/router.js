const checkIndexPath = (path) => ['', '/'].includes(path)
const assemblePath = (path) => {
    if(checkIndexPath(path)) return "#";
    return `#${path.replace(/\//, '')}`
}

export const push = (page, title = null) => {
    window.history.pushState({
        page: checkIndexPath(page) ? "" : page
    }, title, assemblePath(page));
}

export const Router = (
    routes,
    openCallback,
    notFoundCallback = async () => {},
    destroyCallback = async (prev) => {}
) => {
    let previousPage = null;

    const matcher = async (url) => {
        await destroyCallback(previousPage);
        const route = routes.find((route) =>
            (checkIndexPath(route.url) ? "" : route.url) === (checkIndexPath(url) ? "" : url)
        );
        if(!route) return await notFoundCallback();
        previousPage = route;
        return await openCallback(route);
    }

    window.history.pushState = new Proxy(window.history.pushState, {
        async apply(target, thisArg, argArray) {
            await matcher(argArray[0]?.page);
            return target.apply(thisArg, argArray);
        }
    })

    window.onpopstate = async _ => {
        await matcher(document.location.hash.replace(/#/, ''))
    }

    window.onload = async _ => {
        await matcher(document.location.hash.replace(/#/, ''))
    }
}
