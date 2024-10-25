import { Component } from "./base/Component";
import { ICard, IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _price: HTMLElement;
    protected _category: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.card__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
        this._button = container.querySelector(`.card__button`);
        this._description = container.querySelector(`.card__text`);
        this._price = container.querySelector(`.card__price`);
        this._category = container.querySelector(`.card__category`);

        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('basket:add', { id: this.id });
            });
        }
    }



    public get button() {
        return this._button;
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set price(value: string | null) {
        if (value === null) {
            this.setText(this._price, 'безценно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    get price(): string {
        return this._price.textContent || '';
    }

    set category(value: string) {
        this.setText(this._category, value);
        // Удаляем предыдущие классы категории
        this._category.classList.remove('card__category_soft', 'card__category_other', 'card__category_additional', 'card__category_button', 'card__category_hard');

        // Добавляем новый класс категории
        switch (value.trim()) {
            case 'софт-скил':
                this._category.classList.add('card__category_soft');
                break;
            case 'другое':
                this._category.classList.add('card__category_other');
                break;
            case 'дополнительное':
                this._category.classList.add('card__category_additional');
                break;
            case 'кнопка':
                this._category.classList.add('card__category_button');
                break;
            case 'хард-скил':
                this._category.classList.add('card__category_hard');
                break;
        }
    }


    get category(): string {
        return this._category.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }


}
