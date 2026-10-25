/* Load Full Body Swedish Massage owner photo */
(function () {
  function apply(src) {
    document.querySelectorAll('img[alt="Full body Swedish massage"], img[alt="Extended Swedish massage"]').forEach(function (img) {
      img.src = src;
    });
  }
  Promise.all([
    fetch("swedish-a.b64").then(function (r) { return r.text(); }),
    fetch("swedish-b.b64").then(function (r) { return r.text(); })
  ]).then(function (parts) {
    apply("data:image/jpeg;base64," + (parts[0] + parts[1]).trim());
  }).catch(function () {});
})();
