// merged by Claude Sonnet 5.5 Medium
// ===================== SHARED STATE =====================
let allMovies = [];
let selectedGenres = [];
let selectedMovie = null;

// ===================== SHARED HELPERS =====================

// Fetches any JSON file and returns a Promise of the parsed data
function fetchJSON(path) {
    return fetch(path).then(function(response) {
        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }
        return response.json();
    });
}

// Fetches movies.json and saves it into allMovies
function loadMovies() {
    return fetchJSON("json/movies.json").then(function(movies) {
        allMovies = movies;
        return movies;
    });
}

function getUnique(movies, key) {
    let values = new Set(); // sets automatically discard duplicate values

    for (let i = 0; i < movies.length; i++) {
        let value = movies[i][key];

        if (Array.isArray(value)) { // checks if property is an array or plain value
            for (let j = 0; j < value.length; j++) {
                values.add(value[j]);
            }
        } else {
            values.add(value);
        }
    }

    return Array.from(values).sort();
}

function fillDatalist(listId, items) {
    let list = document.getElementById(listId);
    for (let i = 0; i < items.length; i++) {
        let option = document.createElement("option");
        option.value = items[i];
        list.appendChild(option);
    }
}

function formatTime(iso) {
    return new Date(iso).toLocaleString("en-AU", {dateStyle: "medium", timeStyle: "short"});
}

// Used by the list page and the recommendation page
function displayMovieList(movies) {
    let status = document.getElementById("status");
    let listpage = document.getElementById("movieList");
    listpage.innerHTML = "";
    document.getElementById("movieInfo").hidden = true;

    for (let i = 0; i < movies.length; i++) {
        let poster = document.createElement("img");
        let title  = document.createElement("p");
        let item   = document.createElement("div");

        poster.src    = movies[i].image;
        poster.alt    = movies[i].title;
        
        title.textContent = movies[i].title + " (" + movies[i].year + ")";

        item.id = "movie_" + i;
        item.onclick = function() {
            displayMovie(movies[i]);
        };
        item.appendChild(poster);
        item.appendChild(title);

        listpage.appendChild(item);
    }

    listpage.hidden = false;
    status.textContent = "Loaded " + movies.length + " movies.";
}

// Used by the list page and the recommendation page
function displayMovie(movie) {
    document.getElementById("infoPoster").src               = movie.image;
    document.getElementById("infoPoster").alt = movie.title + " poster";
    document.getElementById("infoTitle").textContent        = movie.title;
    document.getElementById("infoGenre").textContent        = movie.genre.join(", ");
    document.getElementById("infoAgeRating").textContent    = movie.agerating;
    document.getElementById("infoRuntime").textContent      = movie.runtime;
    document.getElementById("infoViewpref").textContent     = movie.viewpref.join(", ");
    document.getElementById("infoDescription").textContent  = movie.description;
    document.getElementById("infoTicketPrices").textContent = "Standard: $" + movie.ticketprices.standard + " | Student: $" + movie.ticketprices.student + " | Gold: $" + movie.ticketprices.gold;

    let body = document.getElementById("screeningRows");
    body.innerHTML = ""; // clear old rows when switching movies

    for (let i = 0; i < movie.screenings.length; i++) {
        let s = movie.screenings[i];

        if (s.available) {
            let row = body.insertRow();
            row.insertCell().textContent = formatTime(s.time);
            row.insertCell().textContent = s.location;
        }
    }

    document.getElementById("movieInfo").hidden = false;

    // booking button
    // encodeURIComponent is needed for some movie titles that may not be safe in a URL
    document.getElementById("btnBook").href = "booking.html?movie=" + encodeURIComponent(movie.title);
}

// ===================== LIST PAGE =====================

function setupListPage() {
    let status = document.getElementById("status");
    document.getElementById("movieList").hidden = true;
    document.getElementById("movieInfo").hidden = true;
    status.textContent = "Loading JSON...";

    loadMovies()
        .then(function(movies) {
            displayMovieList(movies);
        })
        .catch(function(error) {
            document.getElementById("movieList").hidden = true;
            status.textContent = "Could not load JSON. Check the file and HTTP address. " + error.message;
        });
}

// ===================== RECOMMENDATION PAGE =====================

function createBoxes(groupName, title, items) {
    let prefBoxes = document.getElementById("prefBoxes");
    let area      = document.createElement("fieldset");
    let legend    = document.createElement("legend");

    area.id = groupName + "_pref";
    legend.textContent = title;
    area.appendChild(legend);

    for (let i = 0; i < items.length; i++) {
        let checkbox = document.createElement("input");
        let label    = document.createElement("label");
        let id       = groupName + "_" + items[i].replaceAll(" ", "-");

        checkbox.type  = "checkbox";
        checkbox.name  = groupName;
        checkbox.value = items[i];
        checkbox.id    = id;

        label.textContent = items[i];
        label.htmlFor     = id;

        area.appendChild(checkbox);
        area.appendChild(label);
    }

    prefBoxes.appendChild(area);
}

function createPref() {
    createBoxes("genre", "Genres", getUnique(allMovies, "genre"));
    createBoxes("viewpref", "Viewing Preferences", getUnique(allMovies, "viewpref"));
    createBoxes("rating", "Age Ratings", getUnique(allMovies, "agerating"));
}

function getChecked(groupName) {
    let ticked = document.querySelectorAll('input[name="' + groupName + '"]:checked');
    let values = [];

    for (let i = 0; i < ticked.length; i++) {
        values.push(ticked[i].value);
    }

    return values;
}

function applyFilters() {
    let genres    = getChecked("genre");
    let viewprefs = getChecked("viewpref");
    let ratings   = getChecked("rating");

    let result = allMovies.filter(function(movie) {
        let genresOK = genres.length === 0 || movie.genre.some(function(g) {
            return genres.includes(g);
        });
        let viewprefsOK = viewprefs.length === 0 || movie.viewpref.some(function(v) {
            return viewprefs.includes(v);
        });
        let ratingsOK = ratings.length === 0 || ratings.includes(movie.agerating);

        return genresOK && viewprefsOK && ratingsOK;
    });

    displayMovieList(result);
}

function setupRecPage() {
    let status = document.getElementById("status");
    document.getElementById("movieList").hidden = true;
    status.textContent = "Loading JSON...";

    loadMovies()
        .then(function(movies) {
            displayMovieList(movies);
            createPref();
        })
        .catch(function(error) {
            document.getElementById("movieList").hidden = true;
            status.textContent = "Could not load JSON. Check the file and HTTP address. " + error.message;
        });

    let btn = document.getElementById("btnApply");
    if (btn) {
        btn.onclick = applyFilters;
    }
}

// ===================== BOOKING PAGE =====================

function updateScreenings(title) {
    let body = document.getElementById("screeningRows");
    body.innerHTML = ""; // clear old rows
    document.getElementById("screeningChoice").value = ""; // clear screening choice value on movie update

    let queriedMovie = allMovies.find(function(m) {
        return m.title === title;
    });

    if (!queriedMovie) {
        return; // nothing selected
    } else {
        selectedMovie = queriedMovie;
    }

    for (let i = 0; i < queriedMovie.screenings.length; i++) {
        let s = queriedMovie.screenings[i];

        if (s.available) {
            let row = body.insertRow();
            let radio = document.createElement("input");

            radio.type  = "radio";
            radio.name  = "screening";
            radio.value = s.time + " - " + s.location;

            radio.onchange = function() {
                document.getElementById("screeningChoice").value = this.value;
            };

            row.insertCell().textContent = formatTime(s.time);
            row.insertCell().textContent = s.location;
            row.insertCell().appendChild(radio);
        }
    }

    updatePrice();
}

function updatePayment() {
    document.getElementById("voucherFill").hidden = !document.getElementById("voucher").checked;
    document.getElementById("onlineFill").hidden  = !document.getElementById("onlinepay").checked;
}

function updatePrice() {
    let priceBox = document.getElementById("ticketPrice");
    let ticket = document.getElementById("ticketType").value;
    let amount = Number(document.getElementById("ticketAmt").value.trim());

    if (!selectedMovie || !Number.isInteger(amount) || amount <= 0) {
        priceBox.textContent = "";   // nothing sensible to show yet
        return;
    }

    let total = selectedMovie.ticketprices[ticket] * amount;
    priceBox.textContent = "$" + total.toFixed(2);
}

function syncBilling() {
    let billing = document.getElementById("billing");

    if (document.getElementById("sameEmail").checked) {
        billing.value = document.getElementById("email").value;
        billing.readOnly = true;    // stops manual edits while ticked
    } else {
        billing.readOnly = false;
    }
}

function prefillMovie() {
    let params = new URLSearchParams(window.location.search);
    let title = params.get("movie");   // decoded for you; null if absent

    if (!title) return;   // user came straight to the booking page

    let exists = allMovies.some(function(m) {
        return m.title === title;
    });

    if (exists) {
        document.getElementById("movie").value = title;   // select the option
        updateScreenings(title);                          // load its screenings and price
    }
}

function setupBookingPage() {
    let status1 = document.getElementById("status1");
    status1.textContent = "Loading JSON...";

    document.getElementById("voucher").onchange = updatePayment;
    document.getElementById("onlinepay").onchange = updatePayment;

    loadMovies()
        .then(function(movies) {
            let select = document.getElementById("movie");

            for (let i = 0; i < movies.length; i++) {
                let item = document.createElement("option");
                item.value = movies[i].title;
                item.textContent = movies[i].title;
                select.appendChild(item);
            }

            status1.textContent = "";

            document.getElementById("btnMovieUpdate").onclick = function() {
                updateScreenings(document.getElementById("movie").value);
            };

            prefillMovie();   // last step, once options and allMovies exist
        })
        .catch(function(error) {
            status1.textContent = "Could not load movies JSON. Check the file and HTTP address. " + error.message;
        });
    
    // dynamically changes ticket price
    document.getElementById("ticketType").onchange = updatePrice;
    document.getElementById("ticketAmt").oninput = updatePrice;

    // syncs email and billing addresses
    document.getElementById("sameEmail").onchange = syncBilling;
    document.getElementById("email").oninput = syncBilling;   // keeps it in sync if the email changes later
    document.getElementById("bookform").onreset = function() {
        document.getElementById("screeningChoice").value = "";
        setTimeout(syncBilling, 0);   // makes it so syncbilling runs after the form has been reset
    };
    
    // error display and blocking event
    document.getElementById("bookform").onsubmit = function(event) {
    if (!validateBooking()) {
        event.preventDefault();
    }
};
}

// ===================== REGISTER PAGE =====================

function addGenre() {
    let input = document.getElementById("genreInput");
    let valid = getUnique(allMovies, "genre");
    let value = input.value.trim();

    // must be a real genre and not already selected
    if (valid.includes(value) && !selectedGenres.includes(value)) {
        selectedGenres.push(value);
        showSelectedGenres();
    }
    input.value = ""; // clear for the next pick
}

function showSelectedGenres() {
    let box = document.getElementById("selectedGenres");
    box.innerHTML = "";

    for (let i = 0; i < selectedGenres.length; i++) {
        let tag = document.createElement("span");
        tag.textContent = "[X] " + selectedGenres[i];

        tag.onclick = function() {
            selectedGenres.splice(i, 1); // remove 1 item at position i
            showSelectedGenres();        // redraw
        };

        box.appendChild(tag);
    }

    // outside the loop, so it also updates when the last tag is removed
    document.getElementById("genresHidden").value = selectedGenres.join(",");
}

function setupRegisterPage() {
    let status1 = document.getElementById("status1");
    let status2 = document.getElementById("status2");
    status1.textContent = "Loading JSON...";
    status2.textContent = "Loading JSON...";

    loadMovies()
        .then(function() {
            fillDatalist("genreOptions", getUnique(allMovies, "genre"));
            status1.textContent = "";
        })
        .catch(function(error) {
            status1.textContent = "Could not load movies JSON. Check the file and HTTP address. " + error.message;
        });

    fetchJSON("json/countries_regions.json")
        .then(function(countries) {
            let select = document.getElementById("country");

            for (let i = 0; i < countries.length; i++) {
                let item = document.createElement("option");
                item.value = countries[i].countryName;
                item.textContent = countries[i].countryName;
                select.appendChild(item);
            }
            status2.textContent = "";
        })
        .catch(function(error) {
            status2.textContent = "Could not load country JSON. Check the file and HTTP address. " + error.message;
        });

    // enter to insert genre functionality
    document.getElementById("btnAddGenre").onclick = addGenre;
    document.getElementById("genreInput").onkeydown = function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // stops surrounding forms from submitting
            addGenre();
        }
    };

    // error display and blocking event
    document.getElementById("regform").onsubmit = function(event) {
    if (!validateRegister()) {
        event.preventDefault();
    }
};
}

// ===================== REGISTRATION FORM VALIDATION =====================

function checkUsername(value) {
    if (value === "") return "Username is required.";
    if (!/^[A-Za-z0-9_]+$/.test(value)) return "Use letters, numbers and underscores only.";
    if (value.length < 5) return "Username must be at least 5 characters.";
    return "";
}

function checkEmail(value) {
    if (value === "") return "Email is required.";
    if (!value.includes("@")) return "Invalid email.";
    return "";
}

function checkPhone(value) {
    let phone = value.replace(/\D/g, "") // strips spaces & dashes 
    
    if (phone === "") return "Phone number is required.";
    if (!/^\d{8,15}$/.test(phone)) return "Phone number must be digits only, 8-15 digits.";
    return "";
}

function checkPassword(value) {
    if (value.length < 10) return "Password must be at least 10 characters long.";
    if (!/[A-Z]/.test(value)) return "Password must contain an uppercase letter.";
    if (!/[a-z]/.test(value)) return "Password must contain a lowercase letter.";
    if (!/\d/.test(value)) return "Password must contain a number.";
    if (!/[^A-Za-z0-9]/.test(value)) return "Password must contain a special character.";
    return "";
}

function validateRegister() {
    let username = document.getElementById("user").value.trim();
    let email    = document.getElementById("email").value.trim();
    let phone    = document.getElementById("phone").value.trim();
    let password = document.getElementById("pw1").value;
    let confirm  = document.getElementById("pw2").value;
    let gender   = document.querySelector('input[name="gender"]:checked'); // finds the first dom element that fits the condition

    let problems = [
        checkUsername(username),
        checkEmail(email),
        checkPhone(phone),
        checkPassword(password),
        confirm === password ? "" : "Passwords do not match.", // gets first string if condition is true, second if not
        gender ? "" : "Please select a gender."
    ].filter(function(msg) { 
        return msg !== ""; // filter out all empty strings created at the bottom of each check function 
    });

    document.getElementById("errors").textContent = problems.join("\n");
    return problems.length === 0;
}

// ===================== BOOKING FORM VALIDATION =====================

function checkFullName(value) {
    if (value === "") return "Full name is required.";
    return "";
}

function checkBookingPhone(value) {
    let phone = value.replace(/\D/g, "") // strips spaces & dashes 
    
    if (phone === "") return "Phone number is required.";
    if (!/\d/.test(phone)) return "Phone number must be digits only.";
    if (phone.length < 10) return "Phone number have at least 10 digits.";
    return "";
}

function checkScreening() {
    let chosen = document.querySelector('input[name="screening"]:checked');
    let msg = "";

    if (!chosen) {
        msg = "Please select a screening.";
    } else {
        let time = new Date(chosen.value.split(" - ")[0]); // because the radio value is (date) - (location)
        if (time < new Date()) msg = "That screening has already started."; //new Date() gives current time
    }

    return msg;
}

function checkTickets(value) {
    if (value === "") return "Ticket amount is required.";
    let n = Number(value);
    if (!Number.isInteger(n)) return "Ticket amount must be a whole number.";
    if (n <= 0) return "Ticket amount must be greater than 0.";
    return "";
}

function checkVoucher(value) {
    if (value === "") return "Voucher code is required.";
    if (!/^\d{12}$/.test(value)) return "Voucher code must be 12-digit.";
    return "";
}

function checkCard() {
    let type = document.querySelector('input[name="cardType"]:checked');
    let number = document.getElementById("cardNumber").value.replaceAll(" ", "");

    if (!type) return "Please select a card type.";
    if (number === "") return "Card number is required.";
    if (!/^\d+$/.test(number)) return "Card number must contain digits only.";

    if (type.value === "visa/mastercard") {
        if (number.length !== 16) return "Visa/Mastercard numbers must be 16 digits.";
    } else {
        if (number.length !== 15) return "Amex numbers must be 15 digits.";
    }
    return "";
}

function checkBilling(value) {
    if (value !== "") {
        if (!value.includes("@")) return "Invalid billing email.";
    };
    return "";
}

function validateBooking() {
    let fullname  = document.getElementById("fullname").value.trim();
    let email     = document.getElementById("email").value.trim();
    let phone     = document.getElementById("phone").value.trim();
    let ticketAmt = document.getElementById("ticketAmt").value.trim();
    let billing   = document.getElementById("billing").value.trim();

    let method = document.querySelector('input[name="payMethod"]:checked');
    let paymentProblem = null;

    if (!method) {
        paymentProblem = "Please choose a payment method.";
    } else if (method.value === "voucher") {
        paymentProblem = checkVoucher(document.getElementById("voucherCode").value.trim());
    } else {
        paymentProblem = checkCard();
    }

    let problems = [
        checkFullName(fullname),
        checkEmail(email),
        checkBookingPhone(phone),
        checkScreening(),
        checkTickets(ticketAmt),
        checkBilling(billing),
        paymentProblem
    ].filter(function(msg) {
        return msg !== "";
    });

    document.getElementById("errors").textContent = problems.join("\n");
    return problems.length === 0;
}

// ===================== START =====================

function init() {
    // pick the setup by checking for an element only that page has
    if (document.getElementById("genreInput")) {
        setupRegisterPage();
    } else if (document.getElementById("btnMovieUpdate")) {
        setupBookingPage();
    } else if (document.getElementById("prefBoxes")) {
        setupRecPage();
    } else if (document.getElementById("movieList")) {
        setupListPage();
    }
}

window.onload = init;