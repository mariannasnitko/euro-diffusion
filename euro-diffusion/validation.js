import { countryConstants } from "./constants.js";

export default class Validation {
  static areCoordsValid(coords) {
    const { xl, yl, xh, yh } = coords;

    const isCorrectBounds = (coord) => {
      return typeof coord === "number" && !isNaN(coord) && coord >= countryConstants.MIN_COORD && coord <= countryConstants.MAX_COORD;
    };

    const isValidRange = (coord_l, coord_h) => coord_l <= coord_h;

    return (
      isCorrectBounds(xl) &&
      isCorrectBounds(yl) &&
      isCorrectBounds(xh) &&
      isCorrectBounds(yh) &&
      isValidRange(xl, xh) &&
      isValidRange(yl, yh)
    );    
  }

  static isNameValid(name) {
    return name.length <= countryConstants.NAME_MAX_LENGTH;
  }
  
  static validateCountryData(countryName, coords) {
    if (!Validation.areCoordsValid(coords)) {
      throw new Error(`Invalid country coordinates: ${countryName}`);
    }
    if (!Validation.isNameValid(countryName)) {
      throw new Error(`Name must contain less than ${countryConstants.NAME_MAX_LENGTH} symbols`);
    }
  }
}
