/* Full Body Swedish Massage photo */
(function () {
  var src = "data:image/jpeg;base64,PLACEHOLDER_WILL_FAIL";
  function apply() {
    document.querySelectorAll('img[alt="Full body Swedish massage"], img[alt="Extended Swedish massage"]').forEach(function (img) {
      img.src = src;
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
