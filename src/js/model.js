import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { AJAX } from "./helpers.js";

export const state = {
  recipe: {},
  search: {
    query: "",
    page: 1,
    resultPerPage: RES_PER_PAGE,
    results: [],
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    state.bookmarks.some((bookmark) => {
      if (bookmark.id === state.recipe.id) state.recipe.bookmarked = true;
    });
  } catch (err) {
    throw err;
  }
  //   console.log(recipe);
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    //1) load search API
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    const recipe = data.data.recipes;
    state.search.results = recipe.map((rec) => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchPageResult = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;

  return state.search.results.slice(start, end);
};
// loadSearchResults("pizza");

export const updateServings = function (newServings) {
  //1) get the number of servings
  const oldServings = state.recipe.servings;

  //2) manipulate number of ingredients

  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = ing.quantity * (newServings / oldServings);
  });

  state.recipe.servings = newServings;
};

const persistData = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmarks = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistData();
};

export const deleteBookmarks = function (id) {
  const index = state.bookmarks.findIndex((bookmark) => (bookmark.id = id));
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistData();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    //convert the recipe to the API format
    const ingredients = Object.entries(newRecipe)
      .filter((ing) => ing[0].startsWith("ingredient") && ing[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].split(",").map((el) => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            "Wrong ingredient format! please use the correct format:"
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    let recipe = {
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      title: newRecipe.title,
      servings: +newRecipe.servings,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      ingredients,
    };

    // upload recipe to the API

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    console.log(data);
    state.recipe = createRecipeObject(data);

    //Bookmark recipe
    addBookmarks(state.recipe);
  } catch (err) {
    throw err;
  }
};
const clearBookmarks = function () {
  localStorage.clear("bookmarks");
};
// clearBookmarks();
