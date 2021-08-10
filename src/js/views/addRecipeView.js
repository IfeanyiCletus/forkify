import icons from "url:../../img/icons.svg";
import View from "./view.js";

class AddRecipeView extends View {
  _parentElement = document.querySelector(".upload");

  _btnOpen = document.querySelector(".nav__btn--add-recipe");
  _btnClose = document.querySelector(".btn--close-modal");
  _window = document.querySelector(".add-recipe-window");
  _overlay = document.querySelector(".overlay");
  _data;
  _message =
    "Your recipe has been added successfully. Check bookmark to see your recipe";

  constructor() {
    super();
    this._addHandlerShow();
    this._addHandlerHide();
  }

  toggleWindow() {
    this._window.classList.toggle("hidden");
    this._overlay.classList.toggle("hidden");
  }

  _addHandlerShow() {
    this._btnOpen.addEventListener("click", this.toggleWindow.bind(this));
  }

  _addHandlerHide() {
    this._btnClose.addEventListener("click", this.toggleWindow.bind(this));
    this._overlay.addEventListener("click", this.toggleWindow.bind(this));
  }

  addHandlerUploadForm(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      //extract data fromthe form and spread it into an array
      const dataArr = [...new FormData(this)];
      //convert array into object
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  generateMarkup() {}
}

export default new AddRecipeView();
