import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { TAddressForm } from "../types";
import { IEvents } from "./base/events";

interface ISuccessActions {
    onClick: () => void;
}

export class OrderAddress extends Component<TAddressForm> {
    protected _close: HTMLElement;
    protected _paymentButtons: NodeListOf<HTMLButtonElement>;
    protected _address: HTMLFormElement;
    constructor(container: HTMLFormElement, events: IEvents, actions?: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order__button', this.container);
        this._paymentButtons = this.container.querySelectorAll('.order__buttons button');
        this._address = ensureElement<HTMLFormElement>('.form__input', this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', this.selectPaymentMethod.bind(this));
        });
    }

    set address(value: string) {
        ((this.container as HTMLFormElement).elements.namedItem('address') as HTMLInputElement).value = value;
    }

    private selectPaymentMethod(event: Event) {
        const selectedButton = event.target as HTMLButtonElement;
        this._paymentButtons.forEach(button => button.classList.remove('selected'));
        selectedButton.classList.add('selected');
        ((this.container as HTMLFormElement).elements.namedItem('paymentMethod') as HTMLInputElement).value = selectedButton.name;
    }
}
