import City from "./city.js";

class MapDict {
  constructor() {
    this.map = new Map();
  }

  key(coords) {
    return `${coords.x}-${coords.y}`;
  }

  set(coords, value) {
    const key = this.key(coords);
    this.map.set(key, value);
  }

  get(coords) {
    const key = this.key(coords);
    return this.map.get(key);
  }
}

export default class CountryMap {
  constructor(countries) {
    // Initialize the CountryMap object with the given countries
    this.countriesGrid = new MapDict(); 
    this.countries = countries; 
    this.minX = 0; 
    this.minY = 0; 
    this.maxX = 0; 
    this.maxY = 0; 

    // Determine the minimum and maximum coordinates across all countries
    countries.forEach((country) => {
      this.minX = Math.min(this.minX, country.coords.xl);
      this.minY = Math.min(this.minY, country.coords.yl);
      this.maxX = Math.max(this.maxX, country.coords.xh);
      this.maxY = Math.max(this.maxY, country.coords.yh);
    });

    this.addCitiesToCountries();
    this.addNeighborsToCities();
  }

  isCompleted() {
    return this.countries.every((country) => country.isCompleted());
  }

  addCitiesToCountries() {
    const coinTypes = this.countries.map((country) => country.name);
    this.countries.forEach((country, countryIndex) => {
      for (let x = country.coords.xl; x <= country.coords.xh; x += 1) {
        for (let y = country.coords.yl; y <= country.coords.yh; y += 1) {
          const city = new City(coinTypes, country.name);
          this.countriesGrid.set({ x, y }, city);
          this.countries[countryIndex].addCity(city);
        }
      }
    });
  }

  addNeighborsToCities() {
    // Add neighbor relationships to cities
    for (let x = this.minX; x <= this.maxX; x += 1) {
      for (let y = this.minY; y <= this.maxY; y += 1) {
        const city = this.countriesGrid.get({ x, y });
        if (!city) {
          continue;
        }

        const neighbors = [];
        const addNeighbor = (x, y) => {
          const neighborCity = this.countriesGrid.get({ x, y });
          if (neighborCity) {
            neighbors.push(neighborCity);
          }
        };

        if (x < this.maxX) {
          addNeighbor(x + 1, y);
        }
        if (x > this.minY) {
          addNeighbor(x - 1, y);
        }
        if (y < this.maxY) {
          addNeighbor(x, y + 1);
        }
        if (y > this.minY) {
          addNeighbor(x, y - 1);
        }

        if (this.countries.length > 1 && !neighbors.length) {
          throw new Error(`City in ${city.countryName} has no neighbors`);
        }

        city.neighbors = neighbors;
      }
    }
  }

  diffuse() {
    // Perform the diffusion process until all countries are completed
    this.countriesGrid = new MapDict();
    const result = new Map();
    let currentDay = 0;

    do {
      this.countries.forEach((country) => {
        country.cities.forEach((city) => {
          city.shareCoins();
        });

        // Check if a country is completed and record the completion day
        if (country.isCompleted()) {
          if (!result.has(country.name)) {
            result.set(country.name, currentDay);
          }
        }
      });

      this.countries.forEach((country) => {
        // Update coin balances for cities within each country
        country.cities.forEach((city) => {
          city.updateCoinBalance();
        });
      });
      currentDay += 1;
    } while (!this.isCompleted());

    // If a country is not completed by the end, record the last completion day
    this.countries.forEach((country) => {
      if (!result.has(country.name)) {
        result.set(country.name, currentDay);
      }
    });

    return result;
  }

  static stringifyResult(diffusionResult) {
    // Convert the diffusion result map into a formatted string
    const results = [];
    for (const [countryName, days] of diffusionResult.entries()) {
      results.push(`${countryName} ${days}`);
    }
    return results.join("\n");
  }
}