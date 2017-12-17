document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener("resize", init)

  var colorDropdown = document.querySelector('select[name="color"]')
  var zoomSlider = document.querySelector('#zoomSlider')
  
  colorDropdown.onchange = function() {
    switch (colorDropdown.value) {
      case 'white':
        starColor = STARS_WHITE
        break;
      case 'red':
        starColor = STARS_RED
        break;
      case 'blue':
        starColor = STARS_BLUE
        break;
      case 'purple':
        starColor = STARS_PURPLE
        break;
      case 'multi':
        starColor = STARS_MULTI
        break;
    }
  }

  function sliderChanged() {
    var minp = zoomSlider.min;
    var maxp = zoomSlider.max;

    var minv = Math.log(MIN_ZOOM);
    var maxv = Math.log(MAX_ZOOM);

    var scale = (maxv-minv) / (maxp-minp);

    zoom = Math.exp(minv + scale*(zoomSlider.value-minp));

  }

  zoomSlider.onchange = sliderChanged
  zoomSlider.oninput = sliderChanged
})