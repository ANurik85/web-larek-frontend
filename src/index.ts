import './scss/styles.scss';

import { AppApi } from "./components/AppApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/events";
import { CardsData, CardItem } from "./components/CardsData";
import { Page } from "./components/Page";
import { Card } from "./components/Card";
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
import { Modal } from "./components/common/Modal";
import {/* Basket */ BasketItemView, BasketView } from "./components/BasketView";
import { IFormAddress, IFormContacts, IOrder } from "./types";
import { Order } from "./components/Order";
import { Success } from "./components/Success";
import { BasketModel } from './components/BasketModel';
import { CatalogModel } from './components/BasketData';
import { OrderAddress } from './components/OrderAddress';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

// // Чтобы мониторить все события, для отладки
// events.onAll(({ eventName, data }) => {
//     console.log(eventName, data);
// })

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

// Переиспользуемые части интерфейса
// const basket = new Basket(cloneTemplate(basketTemplate), events);

const order = new Order(cloneTemplate(orderContactsTemplate), events);
const orderAddress = new OrderAddress(cloneTemplate(orderAddressTemplate), events);

// инициализация
//   const basketItemView = new BasketItemView(cloneTemplate(cardBasketTemplate), events);
const basketView = new BasketView(document.querySelector('.basket'));


const basketModel = new BasketModel(events);
const catalogModel = new CatalogModel();
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
events.on('formErrors:change', (errors: Partial<IOrder>) => {
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
events.on(/^order\..*:change/, (data: { field: keyof IOrder, value: string }) => {
    cardsData.setOrderField(data.field, data.value);
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


// const basketItemView = new BasketItemView(cloneTemplate(cardBasketTemplate), events);

// events.on('basket:add', (event: { id: string }) => {
//     const cardId = event.id;

//     const cardItem = cardsData.getCardItem(cardId);
//     if (cardItem) {
//       const { ...cardData } = cardItem;
//       basketItemView.items.push(cardItem);
//       // basketItemView.updateItems(); // Обновить список карточек в корзине
//       // console.log('Карточка добавлена в корзину:', cardItem);
//       // console.log('Содержимое корзины:', basketItemView.items.length);
//       modal.close(); // Закрыть модальное окно
//     }
//   });

// // Открыть карточки
// events.on('basket:open', () => {
//   const basketView = new BasketView(cloneTemplate(basketTemplate));
//   const basketItems = basketModel.getItems();

//   basketItems.forEach((item) => {
//     const basketItemView = new BasketItemView(cloneTemplate(cardBasketTemplate), events);
//     basketItemView.render({ id: item.id, title: catalogModel.getProduct(item.id).title });
//     basketView.container.appendChild(basketItemView.container);
//   });

//   modal.render({
//     content: basketView.render({ items: basketItems.map((item) => basketItemView.container) }),
//   });
// });


// Открыть выбранный карточки
events.on('card:select', (item: CardItem) => {
    const showItem = (item: CardItem) => {
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


// --------------------------------------------------------


// events.on('basket:change', (data: { items: string[] }) => {
//     // выводим куда-то
//   });

// //   можно собрать в функции или классы отдельные экраны с логикой их формирования
//   function renderBasket(items: string[]) {
//     basketView.render({
//         items: items.map(id => {
//           const itemView = new BasketView(cloneTemplate(cardBasketTemplate));
//           return itemView.render(catalogModel.getProduct(id));
//         }),

//       });
//   }

// // при изменении рендерим
// events.on('basket:change', (event: { items: string[] }) => {
//   renderBasket(event.items);
// });

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
    .then(catalogModel.setItems.bind(catalogModel))
    .catch(err => {
        console.error(err);
    });
