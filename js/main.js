const ctnCountries = document.getElementById('ctn-countries');
const formFilter = document.querySelector('.filter');
const inputSarch = formFilter.searchCountry;
const selectRegion = formFilter.selectRegion;
const dataCountry = getAllDataCountries();
const btnDark = document.getElementById('btn-dark-mode');
const btnBackModal = document.getElementById('#btn-back');

dataCountry
    .then(data => addCountryinDOM(data))
    .catch(err => console.log(err))

/* Eventos */

document.querySelector('body').addEventListener('click', e => {
    if (e.target.id == 'btn-back') {
        document.querySelector('#modal').remove();
        document.querySelector('body').classList.remove('active-modal')
    }
})

formFilter.addEventListener('submit', e => e.preventDefault());

inputSarch.addEventListener('keyup', e => {
    const name = (inputSarch.value).toLowerCase();
    dataCountry
        .then(data => searchCountryName(data, name))
        .then(countries => addCountryinDOM(countries))
        .catch(console.log)
})

selectRegion.addEventListener('change', e => {
    const region = selectRegion.value.toLowerCase();
    dataCountry
        .then(data => searchCountriesRegion(data, region))
        .then(countries => addCountryinDOM(countries))
        .catch(console.log)
});

btnDark.addEventListener('click', _ => {
    btnDark.classList.toggle('active');
    document.querySelector('.fa-moon').classList.replace('far', 'fas');
    document.querySelector('body').classList.toggle('active');
    if (!document.querySelector('body').classList.contains('active')) {
        document.querySelector('.fa-moon').classList.replace('fas', 'far');
    }
});

ctnCountries.addEventListener('click', e => {
    if (e.target.className == 'img-country') {
        const name = e.target.parentElement.querySelector('.name-country').textContent.toLowerCase();
        dataCountry
            .then(data => searchCountryName(data, name))
            .then(data => createModal(data))
            .catch(console.log)
    }
});

// obtener toda la informacion
async function getAllDataCountries() {
    try {
        const consulta = await fetch('https://restcountries.eu/rest/v2/all');
        const data = await consulta.json();
        return data;
    } catch (e) {
        console.error(e)
    }
}
function addCountryinDOM(countries) {
    if (Array.isArray(countries)) {
        const fragment = document.createDocumentFragment();
        let cont = 0;
        ctnCountries.innerHTML = '';
        countries.forEach(country => {
            const div = document.createElement('DIV');
            div.classList.add('card-country');
            div.innerHTML = `
                <img class="img-country" src="${country.flag}" alt="flag ${country.name}">
                <div class="body-country">
                    <h2 class="name-country">${country.name}</h2>
                    <p><strong>Population: </strong>${country.population}</p>
                    <p><strong>Region: </strong>${country.region}</p>
                    <p><strong>Capital: </strong>${country.capital}</p>
                </div>
            `;
            fragment.appendChild(div);
            cont++;
        })
        console.log('Total registros ' + cont);
        ctnCountries.appendChild(fragment);
    }
}
function searchCountryName(countries, name) {
    const data = countries.filter(country => {
        const nameCountry = (country.name).toLowerCase();
        if (nameCountry.indexOf(name) != -1) {
            return countries;
        }
    });
    return data;
}
function searchCountriesRegion(countries, region) {
    return countries.filter(country => (country.region).toLowerCase() == region);
}
function searchCountriesalpha3Code(countries, alpha) {
    return countries.filter(country => (country.alpha3Code) == alpha);
}
let aux
async function createModal(countries) {
    document.querySelector('body').classList.add('active-modal')
    const divModal = document.createElement('DIV');
    divModal.classList.add('modal');
    divModal.setAttribute('id', 'modal')
    countries.forEach(country => {
        let lenguajes = '' 
        let borders = ''

        country.languages.forEach(lenguaje => lenguajes+=lenguaje.name+', ')
        lenguajes = lenguajes.slice(0, lenguajes.length-2);
        country.borders.forEach(border =>{
            borders += `<span class="border">${border}</span>`;
        })
        divModal.innerHTML = `
        <div class="modal">
            <button class="btn-back" id="btn-back"><i class="fas fa-long-arrow-alt-left"> </i> Back</button>
            <div class="modal__contenido">
                <img class="modal__img" src="${country.flag}" alt="">
                <div class="information_country">
                    <h2>${country.name}</h2>
                    <div class="information_country__character">
                        <p><strong>Native Name: </strong>${country.nativeName}</p>
                        <p><strong>Top level Domain: </strong>${country.topLevelDomain}</p>
                        <p><strong>Population: </strong>${country.population}</p>
                        <p><strong>Currencies: </strong>${country.currencies[0].name}</p>
                        <p><strong>Region: </strong>${country.region}</p>
                        <p><strong>Languajes: </strong>${lenguajes}</p>
                        <p><strong>Sub Region: </strong>${country.subregion}</p>
                        <p><strong>Capital: </strong>${country.capital}</p>
                    </div>
                    <div class="border-countries">
                        <p><strong>Border Countries: </strong></p>
                        <p class="borders">${borders}</p>
                    </div>
                </div>
            </div>
        </div>`
    })
    document.querySelector('body').appendChild(divModal);
}
