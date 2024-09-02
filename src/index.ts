import './scss/styles.scss';

import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { CardsData } from './components/CardsData';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { ModalBasket } from './components/common/ModalBasket';

import { TValidationInfo, ICard, TСontactsForm } from './types';
import { OrderAddress } from './components/OrderAddress';
import { OrderContacts } from './components/OrderContacts';
import { Success } from './components/Success';
import { testItemCard3 } from './utils/tempConstants';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
});

// Все шаблоны
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const addressTemplate = ensureElement<HTMLTemplateElement>('#order');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const cardsData = new CardsData(events);


// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса

const modalbasket = new ModalBasket(cloneTemplate(basketTemplate), events);

const orderAddress = new OrderAddress(cloneTemplate(addressTemplate), events); // order
const orderContacts= new OrderContacts(cloneTemplate(contactsTemplate), events); // order

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = cardsData.catalog.map((item) => {
    const card = new Card(cloneTemplate(cardCatalogTemplate));
    
    return card.render({
      title: item.title,
      image: item.image,
            
      
    });
  });
});

// Отправлена форма заказа
events.on('order:submit', () => {
  api
    .orderCards(cardsData.order)
    .then((result) => {
      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
          modal.close();
          cardsData.clearBasket();
          events.emit('auction:changed');
        },
      });

      modal.render({
        content: success.render({}),
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<TСontactsForm>) => {
  const { email, phone } = errors;
  orderContacts.valid = !email && !phone;
  orderContacts.errors = Object.values({ phone, email })
    .filter((i) => !!i)
    .join('; ');
});

// Изменилось одно из полей
events.on(
  /^order\..*:change/,
  (data: { field: keyof TСontactsForm; value: string }) => {
    cardsData.setOrderField(data.field, data.value);
  }
);

// Открыть форму заказа
events.on('order:open', () => {
  modal.render({
    content: orderContacts.render({
      phone: '',
      email: '',
      valid: false,
      errors: [],
    }),
  });
});

// Открыть лот
events.on('card:select', (item: ICard) => {
  cardsData.setPreview(item);
});

// Получаем лоты с сервера
api.getCardList()
  .then(cardsData.setCatalog.bind(cardsData))
  .catch((err) => {
    console.error(err);
  });
