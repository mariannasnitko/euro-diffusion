import { countryConstants } from "./constants.js";
import Validation from "./validation.js";

export default class Country {
  constructor(name, coords) {
    // Validate the country data
    Validation.validateCountryData(name, coords);

    this.cities = []; 
    this.name = name; 
    this.coords = coords; 
  }

  addCity(city) {
    this.cities.push(city);
  }

  isCompleted() {
    // Check if all cities in the country are completed
    return this.cities.every((city) => city.isCompleted());
  }

  static parseCountryString(countryString) {
    // Parse the country string and create a new Country object
    const [name, ...coords] = countryString.split(" ");
    const [xl, yl, xh, yh] = coords.map((coord) => parseInt(Math.abs(coord)));
    return new Country(name, { xl, yl, xh, yh });
  }
}