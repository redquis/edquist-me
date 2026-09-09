/* The 404 page is static, so the attempted path is filled in client side. */
(function () {
  let attempted = location.pathname + location.search;
  if (attempted.length > 80) attempted = attempted.slice(0, 77) + "...";
  const shown = document.getElementById("path");
  const repeated = document.getElementById("path2");
  if (shown) shown.textContent = attempted;
  if (repeated) repeated.textContent = attempted + ": ";
})();
