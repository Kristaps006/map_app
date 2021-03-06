'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Geo-location

class App {
  #map;
  #mapEvent;
  constructor() {
    // this method is called right away as object is created
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this)); // this points to DOM because it alwaus point to DOM element
    inputType.addEventListener('change', this._toggleElevationField); // this points to DOM because it always point to
  }

  _getPosition() {
    if (navigator.geolocation)
      // Regular function call this keyowrd points to undefined
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get you Position');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    console.log(
      `https://www.google.com/maps/place/55%C2%B042'11.4%22N+12%C2%B035'07.1%22E/@${latitude},${longitude},17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x0!8m2!3d55.7031537!4d12.585318`
    );

    //Displaying MAP using LEAF LET
    // we set up our own array
    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, 16);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Handling clicks on map
    // On() is coming from leaftlet
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    // Adding form
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    //Display marker
    e.preventDefault();

    // Clear input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
      '';

    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnclick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}

//CREATING OBJECT

const app = new App();
