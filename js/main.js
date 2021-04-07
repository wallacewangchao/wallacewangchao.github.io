document.querySelector('#hamburger_btn').addEventListener('click', function(event) {
  if (this.classList.contains('active')) {
      this.classList.remove('active');
      document.getElementById("my_overlay").style.opacity = "0";
      document.getElementById("my_sidebar").style.width = "0";

  } else {
      this.classList.add('active');
      document.getElementById("my_overlay").style.opacity = "1";
      document.getElementById("my_sidebar").style.width = "40vw";
  }
});