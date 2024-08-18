import {Component} from "../base/Component";
import {cloneTemplate, createElement, ensureElement, formatNumber} from "../../utils/utils";
import {EventEmitter} from "../base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__total');
        this._button = this.container.querySelector('.basket__action');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    set selected(items: string[]) {
        if (items.length) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }

    set total(total: number) {
        this.setText(this._total, formatNumber(total));
    }
}

/* 
import { Modal } from './common/Modal';
import { IEvents } from './base/events';

interface IModalConfirm {
    valid: boolean;
    submitCallback: Function;
}
export class ModalBasket extends Modal <IModalConfirm> {
	protected submitButton: HTMLButtonElement;
	protected _form: HTMLFormElement;
	protected formName: string;
	protected _handleSubmit: Function;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this._form = this.container.querySelector('.popup__form');
		this.submitButton = this._form.querySelector('.popup__button');
		this.formName = this._form.getAttribute('name');
		this._form.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`${this.formName}:submit`, {
				submitCallback: this.handleSubmit,
			});
		});
	}

	set valid(isValid: boolean) {
		this.submitButton.classList.toggle('popup__button_disabled', !isValid);
		this.submitButton.disabled = !isValid;
	}

	get form() {
		return this._form;
	}

	set handleSubmit(submitFunction: Function) {
		this._handleSubmit = submitFunction;
	}
}
 */