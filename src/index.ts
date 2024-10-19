import './scss/styles.scss';

import { AppApi } from "./components/AppApi";
import { API_URL, CDN_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/events";
import { CardsData } from "./components/CardsData";
import { Page } from "./components/Page";
import { Card } from "./components/Card";
import { cloneTemplate, createElement, ensureElement } from "./utils/utils";
import { Modal } from "./components/common/Modal";
import { BasketView } from "./components/BasketView";
import { BasketItemView } from "./components/BasketItemView";
import { IFormAddress, IFormContacts, ICard } from "./types";
import { Order } from "./components/Order";
import { Success } from "./components/Success";
import { BasketModel } from './components/BasketModel';
import { BasketCatalogModel } from './components/BasketCatalogModel';
import { OrderAddress } from './components/OrderAddress';
import { OrderModel } from './components/OrderModel';

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
const order = new Order(cloneTemplate(orderContactsTemplate), events);
const orderAddress = new OrderAddress(cloneTemplate(orderAddressTemplate), events);
const basketModel = new BasketModel(events);
const basketCatalogModel = new BasketCatalogModel();
const basketItemView = new BasketItemView(cloneTemplate(cardBasketTemplate), events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderModel = new OrderModel(events, basketModel);
// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

events.on('items:changed', () => {
    const cardsArray = cardsData.catalog.map((item) => {
        const cardContainer = cloneTemplate(cardCatalogTemplate);
        const cardInstance = new Card(cardContainer, events);
        cardInstance.render(item);

        cardContainer.addEventListener('click', () => {
            events.emit('card:select', item);
        });

        return cardContainer;
    });

    page.render({ catalog: cardsArray });
    // Обновление счетчика корзины
    const itemCount = basketModel.getItemCount();
    page.counter = itemCount;
    
});



// const orderForm = new Order(document.querySelector('.contacts') as HTMLFormElement, events);
// const addressForm = new OrderAddress(document.querySelector('.order') as HTMLFormElement, events);

// Отправлена форма заказа
events.on('order:submit', (finalOrderData: any) => {

    // events.on('order:submit', (orderData: Partial<IOrderContacts> & Partial<IOrderAddress>) => {
    //     const basketModel = new BasketModel(events);
    //     const total = basketModel.calculateTotal();
    //     const items = basketModel.getItems().map(item => item.id);
      
    //     const finalOrderData = {
    //       ...orderData,
    //       total,
    //       items
    //     };
      
    api.orderCards(finalOrderData)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    basketModel.clearBasket();
                    events.emit('order:success');
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
events.on('formErrors:change', (errors: Partial<IFormContacts>) => {
    const { email, phone } = errors;
    order.valid = !email && !phone;
    order.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IFormAddress>) => {
    const { address, paymentMethod } = errors;
    orderAddress.valid = !address && !paymentMethod;
    orderAddress.errors = Object.values({ address, paymentMethod }).filter(i => !!i).join('; ');
    if (!paymentMethod) {
        orderAddress.paymentMethod = 'card'; // или 'cash'
    }
});

// Изменилось одно из полей
events.on(/^contacts\..*:change/, (data: { field: keyof IFormContacts, value: string }) => {
    order.setOrderField(data.field as keyof IFormContacts, data.value);
});

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IFormAddress, value: string }) => {
    orderAddress.setAddressField(data.field as keyof IFormAddress, data.value);
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

events.on('basket:add', (event: { id: string }) => {
    const cardId = event.id;
    if (!cardId) {
        return;
    }
    // Проверка, есть ли карточка в корзине
    const isCardInBasket = basketView.items.some(item => item.getId() === cardId);
    if (isCardInBasket) {
        return;
    }
    const cardItem = cardsData.getCardItem(cardId);
    const basketItem = new BasketItemView(cloneTemplate(cardBasketTemplate), events);
    basketItem.render(cardItem);
    basketView.items.push(basketItem);
    // Обновление порядковых номеров после добавления карточки
    basketView.items.forEach((item, index) => {
        item.setIndexNumber(index + 1);
    });
    modal.close();
    const card = { id: cardId, title: cardItem.title, price: cardItem.price };
    const result = basketModel.addToBasket(card);
    basketModel.updateItemCount();

});

// Открыть корзину
events.on('basket:open', () => {
    // Преобразуем каждый элемент в items в HTMLElement
    const itemsAsHtmlElements = basketView.items.map(item => item.getElement());
    modal.render({
        content: basketView.render({
            items: itemsAsHtmlElements
        })
    });

});


// Открыть выбранный карточки
events.on('card:select', (item: ICard) => {
    const showItem = (item: ICard) => {
        const card = new Card(cloneTemplate(cardPreviewTemplate), events);
        const modalContent = card.render({...item});

        modal.render({ content: modalContent });

    
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


events.on('basket:remove', (event: { id: string }) => {
    const cardId = event.id;
    basketModel.removeCard(cardId);

    // Обновляем представление корзины после удаления одного элемента
    basketView.items = basketView.items.filter(item => item.getId() !== cardId);

    // Рендерим обновленную корзину
    const itemsAsHtmlElements = basketView.items.map(item => item.getElement());
    modal.render({
        content: basketView.render({ items: itemsAsHtmlElements })
    });

});

// Получаем список карточки с сервера
api.getCardList()
    .then(cardsData.setCatalog.bind(cardsData))
    .then(basketCatalogModel.setItems.bind(basketCatalogModel))
    .catch(err => {
        console.error(err);
    });
