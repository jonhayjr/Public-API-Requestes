  
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
 
    employeeHTML += `
    <div class="card">
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
    gallery.insertAdjacentHTML('beforeEnd', employeeHTML);
}

//This function displays a custom error message if their is a problem with the API request
const displayError = (err) => {
    const gallery = document.getElementById('gallery');
    let errorHTML = '<div class="error"><p>Sorry, something went wrong.  Please refresh the page and try again.</p><img src="img/error.png"></div>';
    gallery.insertAdjacentHTML('beforeEnd', errorHTML);
    console.log(err);
}



fetch(urlAPI)
    .then(res => res.json())
    .then(res => res.results)
    .then(displayEmployees)
    .catch(err => displayError(err))


