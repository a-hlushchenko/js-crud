// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
	static #list = [];

	constructor(email, login, password) {
		this.email = email;
		this.login = login;
		this.password = password;
	}

	static add = (user) => {
		this.#list.push(user);
	}

	static getList = () => {
		return this.#list;
	}
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {

	const list = User.getList();
  // res.render генерує нам HTML сторінку

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

	data: {
		users: {
			list,
			isEmpty: list.length === 0,
		}
	}
  })
  // ↑↑ сюди вводимо JSON дані
})

router.post('/user-create', function (req, res) {
	const {email, login, password} = req.body;

	const user = new User(email, login, password);

	User.add(user);
	
	console.log(User.getList());

  res.render('user-create', {
    style: 'user-create',
  })
})

// ================================================================

// Підключаємо роутер до бек-енду
module.exports = router
