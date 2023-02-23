const container = document.querySelector('.container');
const inputText = container.querySelector('.input-text');
const postsList = container.querySelector('.posts-list');
const errorModal = container.querySelector('.error-modal');
const errorMessage = container.querySelector('.error-message');
const form = container.querySelector('.form');
const inputLocation = container.querySelector('.input-location');
const cancelButton = container.querySelector('.cancel-button');

const now = new Date();
const year = now.getFullYear();
const month = showCorrectDate(now.getMonth() + 1);
const day = showCorrectDate(now.getDate());
const hours = showCorrectDate(now.getHours());
const minutes = showCorrectDate(now.getMinutes());

let latitude;
let longitude;

const posts = [];

//!Серверную часть и загрузку также реализовывать не нужно, храните всё в памяти
function save(arr) {
	localStorage.editorData = JSON.stringify({
		arr,
	});
}

function restore() {
	const json = localStorage.editorData;

	if (!json) {
		return;
	}

	const data = JSON.parse(json);

	//console.log(data.arr);
	//console.log(data.arr.length);

	for (let i = 0; i < data.arr.length; i++) {
		//console.log(data.arr[i]);

		const li = document.createElement('li');
		li.classList.add('post');
		li.innerHTML = `
		<div class="post-header">
			<span class="date">${data.arr[i].day}.${data.arr[i].month}.${data.arr[i].year}</span>
			<span class="time">${data.arr[i].hours}:${data.arr[i].minutes}</span>
		</div>
		<p>${data.arr[i].text}</p>
		<span class="geolocation">[${data.arr[i].latitude}, ${data.arr[i].longitude}]</span>
		`;

		postsList.prepend(li);

		posts.push(data.arr[i]);
	}
}

window.onload = function() {
	//console.log(posts);
	restore();
};

//!получаем геолокацию
navigator.geolocation.getCurrentPosition(
	function (position) {
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
	},
	function () {
		errorModal.classList.add('showed');

		cancelButton.addEventListener('click', () => {
			errorModal.classList.remove('showed');
		});

		form.addEventListener('submit', (e) => {
			e.preventDefault();

			if (inputLocation.value !== '') {
				getUserGeolocation(inputLocation.value, inputLocation);
			}
		});
	},
);

//!добавляем новый пост
document.addEventListener('keyup', (e) => {

	if (e.key === 'Enter' && inputText.value !== '') {
		//console.log(inputText.value);

		const li = document.createElement('li');
		li.classList.add('post');
		li.innerHTML = `
		<div class="post-header">
			<span class="date">${day}.${month}.${year}</span>
			<span class="time">${hours}:${minutes}</span>
		</div>
		<p>${inputText.value}</p>
		<span class="geolocation">[${latitude}, ${longitude}]</span>
		`;

		postsList.prepend(li);

		//!Серверную часть и загрузку также реализовывать не нужно, храните всё в памяти
		posts.push({
			day,
			month,
			year,
			hours,
			minutes,
			text: inputText.value,
			latitude,
			longitude,
		});
		//console.log(posts);

		save(posts);

		inputText.value = '';
	}
});

function showCorrectDate(number) {
	if (number < 10) {
		return `0${number}`;
	}

	return number;
}

//! пользовательский ввод геолокации
export default function getUserGeolocation(str, input) {
	const regex = /^(\[?-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?\]?)$/;

	const match = regex.exec(str);

	if (match) {
		if (match[1].startsWith('[')) {
			match[1] = match[1].substring(1);
		}
		latitude = parseFloat(match[1]);
		longitude = parseFloat(match[2]);
		console.log(latitude, longitude);

		errorModal.classList.remove('showed');

		console.log(form.checkValidity());
	} else {
		console.log('Invalid coordinates');

		input.setCustomValidity('Введите корректные координаты!');

		input.classList.add('invalid');

		errorMessage.classList.remove('hidden');

		console.log(form.checkValidity());
	}
}
