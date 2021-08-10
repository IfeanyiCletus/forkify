import icons from "url:../../img/icons.svg";

class SearchView {
  _parentElement = document.querySelector(".search");

  getSearchResult() {
    const query = this._parentElement.querySelector(".search__field").value;
    return query;
  }

  addHandlerRender(handler) {
    window.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new SearchView();
