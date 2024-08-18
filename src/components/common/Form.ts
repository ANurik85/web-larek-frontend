import {Component} from "../base/Component";
import {IEvents} from "../base/events";
import {ensureElement} from "../../utils/utils";

interface IFormState {
    valid: boolean;
    errors: string[];
}

export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;

    }
}


/* 
// import validate from 'validate.js';
import { IForm, IForm, TValidationInfo } from '../../types';
import { IEvents } from '../base/events';
import { constraintsAddress, constraintsPhone, constraintsMail } from '../../utils/constants';

export class Form implements IForm{
	protected address: string;
	protected phone: string;
	protected email: string;
	protected sum: number;
	protected payment: string;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

getBasketCard();
deleteBasketCard();
reserFormInput();
placeholderFormInput();

	checkFormValidation(data: Record<keyof TValidationInfo, string>) {
		const isValid = !Boolean(validate(data, constraintsUser));
		return isValid;
	}

	checkField(data: { field: keyof TValidationInfo; value: string }) {
		switch (data.field) {
			case 'address':
				return this.checkAddress(data.value);
			case 'phone':
				return this.checkPhone(data.value);
			case 'email':
				return this.checkEemail(data.value);
		}
	}

	checkAddress(value: string) {
		const result = validate.single(value, constraintsAddress.address);
		if (result) {
			return result[0];
		} else {
			return '';
		}
	}

	checkPhone(value: string) {
		const result = validate.single(value, constraintsPhone.phone);
		if (result) {
			return result[0];
		} else {
			return '';
		}
	}

	checkEemail(value: string) {
		const result = validate.single(value, constraintsMail.email);
		if (result) {
			return result[0];
		} else {
			return '';
		}
	}

}
 */