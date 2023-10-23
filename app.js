const cards = document.querySelector('.cards');
const modal = document.querySelector('.modal');
const modalBox = document.querySelector('.modal__box');
const inputName = document.querySelector('.input-name');
let moreBtns = [];

const url = 'https://rickandmortyapi.com/api';
const defaultFilterOption = {
    species: '',
    gender: '',
    status: '',
}

async function getData({species, gender, status}, page = 1, name = inputName.value) {

    //await - пока запрос не будет выполнен, функция не продолжит работать дальше
    const res = await fetch(`${url}/character/?name=${name}&species=${species}&gender=${gender}&status=${status}&page=${page}`);

    if(!res.ok) {       //ok - св-во, которое показывает, успешно ли произошёл запрос на сервер
        cards.innerHTML = `<p class="fail">No results :(</p>`;
        count = 1;
        throw new Error();
    }

    return res.json();
}

async function sendRequest() {
    getData(defaultFilterOption)
.then(data => {
    cards.innerHTML = '';
    inputPageNum.value = '1';
    count = 1;

    renderCards(data);
})
}
sendRequest();


let count = 1;
const arrowBtns = document.querySelectorAll('.arrow-btn');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const inputPageNum = document.querySelector('.page-num');


function changePage (page) {
    getData(defaultFilterOption, page).then((data) => {
        cards.innerHTML = '';

        renderCards(data);
    })
}

let resetPagenation = () => {
    count = 1;
    page.classList.add('hidden');
}

let showPagenation = () => {
    count = 1;
    page.classList.remove('hidden');
}

arrowBtns.forEach(arrowBtn => {
    arrowBtn.addEventListener('click', (e) => {
        console.log(e.composedPath())
        if(e.composedPath().includes(prevBtn)) {
            if(count > 1) {
                inputPageNum.value = --count;
                changePage(count);
            }
        }
        if(e.composedPath().includes(nextBtn)) {
                inputPageNum.value = ++count;
                changePage(count);
        }
    })
})


inputPageNum.addEventListener('input', () => {
    count = inputPageNum.value;
    changePage(inputPageNum.value);
})


//Сгенерировать карточки
function renderCards(data) {
    data.results.forEach(item => {
        cards.innerHTML += `<div class="card">
        <img class="card-img" src='${item.image}' alt="">
        <h3 class="card-title">${item.name}</h3>
        <p class="location">${item.location.name}</p>
        <button class="more-btn">More</button>
    </div>`
    })

    moreBtns = document.querySelectorAll('.more-btn');

        moreBtns.forEach((moreBtn, index) => {          //При клике на more открывать модальное окно с описанием персонажа
            moreBtn.addEventListener('click', () => {
                modal.classList.add('open');
                modal.querySelector('.modal-img').setAttribute('src', data.results[index].image);
                modal.querySelector('.table-date-status').textContent = data.results[index].status;
                modal.querySelector('.table-date-gender').textContent = data.results[index].gender;
                modal.querySelector('.table-date-species').textContent = data.results[index].species;
                modal.querySelector('.table-date-location').textContent = data.results[index].location.name;
            })
        })
}



//Сортировка персонажей
const filterBySpecies = document.querySelector('#species');
const filterByGender = document.querySelector('#gender');
const filterByStatus = document.querySelector('#status');

filterBySpecies.addEventListener('change', (e) => {
    defaultFilterOption.species = e.target.value;
    sendRequest();
})

filterByGender.addEventListener('change', (e) => {
    defaultFilterOption.gender = e.target.value;
    sendRequest();
})

filterByStatus.addEventListener('change', (e) => {
    defaultFilterOption.status = e.target.value;
    sendRequest();
})


//Поиск персонажа по имени
    inputName.addEventListener('change', () => {
        sendRequest();
    })



//При клике на крестик закрывать модальное окно
modal.querySelector('.close-btn').addEventListener('click', () => {
    modal.classList.remove('open');
})

//При нажатии на escape закрывать модальное окно
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') modal.classList.remove('open');
})

//При клике вне модального окна закрывать его
    document.addEventListener('click', (e) => {
        const withinBoundaries = e.composedPath().includes(modalBox);

            if(!withinBoundaries) modal.classList.remove('open');
            if(e.target.classList.value === 'more-btn') modal.classList.add('open');
    })


document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
    })
})


const scrollElement = document.querySelector('.scroll');
const scrollBtn = document.querySelector('.scroll__button');

window.addEventListener('scroll', (e) => {
    const scrollY = window.scrollY;
    if(scrollY > document.documentElement.clientHeight) {
        scrollElement.classList.add('visible');
    } else {
        scrollElement.classList.remove('visible');
    }
})

scrollBtn.addEventListener('click', (e) => {
    e.preventDefault();

    let href = document.querySelector('.sccroll-link').getAttribute('href').substring(1);
    const scrollTarget = document.getElementById(href);

    scrollTarget.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});