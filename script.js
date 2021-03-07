'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; //[lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }
}

class Running extends Workout {
  type = 'running'; // this is like writting  its own proprty in constructor bellow  - this.type = 'running'  it is accesible to all instances
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    //min per km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
  }

  calcSpeed() {
    //km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

/// APPLICATION ARCHITECTURE

class App {
  #map;
  #mapEvent;
  #workouts = [];

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
  // Geo-location
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
    //helper function

    // (...inputs)  return arrays right a way
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));

    const allpostive = (...inputs) => inputs.every(inp => inp > 0);

    //Display marker
    e.preventDefault();

    // Get data from form

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;
    //if workout running, create running object

    if (type === 'running') {
      const cadence = +inputCadence.value;
      // Check if data is valid
      if (
        /* !Number.isFinite(distance) 
      || !Number.isFinite(duration) 
      || !Number.isFinite(cadance) */
        !validInputs(distance, cadence, duration) ||
        !allpostive(distance, cadence, duration)
      )
        return alert('Inputs has to be positive numbers!');

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    //if cycling running, create cycling object
    if (type === 'cycling') {
      // Check if data is valid
      const elevation = +inputElevation.value;
      if (
        !validInputs(distance, elevation, duration) ||
        !allpostive(distance, elevation, duration)
      )
        return alert('Inputs has to be positive numbers!');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    //ADD all objct to workout array

    this.#workouts.push(workout);
    //Render the workout on map
    this.renderWorkout(workout);

    // Render workout on list

    // Clear input fields
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value =
      '';
  }

  renderWorkout(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnclick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}

//CREATING OBJECT

const app = new App();
