import * as model from "./model.js";
import RecipeView from "./views/recipeView.js";
import SearchView from "./views/searchView.js";
import ResultsView from "./views/resultsView.js";
import PaginationView from "./views/paginationView.js";
import BookmarksView from "./views/bookmarksView.js";
import AddRecipeView from "./views/addRecipeView.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import recipeView from "./views/recipeView.js";
import addRecipeView from "./views/addRecipeView.js";
import bookmarksView from "./views/bookmarksView.js";
import { MODAL_CLOSE_SEC } from "./config.js";
// import { render } from "sass";

const recipeContainer = document.querySelector(".recipe");

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const controlRecipe = async function () {
  try {
    //1) Load recipe
    const id = window.location.hash.slice(1);

    if (!id) return;
    //render spinner
    RecipeView.renderSpinner();

    //update result
    ResultsView.update(model.getSearchPageResult());
    // renderSpinner(recipeContainer);

    await model.loadRecipe(id);
    // const { recipe } = model.state;

    // 2) render recipe
    RecipeView.render(model.state.recipe);

    //Update bookmark

    BookmarksView.update(model.state.bookmarks);
    // ResultsView.generateMarkup();
  } catch (err) {
    RecipeView.renderError();
  }
};

const controlServingUpdate = function (update) {
  //1) get number of servings from recipeView
  // const update = 5;
  // console.log(update);
  model.updateServings(update);

  //2) Render the number of servings to the model
  //3) Adjust the ingrediemts
  RecipeView.update(model.state.recipe);
  //3) recieve the manipulation method with the parameter of the number of servings
};

const controlSearchResults = async function () {
  try {
    //1) Load search result
    ResultsView.renderSpinner();
    query = SearchView.getSearchResult();

    await model.loadSearchResults(query);

    //2) render search result
    const data = model.state.search.results;
    if (!data || (Array.isArray(data) && data.length === 0))
      return ResultsView.renderError();
    console.log(data);

    ResultsView.render(model.getSearchPageResult(1));

    PaginationView.getNumPage(model.state.search.results.length);

    PaginationView.render(model.state.search.page);
    // console.log(model.state.search.results.length);
  } catch (err) {
    throw err;
  }
};

const controlPagination = function (goToPage) {
  // console.log("Pag loaded");
  ResultsView.render(model.getSearchPageResult(goToPage));

  PaginationView.render(model.state.search.page);
};

const controlBookmarks = function () {
  //add recipe to bookmark
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.deleteBookmarks(model.state.recipe.id);

  //2) Update recipe view
  RecipeView.update(model.state.recipe);

  //3) render bookmark
  BookmarksView.render(model.state.bookmarks);
};

const controlLoadBookmarks = function () {
  BookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    //render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error("💥", err);
    addRecipeView.renderError(err.message);
  }
};

const controlWelcome = function () {
  console.log("Welcome to the Application");
};

const init = function () {
  BookmarksView.addHandlerBookmark(controlLoadBookmarks);
  RecipeView.addHandlerRender(controlRecipe);
  RecipeView.addHandlerUpdateServings(controlServingUpdate);
  RecipeView.addHandlerBookmark(controlBookmarks);
  SearchView.addHandlerRender(controlSearchResults);
  PaginationView.addHandlerRender(controlPagination);
  AddRecipeView.addHandlerUploadForm(controlAddRecipe);
  controlWelcome();
};
init();
