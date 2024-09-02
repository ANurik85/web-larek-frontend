
import {Component} from "./base/Component";
 import {ICard, IForm} from "../types";
import {ensureElement} from "../utils/utils"; 

interface IAuctionActions {
    onSubmit: (price: number) => void;
}

export class Card extends Component<ICard> {
   
    
    protected _title: HTMLElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    

    constructor(container: HTMLElement, actions?: IAuctionActions) {
        super(container);

        
        
        this._title = ensureElement<HTMLElement>(`.card__title`, container) as HTMLElement;
        this._category = ensureElement<HTMLElement>(`.card__category`, container) as HTMLElement;
        this._price = ensureElement<HTMLElement>(`.card__price`, container) as HTMLElement;
        this._image = ensureElement<HTMLImageElement>(`.card__image`, container) as HTMLImageElement;
        this._description = ensureElement<HTMLElement>(`.card__text`, container) as HTMLElement;
        
        
    }

    clearCard() {
        // удаление карточки товара из корзину
        this.container.remove();
        
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

    render(data: Partial<ICard>): HTMLElement {
        Object.assign(this as object, data);
        return this.container;
    }
}