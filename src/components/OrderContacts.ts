import {Form} from "./common/Form";
import {TСontactsForm} from "../types"; 
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";
import { Component } from "./base/Component";

interface ISuccessActions {
    onClick: () => void;
}

export class OrderContacts extends Component<TСontactsForm> {

    protected _phone: HTMLInputElement;
    protected _email: HTMLInputElement;
    protected _close: HTMLElement;
    valid: boolean;
    errors: string;

    constructor(container: HTMLFormElement, events: IEvents, actions?: ISuccessActions) {
        super(container);
        
        this._phone = ensureElement<HTMLInputElement>('.form__input[name="phone"]', this.container);
        this._email = ensureElement<HTMLInputElement>('.form__input[name="email"]', this.container);
        this._close = ensureElement<HTMLElement>('.button', this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set phone(value: string) {
        ((this.container as HTMLFormElement).elements.namedItem('phone') as HTMLInputElement).value = value;
    }
    

    set email(value: string) {
        ((this.container as HTMLFormElement).elements.namedItem('email') as HTMLInputElement).value = value;
    }
}