
import { FormErrors, ICard, ICardsData, IOrder } from "../types";
import { IEvents } from "./base/events";
import { Model } from "./base/Model";
import { Card } from "./Card";
import _ from "lodash";

export class CardsData extends Model<ICardsData> {
 
    
     catalog: Card[] = [];
     basket: string[] = [];
    /* catalog: ICard[]; */
    order: IOrder = {
        email: '',
        phone: '',
        address: '',
        items: []
    };
    preview: string | null;
    formErrors: FormErrors = {};
    
  
    constructor(protected events: IEvents) {
        super({ cards: [], basket: [], preview: null, order: this.order }, events);
        
    }
    
    toggleOrderedLot(id: string, isIncluded: boolean) {
        if (isIncluded) {
            this.order.items = _.uniq([...this.order.items, id]);
        } else {
            this.order.items = _.without(this.order.items, id);
        }
    }

    clearBasket() {
        this.order.items.forEach(id => {
            this.toggleOrderedLot(id, false);
            this.catalog.find(it => it.id === id).clearCard();
        });
    }

    getTotal() {
        return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
    }

    setCatalog(items: ICard[]) {
        this.catalog = items.map(item => new Card(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }
    
    setPreview(item: ICard) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес доставки';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}