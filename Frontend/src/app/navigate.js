/**
 * @function navigate
 * @description Programmatically navigates to a new URL without a full page reload.
 * It uses the History API to change the URL and then dispatches a 'popstate' event
 * to notify components (like the Layout) that the URL has changed.
 * @param {string} to - The path to navigate to.
 */
export function navigate(to) {
  window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
