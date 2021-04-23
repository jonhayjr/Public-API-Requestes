  
// global variables
let employees = [];
const urlAPI = 'https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US';

//This function displays API data on the page
const displayEmployees = (employeeData) => {
    const gallery = document.getElementById('gallery');
    employees = employeeData;
    // store the employee HTML as we create it
    let employeeHTML = '';
    // loop through each employee and create HTML markup
    employees.forEach((employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let state = employee.location.state;
        let picture = employee.picture;
    //Adds HTML content based on API data
    employeeHTML += `
    <div class="card" data-index="${index}" data-employee="${name.first} ${name.last}">
    <div class="card-img-container">
        <img class="card-img" src="${picture.large}" alt="${name.first} ${name.last}">
    </div>
    <div class="card-info-container">
        <h3 id="name" class="card-name cap">${name.first} ${name.last}</h3>
        <p class="card-text">${email}</p>
        <p class="card-text cap">${city}, ${state}</p>
    </div>
    </div>`
    });
    //Adds HTML to gallery element
    gallery.insertAdjacentHTML('beforeEnd', employeeHTML);
}

//This function displays a custom error message if their is a problem with the API request
const displayError = (err) => {
    const gallery = document.getElementById('gallery');
    let errorHTML = '<div class="error"><p>Sorry, something went wrong.  Please refresh the page and try again.</p><img src="img/error.png"></div>';
    //Adds error HTML to gallery element
    gallery.insertAdjacentHTML('beforeEnd', errorHTML);
}


//Fetch data from API and displayEmployees function to display data on screen
fetch(urlAPI)
    .then(res => res.json())
    .then(res => res.results)
    .then(displayEmployees)
    .catch(err => displayError(err))

//Adds Modal Container to page and hides it
const addModalContainer = () => {
    const div = document.createElement('div');
    div.className = 'modal-container';
    div.style.display = 'none';
    document.getElementById('gallery').insertAdjacentElement('afterend', div);
}

const displayModal = (index) => {
    //Checks if modal container already exists.  If it doesn't, it is added to the page.
    const modalDiv = document.querySelector('.modal-container');
    if (!modalDiv) {
        addModalContainer();
    }
    // use object destructuring make our template literal cleaner
    let { name, dob, phone, email, location: { city, street, state, postcode
    }, picture } = employees[index];
    //Formats birthdate
    let date = new Date(dob.date);
    let dateMonth = (date.getMonth() + 1).toString().padStart(2, "0"); //Adds one to value since it's zero based and pads with 0
    let dateDay = date.getDate().toString().padStart(2, "0"); //Pads with 0
    let dateYear = date.getFullYear().toString().substr(-2); //Only Includes last two digits of year
    //Formats phone number
    let phoneFormatted = phone.toString().replace('-', ' ');
    const modalContainer = document.querySelector('.modal-container');

    //Create HTML element based on API data
    const modalHTML = `
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container" data-index="${index}">
                        <img class="modal-img" src="${picture.large}" alt="${name.first} ${name.last}">
                        <h3 id="name" class="modal-name cap">${name.first} ${name.last}</h3>
                        <p class="modal-text">${email}</p>
                        <p class="modal-text cap">${city}</p>
                        <hr>
                        <p class="modal-text">${phoneFormatted}</p>
                        <p class="modal-text">${street.number} ${street.name}, ${state}, ${postcode}</p>
                        <p class="modal-text">Birthday: ${dateMonth}/${dateDay}/${dateYear}</p>
                    </div>
                </div>

                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>`;
    //Update Modal Container HTML to Modal HTML
    modalContainer.innerHTML = modalHTML;
    //Unhides Modal Container
    modalContainer.style.display = '';
}

//Function to add searchbar HTML to the page
const addSearchBar = () => {
    const searchContainer = document.querySelector('.search-container');
    const HTML =
    `<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;
    searchContainer.insertAdjacentHTML('afterend', HTML);
}

//Runs addSearchBar function
addSearchBar();

//Adds employee search logic
const employeeSearch = () => {
    const searchBar = document.getElementById('search-input');
    const cards = document.querySelectorAll('.card');
    const searchInput = searchBar.value.toLowerCase();
    const searchInputLength = searchInput.length;

    //Loops through each employee card
    cards.forEach(card => {
        //Pulls employee name from data-employee attribute
        let employeeName = card.getAttribute('data-employee').toLowerCase(); 
        //If the employee name contains the search input text, then it is displayed.  If not, it is hidden.
        if (employeeName.indexOf(searchInput) >= 0) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    })
}

//Add event listener on the search form that checks for submit
document.querySelector('form').addEventListener('submit', employeeSearch);

//Adds event listener to gallery element
document.getElementById('gallery').addEventListener('click', e => {
    //Select the card element based on its proximity to actual element clicked
    const card = e.target.closest('.card');
    //Grab index from data-index attribute
    const index = card.getAttribute('data-index');
    //Pass index into displayModal function
    displayModal(index);
});

//Add event listener to body and check to see if modal close button was clicked
document.querySelector('body').addEventListener('click', (e) => {
    if (e.target.parentElement.id === 'modal-close-btn') {
        const modalContainer = document.querySelector('.modal-container');
        modalContainer.style.display = 'none';
    }
});


//Add event listener to the body and check to see if previous button was clicked
document.querySelector('body').addEventListener('click', (e) => {
    if (e.target.id === 'modal-prev') {
        const modalElement = document.querySelector('.modal-info-container');
        //Gets current element index.
        const currentIndex = parseInt(modalElement.getAttribute('data-index'));
        //Gets previous index by subtracting one from current index
        const previousIndex = currentIndex - 1;
        //Checks to make sure that index is greater than one. If it is, the modal is displayed.
        if (previousIndex >= 0) {
            displayModal(previousIndex);
        }
    }
});

//Add event listener to check to see if next button was clicked
document.querySelector('body').addEventListener('click', (e) => {
    if (e.target.id === 'modal-next') {
        const modalElement = document.querySelector('.modal-info-container');
        const cards = document.querySelectorAll('.card');
        //Gets the max index based on the total number of employee cards minus one
        const maxIndex = cards.length - 1;
        //Gets the index from the current element
        const currentIndex = parseInt(modalElement.getAttribute('data-index'));
        //Gets next index by adding one to the current index
        const nextIndex = currentIndex + 1;
        //Checks to make sure that the next index is great than or equal to the max index.  If it is, the modal is displayed.
        if (nextIndex <= maxIndex) {
            displayModal(nextIndex);
        }
    }
})