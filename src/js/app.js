const container = document.querySelector('.container');
const inputText = container.querySelector('.input-text');
const postsList = container.querySelector('.posts-list');
const errorModal = container.querySelector('.error-modal');
const inputLocation = container.querySelector('.input-location');
const cancelButton = container.querySelector('.cancel-button');
const okButton = container.querySelector('.ok-button');

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

		okButton.addEventListener('click', () => {
			if (inputLocation.value !== '') {

				getUserGeolocation();

				errorModal.classList.remove('showed');
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

		//Серверную часть и загрузку также реализовывать не нужно, храните всё в памяти
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

//функция, которая будет обрабатывать пользовательский ввод координат
//при этом функция корректно должна обрабатывать следующие ситуации
//(и выводить объект содержащий широту и долготу):
//51.50851, −0.12572 (есть пробел)
//51.50851,−0.12572 (нет пробела)
//[51.50851, −0.12572] (есть квадратные скобки)
//При несоответствии формата функция должна генерировать исключение,
//которое должно влиять на валидацию поля (валидацию мы проходили).
export default function getUserGeolocation() {
	const coords = inputLocation.value.split(',');

	latitude = coords[0].trim();
	longitude = coords[1].trim();

	if (latitude.includes('[')) {
		latitude = latitude.substring(1);
	}

	if (longitude.includes(']')) {
		longitude = longitude.slice(0, -1);
	}

	console.log(latitude);
	console.log(longitude);
}
