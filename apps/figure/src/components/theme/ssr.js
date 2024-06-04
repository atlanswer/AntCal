/* global document, localStorage, window */

const body = document.body;
const theme = localStorage.getItem("theme");
const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (theme) {
  switch (theme) {
    case "light":
      body.classList.remove("dark");
      break;
    case "dark":
      body.classList.add("dark");
      break;
    case "system":
      if (preferDark) {
        body.classList.add("dark");
      } else {
        body.classList.remove("dark");
      }
  }
}
