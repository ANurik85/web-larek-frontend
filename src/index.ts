import './scss/styles.scss';

import { AppApi } from "./components/AppApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/events";
import { CardsData } from "./components/CardsData";
import { Page } from "./components/Page";
import { Card } from "./components/Card";
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
import { Modal } from "./components/common/Modal";
import { BasketItemView, BasketView } from "./components/BasketView";
import { IFormAddress, IFormContacts, ICard } from "./types";
import { Order } from "./components/Order";
import { Success } from "./components/Success";
import { BasketModel } from './components/BasketModel';
import { BasketCatalogModel } from './components/BasketCatalogModel';
import { OrderAddress } from './components/OrderAddress';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderAddressTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const cardsData = new CardsData({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cardsContainer = new Page(document.querySelector('.gallery'), events);
const order = new Order(cloneTemplate(orderContactsTemplate), events);
const orderAddress = new OrderAddress(cloneTemplate(orderAddressTemplate), events);
const basketView = new BasketView(document.querySelector('.basket'));
const basketModel = new BasketModel(events);
const basketCatalogModel = new BasketCatalogModel();

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

events.on('items:changed', () => {
    const cardsArray = cardsData.catalog.map((item) => {
        const cardContainer = cloneTemplate(cardCatalogTemplate);
        const cardInstance = new Card(cardContainer, events);
        cardInstance.render({
            title: item.title,
            image: item.image,
            description: item.description,
            price: item.price,
            category: item.category,
        });

        cardContainer.addEventListener('click', () => {
            events.emit('card:select', item);
        });


        return cardContainer;
    });

    cardsContainer.render({ catalog: cardsArray });
    page.counter = cardsData.getTotal();
});


// Отправлена форма заказа
events.on('order:submit', () => {
    api.orderCards(cardsData.order)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    // cardsData.clearBasket();
                    events.emit('auction:changed');
                }
            });

            modal.render({
                content: success.render({})
            });
        })
        .catch(err => {
            console.error(err);
        });
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<(IFormAddress & IFormContacts)>) => {
    const { email, phone, address, paymentMethod } = errors;
    orderAddress.valid = !address && !paymentMethod;
    order.valid = !email && !phone;
    order.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
    orderAddress.errors = Object.values({ address, paymentMethod }).filter(i => !!i).join('; ');
    if (!paymentMethod) {
        orderAddress.paymentMethod = 'card'; // или 'cash'
    }
});

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof (IFormAddress & IFormContacts), value: string }) => {
    order.setOrderField(data.field as keyof IFormContacts, data.value);
});


// Открыть форму заказа способа оплаты
events.on('address:open', () => {
    modal.render({
        content: orderAddress.render({
            address: '',
            paymentMethod: '',
            valid: false,
            errors: []
        })
    });
});

// Открыть форму заказа контакты
events.on('order:open', () => {
    modal.render({
        content: order.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    });
});


const basketItemView = new BasketItemView(cloneTemplate(cardBasketTemplate), events);

events.on('basket:add', (event: { id: string }) => {
    const cardId = event.id;

    const ICard = cardsData.getCardItem(cardId);
    if (ICard) {
      const { ...cardData } = ICard;
      basketItemView.items.push(ICard);
      modal.close(); // Закрыть модальное окно
    }
  });


// Открыть выбранный карточки
events.on('card:select', (item: ICard) => {
    const showItem = (item: ICard) => {
        const card = new Card(cloneTemplate(cardPreviewTemplate), events);
        const modalContent = card.render({
            title: item.title,
            image: item.image,
            description: item.description,
            price: item.price,
            category: item.category,
        });

        modal.render({ content: modalContent });

        const addButton = modalContent.querySelector('.card__button');
        if (addButton) {
            addButton.addEventListener('click', () => {

                if (item.id) {
                    events.emit('basket:add', { id: item.id });

                } else {
                    console.error('Ошибка: id карточки не определен');
                }
            });

        }
    };

    if (item) {
        api.getCardItem(item.id)
            .then((result) => {
                item.description = result.description;
                showItem(item);
            })
            .catch((err) => {
                console.error(err);
            })
    } else {
        modal.close();
    }

});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

events.on('basket:change', (data: { items: string[] }) => {
    // выводим куда-то
  });


// при действиях изменяем модель, а после этого случится рендер 
events.on('ui:basket-add', (event: { id: string }) => {
    basketModel.add(event.id);
});

events.on('ui:basket-remove', (event: { id: string }) => {
    basketModel.remove(event.id);
});


// Получаем список карточки с сервера
api.getCardList()
    .then(cardsData.setCatalog.bind(cardsData))
    .then(basketCatalogModel.setItems.bind(basketCatalogModel))
    .catch(err => {
        console.error(err);
    });
