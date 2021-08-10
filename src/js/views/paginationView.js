import icons from "url:../../img/icons.svg";
import View from "./view.js";
import { RES_PER_PAGE } from "../config.js";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");
  _data;
  _errorMessage = "The recipe could not be found. Please try again!";
  _numPage;

  getNumPage(totalNumOfPage) {
    this._numPage = Math.ceil(totalNumOfPage / RES_PER_PAGE);
    // return this._numPage;
  }

  addHandlerRender(handler) {
    window.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      //   if (goToPage) return;
      handler(goToPage);
    });
  }

  generateMarkup() {
    const curPage = this._data;
    console.log(this._numPage);
    //1) Page 1 and others
    if (curPage === 1 && this._numPage > 1)
      return `
        <button data-goto='${
          curPage + 1
        }' class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>  
    `;

    //2) Last page
    if (curPage === this._numPage && this._numPage > 1)
      return `
        <button data-goto='${
          curPage - 1
        }' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
    `;

    //3) Other pages
    if (curPage < this._numPage)
      return `
            
        <button data-goto='${
          curPage - 1
        }' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
        <button data-goto='${
          curPage + 1
        }' class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;

    //4) Page one only
    return "";
  }
}
export default new PaginationView();
