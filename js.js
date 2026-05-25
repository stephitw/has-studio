//function animHome() {
window.onload =  (event) => {
const elButton = document.querySelector('.menu-button');
const elSite = document.querySelector('#site');
const menu = document.querySelector('.navbar');
const header = document.querySelector('.site-header');
const hamburger = document.querySelector('.menu-button');
  

elButton.addEventListener('click',()=>{

    if ( elSite.dataset.menu ) {
      delete elSite.dataset.menu;
      elSite.style.height = "100vh";
      // menu.style.opacity = "1";
      // header.style.background = "white";
      // header.style.display = "flex";
      hamburger.style.display= "none";
      setTimeout(()=>{ 
        elSite.style.display = "none"; 
      },1000);

    } else {
      elSite.dataset.menu = true;
      elSite.style.height = "100vh";
      // menu.style.opacity = "transparent";
      hamburger.style.display= "block";
      // header.style.display = "none";
    }

  });


  setTimeout(()=>{ 
    elButton.click(); 
  },100);
}
// cookies
const cookieContainer = document.querySelector(".cookie-container");
const cookieButton = document.querySelector(".cookie-btn");

cookieButton.addEventListener("click", () => {
  cookieContainer.classList.remove("active");
  localStorage.setItem("cookieBannerDisplayed", "true");
});

setTimeout(() => {
  if (!localStorage.getItem("cookieBannerDisplayed")) {
    cookieContainer.classList.add("active");
  }
}, 2000);

/*header fixed*/
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("navbar").style.background = "#fff";
    document.getElementById("navbar").style.padding = "0px 10%";
    document.getElementById("navbar").style.boxShadow = "0 0 10px rgba(0,0,0,.1)";
    document.getElementById("logo-img").style.transform = "scale(1)";
    document.getElementById("logo-img").style.height = "100px";
    document.getElementById("back-to-top").style.display = "block";
  } else {
    document.getElementById("navbar").style.background = "transparent";
    document.getElementById("navbar").style.padding = "10px 10%";
    document.getElementById("navbar").style.boxShadow = "0 0 0px rgba(0,0,0,.1)";
    document.getElementById("logo-img").style.transform = "scale(1)";
    document.getElementById("logo-img").style.height = "199px";
    document.getElementById("back-to-top").style.display = "none";
  }
}


/*Button INICIO*/
function myFunction(x) {
  x.classList.toggle("change");
}








