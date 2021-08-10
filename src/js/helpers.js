import { TIMEOUT_SEC } from "./config.js";
import icons from "url:../img/icons.svg";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// export const getJSON = async function (url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} ${res.status}`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

export const generateMarkupPreview = function (result) {
  const id = window.location.hash.slice(1);

  return `
  ${result?.map((dat) => {
    return `
    <li class="preview">
          <a class="preview__link ${
            dat.id === id ? "preview__link--active" : ""
          }" href="#${dat.id}">
            <figure class="preview__fig">
              <img src=${dat.image} alt="Test" />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${dat.title} ...</h4>
              <p class="preview__publisher">${dat.publisher}</p>
              <div class="preview__user-generated ${dat.key ? "" : "hidden"}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
            </div>
          </a>
        </li>
    `;
  })}
    `;
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};
