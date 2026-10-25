/* Load Full Body Swedish Massage owner photo */
(function () {
  function apply(src) {
    document.querySelectorAll('img[alt="Full body Swedish massage"], img[alt="Extended Swedish massage"]').forEach(function (img) {
      img.src = src;
    });
  }
  Promise.all([0,1,2,3].map(function (i) {
    return fetch("swedish-" + i + ".b64").then(function (r) { return r.text(); });
  })).then(function (parts) {
    apply("data:image/jpeg;base64," + parts.join("").trim());
  }).catch(function () {});
})();
