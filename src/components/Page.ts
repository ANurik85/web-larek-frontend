import {Component} from "./base/Component";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

interface IPage {
   
    catalog: HTMLElement[];
    
}

export class Page extends Component<IPage> {
    
    protected _catalog: HTMLElement;
 
    protected _basket: HTMLElement;


    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        
        this._catalog = ensureElement<HTMLElement>('.modal__content');
        
        this._basket = ensureElement<HTMLElement>('.header__basket');

        this._basket.addEventListener('click', () => {
            this.events.emit('bids:open');
        });
    }

   
    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

   
}