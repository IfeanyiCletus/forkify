import PreviewView from "./previewView.js";
import View from "./view.js";
import { generateMarkupPreview } from "../helpers.js";

class BookmarksView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";
  _message = "";

  generateMarkup() {
    return this._data
      .map((bookmark) => PreviewView.render(bookmark, false))
      .join("");
  }

  addHandlerBookmark(handler) {
    window.addEventListener("load", handler);
  }
}

export default new BookmarksView();
