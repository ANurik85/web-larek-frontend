import { EventEmitter } from './components/base/events';
import './scss/styles.scss';

interface IBasketModel {
  items: Map<string, number>;
  add(id: string): void;
  remove(id: string): void;
}
interface IEventEmitter {
  emit: (event: string, data: unknown) => void;
}

class BasketModel implements IBasketModel {
  constructor(protected events: IEventEmitter) { }
  add(id: string): void {
    // ...
    this._changed();
  }
  remove(id: string): void {
    // ...
    this._changed();
  }

  protected _changed(): {
    this.events.emit('basket:change', { item: Array.from(this.items.keys()) });
  }
}

const events = new EventEmitter();
const basket = new BasketModel(events);

events.on('basket:change', (data: { items: string[] }) => {
  // выводим куда-то
});

interface IProduct {
  id: string;
  title: string;
}

interface CatalogModel {
  items: IProduct[];
  setItems(items: IProduct[]): void; // чтобы установть после загрузки из апи
  getProduct(id: string): IProduct; // чтобы получить при рендере списков
}

interface IViewConstructor {
  new(container: HTMLElement, events?: IEventEmitter): IView; // на входе контейнерб в него будем выводить
}
interface IView {
  render(data?: object): HTMLElement; // устанавливаем данныеб возвращаем контейнер
}

class BasketItemView implements IView {
  // элементы внутри контейнера
  protected title: HTMLElement;
  protected addButton: HTMLButtonElement;
  protected removeButton: HTMLButtonElement;
  // данные, которое хотим сохранить на будущее
  protected id: string | null = null;

  constructor(protected container: HTMLElement, protected events: IEventEmitter) {
    this.title = container.querySelector('basket-item__title') as HTMLSpanElement;
    this.addButton = container.querySelector('basket-item__add') as HTMLButtonElement;
    this.removeButton = container.querySelector('basket-item__remove') as HTMLButtonElement;
    // устанавливаем события
    this.addButton.addEventListener('click', () => {
      // генерируем событие в нашем брокере
      this.events.emit('basket:add', { id: this.id });
    });

    this.removeButton.addEventListener('click', () => {
      this.events.emit('basket:remove', { id: this.id });
    });
  }
  render(data: { id: string, title: string }) {
    if (data) {
      // если есть новое данные, то запомним их
      this.id = data.id;
      // и выведем в интерфейс
      this.title.textContent = data.title;
    }

    return this.container;
  }
}

class BasketView implements IView {
  constructor(protected container: HTMLElemet) { }

  render(data: { items: HTMLElemet[] }) {
    if (data) {
      this.container.replaceChildren(...data.items);
    }
    return this.container;
  }
}


// инициализация
const api = new ShopAPI();
const events = new EventEmitter();
const basketView = new BasketView(document.querySelector('.basket'));
const basketModel = new BasketModel(events);
const catalogModel = new CatalogModel(events);
// можно собрать в функции или классы отдельные экраны с логикой их формирования
function renderBasket(items: string[]) {
  basketView.render(
    items.map(id => {
      const itemView = new BasketItemView(events);
      return itemView.render(catalogModel.getProduct(id));
    })
  );
}

// при изменении рендерим
events.on('basket:change', (event: { items: string[] }) => {
  renderBasket(event.items);
});

// при действиях изменяем модель, а после этого случится рендер 
events.on('ui:basket-add', (event: { id: string }) => {
  basketModel.add(event.id);
});

events.on('ui:basket-remove', (event: { id: string }) => {
  basketModel.remove(event.id);
});

// подгружаем начальные данные и запускаем процессы
api.getCatalog()
  .then(catalogModel.setItems.bind(catalogModel))
  .catch(err => console.error(err));





/* 
  import './blocks/index.css';
  import { AppApi } from './components/AppApi';
  import { Card } from './components/Card';
  import { CardsContainer } from './components/CardsContainer';
  import { CardData } from './components/CardsData';
  import { ModalWithConfirm } from './components/ModalWithConfirm';
  import { ModalWithForm } from './components/ModalWithForm';
  import { ModalWithImage } from './components/ModalWithImage';
  import { UserData } from './components/UserData';
  import { UserInfo } from './components/UserInfo';
  import { Api } from './components/base/api';
  import { EventEmitter, IEvents } from './components/base/events';
  import { IApi } from './types';
  import { API_URL, settings } from './utils/constants';
  import { testCards, testUser } from './utils/tempConstants';
  import { cloneTemplate } from './utils/utils';
  
  
  const events = new EventEmitter();
  
  const baseApi: IApi = new Api(API_URL, settings);
  const api = new AppApi(baseApi);
  
  const cardsData = new CardData(events);
  const userData = new UserData(events);
  const userView = new UserInfo(document.querySelector('.profile'), events);
  
  const imageModal = new ModalWithImage(document.querySelector('.popup_type_image'), events);
  const userModal = new ModalWithForm(document.querySelector('.popup_type_edit'), events);
  const cardModal = new ModalWithForm(document.querySelector('.popup_type_new-card'), events);
  const avatarModal = new ModalWithForm(document.querySelector('.popup_type_edit-avatar'), events);
  const confirmModal = new ModalWithConfirm(document.querySelector('.popup_type_remove-card'), events);
  
  const cardTemplate: HTMLTemplateElement =
    document.querySelector('.card-template');
  
    const cardsContainer = new CardsContainer(
      document.querySelector('.places__list')
    );
  
  events.onAll((event) => {
      console.log(event.eventName, event.data)
  })
  
  // Получаем карточки с сервера
  Promise.all([api.getUser(), api.getCards()])
    .then(([userInfo, initialCards]) => {
      userData.setUserInfo(userInfo);
      cardsData.cards = initialCards;
      events.emit('initialData:loaded');
    })
    .catch((err) => {
      console.error(err);
    });
  
  events.on('initialData:loaded', () => {
    const cardsArray = cardsData.cards.map((card) => {
      const cardInstant = new Card(cloneTemplate(cardTemplate), events);
      return cardInstant.render(card, userData.id);
    });
  
    cardsContainer.render({ catalog: cardsArray });
    userView.render(userData.getUserInfo());
  });
  
  events.on('avatar:open', () => {
    avatarModal.open();
  })
  
  events.on('newCard:open', () => {
    cardModal.open();
  })
  
  events.on('userEdit:open', () => {
    const {name, about} = userData.getUserInfo();
    const inputValues = {userName: name, userDescription: about};
    userModal.render({inputValues})
    userModal.open();
  })
  
  events.on('card:select', (data: { card: Card }) => {
    const { card } = data;
    const {name, link} = cardsData.getCard(card._id);
    const image = {name, link}
    imageModal.render({image})
  }); */
















