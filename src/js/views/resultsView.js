import View from "./view.js";
import PreviewView from "./previewView.js";
import { generateMarkupPreview } from "../helpers.js";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errorMessage = "The recipe could not be found. Please try again!";
  _message = "";

  generateMarkup() {
    return this._data
      .map((result) => PreviewView.render(result, false))
      .join("");
  }
}

export default new ResultsView();
//preview__link--active
