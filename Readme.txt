SuperMovie - Movie Discovery and Booking Website
================================================

Author:      Danh Gia Khanh Truong
Student ID:  106206969
Unit:        COS10005


1. WEBSITE STRUCTURE
--------------------

The site is made up of six pages that share one header, one navigation bar,
one stylesheet and one JavaScript file.

Pages
  index.html        Home page. Short introduction to SuperMovie.
  movies.html       Movie listing. Shows every movie as a poster. Clicking a
                    poster shows its details, ticket prices and available
                    screenings, with a "Book this Movie" button.
  recommend.html    Recommendations. Tick genres, viewing preferences and age
                    ratings, then press Apply to filter the movie list. Clicking
                    a poster shows details as on the listing page.
  watchlist.html    Watchlist page. [DESCRIBE WHAT THIS PAGE DOES]
  booking.html      Booking form. Choose a movie, pick a screening, enter
                    ticket details and payment details.
  register.html     Account registration form, including preferred genres and
                    country.

Folders and files
  css/style.css     The single external stylesheet linked to every page. It is
                    responsive (mobile up to 767px, tablet 768-1023px,
                    desktop 1024px and above).
  js/script.js      All JavaScript for the site. On load it checks which page it
                    is on (by looking for an element only that page has) and
                    runs the matching setup code.
  json/movies.json  Movie data: title, year, genres, age rating, runtime,
                    viewing preferences, description, poster image, ticket
                    prices and screenings.
  json/countries_regions.json
                    Country list used to fill the country dropdown on the
                    registration page.
  images/           Movie posters.
  jquery.min.js     jQuery library, included on some pages. [DELETE THIS LINE IF
                    UNUSED]

How the pages connect
  - The movie list and recommendation pages load movies.json using fetch().
  - "Book this Movie" opens booking.html with the movie title in the link
    (for example booking.html?movie=Title). The booking page reads the title
    and pre-selects that movie and its screenings.
  - Registration and booking forms post to the Mercury test script (see below).


2. MERCURY LINK
---------------

https://mercury.swin.edu.au/cos10005/s106206969/assignment2/index.html


3. GITHUB REPOSITORY LINK
-------------------------

https://github.com/danhgiakhanhtruong/wd_assign_2


4. EXPLANATION OF JAVASCRIPT VALIDATION LOGIC (PLAIN ENGLISH)
-------------------------------------------------------------

General approach
  When the user presses Register (or the submit button on the booking form),
  JavaScript runs before anything is sent. It checks every field one at a
  time. Each check either says "this is fine" or gives a short error message.
  All the error messages are collected into one list and shown together in the
  error box just above the buttons. If there is at least one error, the form
  is stopped and nothing is submitted. When the user fixes the problems and
  submits again, the box is cleared and the checks run again. If there are no
  errors, the form is sent normally.

  Values are trimmed first, so a field containing only spaces counts as empty.

Registration form (register.html)
  Username      Must not be empty, must contain only letters, numbers and
                underscores, and must be at least 5 characters long.
  Email         Must not be empty and must look like an email address.
  Phone number  Spaces and dashes are ignored. What remains must be digits only
                and between 8 and 15 digits long.
  Password      Must be at least 10 characters and contain at least one
                uppercase letter, one lowercase letter, one number and one
                special character (anything that is not a letter or number).
                The first missing requirement is reported.
  Confirm       Must be identical to the password.
  Gender        One of the options must be selected.

Booking form (booking.html)
  Full name     Must not be empty.
  Email         Must not be empty and must look like an email address.
  Phone number  Spaces and dashes are ignored. Must have at least 10 digits.
  Screening     One available screening must be selected, and its date and
                time must not be in the past. The time is compared with the
                current time on the user's computer.
  Tickets       Must be a whole number greater than 0.
  Payment       The user must choose a payment method, and only the chosen
                method is checked:
                  Voucher - a 12-digit code box is shown. No credit card
                  fields are shown or checked. The code is not checked against
                  any real voucher list.
                  Online payment - a card type must be chosen and a card
                  number entered. Digits only. Visa/Mastercard must have 16
                  digits and Amex must have 15. This is a format check only;
                  no payment is processed.
  Billing email Optional, but if filled in it must look like an email address.
                The "Same as email address" tick box copies the email field
                into the billing field and keeps it in sync.

Other form behaviour (not validation, but related)
  - The ticket price updates automatically as the movie, ticket type or
    number of tickets changes.
  - On the booking page, choosing "Voucher" or "Online payment" shows only
    the fields for that method.
  - On the registration page, genres are typed into a suggestion box and added
    as tags. Only genres that exist in the movie data are accepted, and
    duplicates are ignored. Clicking a tag removes it.


5. KNOWN ISSUES OR LIMITATIONS
------------------------------

  - Validation runs in the browser only. Someone could bypass it, so a real
    site would also need to validate on the server.
  - The email check is simple. It confirms the text looks like an email
    address but cannot confirm the address actually exists.
  - The forms post to a test script on Mercury. No accounts or bookings are
    actually saved, and no payment is processed.
  - The registration form does not force the user to choose any preferred
    genres. [REMOVE OR CHANGE IF YOU ADD THIS CHECK]
  - Phone numbers accept spaces and dashes but not other formats such as a
    leading plus sign.
  - Voucher codes are only checked for length/format, not against a real list.
  - "Screening is not in the past" uses the clock on the user's device, so a
    wrong device clock gives wrong results.
  - Movie, screening and country data are read from JSON files using fetch(),
    so the site must be opened through a web server (not by double-clicking
    the HTML file) and the folder structure must be kept as described above.
  - [ADD ANY OTHER ISSUES YOU HAVE NOTICED]


6. REFERENCES
-------------

  [LIST ANY SOURCES USED, FOR EXAMPLE:]
  - MDN Web Docs - https://developer.mozilla.org
  - W3Schools - https://www.w3schools.com
  - Movie posters and descriptions: [SOURCE]
  - Assistance from an AI tool (Claude, by Anthropic) for code review,
    debugging help and drafting this readme. [CHECK YOUR UNIT'S AI USE POLICY
    AND DECLARE USE AS REQUIRED]
