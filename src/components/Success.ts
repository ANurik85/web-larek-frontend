import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";


interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;


    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

        if (this._close) {
            this._close.addEventListener('click', () => {

                events.emit('success:close');
            });
        }
    }
    set total(total: number) {
        const text = this._total.innerText;
        this._total.innerText = text.replace(/\d+/, `${total}`);
    }

}