import {Component} from "./base/Component";
import {ensureElement} from "../utils/utils";
import { TOrderSuccess } from "../types";

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<TOrderSuccess> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

        if (actions.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }
    set total(total: number) {
        const text = this._total.innerText;
        this._total.innerText = text.replace(/\d+/, `${total}`);
    }
    
}