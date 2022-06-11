// select item
const alert = document.querySelector(".alert");
const input = document.querySelector(".input-form");
const submit = document.querySelector(".submit-btn");
const form = document.querySelector(".form");
const clear_btn = document.querySelector(".clear-items");
const list_items = document.querySelector(".grocery-lists");
const list_section = document.querySelector(".grocery-section");

// variables
let editflag = false;
let editId = "";
let editElement;

// eventlistener
form.addEventListener("submit", addItems);
clear_btn.addEventListener("click", clearitems);
window.addEventListener("DOMContentLoaded", check);

// function add items to the list
function addItems(e) {
	e.preventDefault();
	let value = input.value;
	const id = new Date().getTime().toString();
	if (value && !editflag) {
		//add items call function
		loaditems(id, value);
		// alert function call
		notification("items have been added", "success");
		//add to local storage
		addToLocalStorage(id, value);
		//set back to default
		setBackToDefault();
	} else if (value && editflag) {
		editElement.innerHTML = value;
		editlocalstorage(editId, value);
		setBackToDefault();
	} else {
		notification("please input something", "warning");
	}
}
//clear items

// alert function
function notification(text, classword) {
	alert.innerHTML = text;
	alert.classList.add("alert-" + classword);
	// timer for alert
	setTimeout(() => {
		alert.textContent = "";
		alert.classList.remove("alert-" + classword);
	}, 1000);
}

//set back to default
function setBackToDefault() {
	input.value = "";
	editflag = false;
	editId = "";
	submit.innerHTML = "submit";
}
//clear items function
function clearitems() {
	const items = document.querySelectorAll(".grocery-item");
	if (items.length > 0) {
		items.forEach((item) => {
			list_items.removeChild(item);
		});
	}
	list_section.classList.remove("groceryShowcase");
	notification("item has been removed", "warning");
	setBackToDefault();
	localStorage.removeItem("list");
}
//function delete item
function deleteitem(event) {
	const target = event.currentTarget.parentElement.parentElement;
	const id_value = target.dataset.id;
	list_items.removeChild(target);

	if (list_items.children.length === 0) {
		list_section.classList.remove("groceryShowcase");
	}
	setBackToDefault();
	removefromlocalstorage(id_value);

	notification("item has been removed", "warning");
}

//edit function
function edititem(event) {
	const article = event.currentTarget.parentElement.parentElement;
	editElement = event.currentTarget.parentElement.previousElementSibling;
	input.value = editElement.innerHTML;
	editflag = true;
	editId = article.dataset.id;
	submit.innerHTML = "Edit";
}

//function editlocalstorage
function editlocalstorage(id, value) {
	let mainstorage = getfromlocalstorage();
	mainstorage = mainstorage.map((obj) => {
		if (obj.id === id) {
			obj.value = value;
		}
		return obj;
	});
}

//addtolocalStorage
function addToLocalStorage(id, value) {
	const storage = { id, value };
	const mainstorage = getfromlocalstorage();
	mainstorage.push(storage);
	localStorage.setItem("list", JSON.stringify(mainstorage));
	console.log("added to storage");
}
//function getfromstorage
function getfromlocalstorage() {
	return localStorage.getItem("list")
		? JSON.parse(localStorage.getItem("list"))
		: [];
}
//function removefromlocalstorage
function removefromlocalstorage(id) {
	let mainstorage = getfromlocalstorage();

	mainstorage = mainstorage.filter((obj) => {
		if (obj.id !== id) {
			return obj;
		}
	});
	localStorage.setItem("list", JSON.stringify(mainstorage));
}

//checking if item is in localstorage and iterate through the list
function check() {
	let items = getfromlocalstorage();
	if (items.length > 0) {
		items.forEach((item) => {
			console.log(item.value);
			loaditems(item.id, item.value);
		});
	}
}

//add and load items
function loaditems(id, value) {
	// article adding when a value is submitted
	const article = document.createElement("article");
	// adding class to article just as before
	article.classList.add("grocery-item");
	// creating and adding attribute to article
	const data = document.createAttribute("data-id");
	data.value = id;
	article.setAttributeNode(data);
	article.innerHTML = `<p class="title">${value}</p>
		<div class="btn-container">
			<button type="button" class="btn-edit">
				<ion-icon name="create-outline"></ion-icon>
			</button>
			<button type="button" class="btn-delete">
				<ion-icon name="trash-outline"></ion-icon>
			</button>
		</div>`;
	list_items.appendChild(article);

	//making the grocery container visible after submiting

	list_section.classList.add("groceryShowcase");

	//delete button
	const deleteBtn = article.querySelector(".btn-delete");
	deleteBtn.addEventListener("click", deleteitem);

	//edit button
	const editbtn = article.querySelector(".btn-edit");
	editbtn.addEventListener("click", edititem);
}
