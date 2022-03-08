export class CustomEventManager {

    #prefix;
    #delimiter;
    #uniqueKey;

    constructor(prefix, delimiter = "/") {
        this.#prefix = prefix;
        this.#delimiter = delimiter;
        this.#uniqueKey = (Math.random() + 1).toString(36).substring(2, 10)
    }

    #createName(name) {
        return [this.#prefix, name, this.#uniqueKey].join(this.#delimiter);
    }

    createEvent(name){
        return (detail) => new CustomEvent(this.#createName(name), {
            detail: { ...detail, eventName: this.#createName(name) }
        });
    }

    dispatch(name, detail) {
        document.dispatchEvent(this.createEvent(name)(detail));
    }

    subscribe(name, callback) {
        document.addEventListener(this.#createName(name), callback);
    }

    destroy(name, callback) {
        document.removeEventListener(this.#createName(name), callback);
    }
}
