import {Component} from "./base/Component";
import {cloneTemplate, createElement, ensureElement} from "../utils/utils";
import {EventEmitter} from "./base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
    deleted: string[];   
}

export class ModalBasket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;
    protected _deleted: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement('.basket__list', this.container);
        this._total = ensureElement('.basket__price', this.container);
        this._button = ensureElement('.basket__button', this.container);
        this._deleted = ensureElement('.basket__item-delete', this.container);

        
        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        if (this._deleted) {
            this._deleted.addEventListener('click', (event: Event) => {
                const target = event.target as HTMLElement;
                const id = target.dataset.id;
                if (id) {
                    events.emit('basket:delete', {id});
                }
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
    
    set deleted(deleted: string[]) {
        deleted.forEach(id => this.removeItem(id));
    }

    set total(total: number) {
        const text = this._total.innerText;
        this._total.innerText = text.replace(/\d+/, `${total}`);
    }

    private removeItem(id: string) {
        const item = this._list.querySelector(`[data-id="${id}"]`);
        if (item) {
            this._list.removeChild(item);
        }
    }
}
 