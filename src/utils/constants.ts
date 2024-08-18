// API_URL - используется для запросов данных о товарах и отправки заказа
export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
// CDN_URL - используется для формирования адреса картинки в товаре.
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
  
};


export const constraintsAddress = {
	address: {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
		length: {
			minimum: 2,
			maximum: 40,
      tooShort: "^Слишком короткое имя, необходимо %{count} буквы или больше",
      tooLong: "^Слишком длинное имя, необходимо %{count} букв или меньше",
		},
		format: {
			pattern: /^[a-zA-Zа-яА-ЯёЁ\- ]+$/,
			message:
				'^Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы',
		}
	}
};

export const constraintsMail = {
	email: {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
		url: {message: '^Некорректный адрес'},
	},
}

export const constraintsPhone = {
	phone: {
		presence: { message: '^Поле не может быть пустым', allowEmpty: false },
		length: {
			minimum: 6,
			maximum: 11,
      tooShort: "^Слишком короткое имя, необходимо %{count} буквы или больше",
      tooLong: "^Слишком длинное имя, необходимо %{count} букв или меньше",
		},
		format: {
			pattern: /^[0-9\- ]+$/,
			message:
				'^Разрешены только цифры',
		},
	},
};
 