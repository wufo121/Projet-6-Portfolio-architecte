document.addEventListener("DOMContentLoaded", function() {
  // Fonction pour vérifier si l'utilisateur est connecté
  

  // Fonction pour récupérer les images depuis l'API
  function fetchSwagger() {
    fetch('http://localhost:5678/api/works')
      .then(response => response.json())
      .then(pictures => {
        generatePicture(pictures);
        setupFilterButtons(pictures);
        generatePictureModal(pictures);
      })
      .catch(error => {
        console.error('Error fetching pictures:', error);
      });
  }
  
  function generatePicture(pictures) {
    const gallery = document.getElementById('gallery');
  
    for (let i = 0; i < pictures.length; i++) {
      const article = pictures[i];
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      img.src = article.imageUrl;
      img.alt = article.title;
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = article.title;
  
      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    }
  }
  
  function setupFilterButtons(pictures) {
    const ButtonCategory1 = document.querySelector(".Category1");
    const ButtonCategory2 = document.querySelector(".Category2");
    const ButtonCategory3 = document.querySelector(".Category3");
    const ButtonAll = document.querySelector(".all");
  
    ButtonAll.addEventListener('click', function() {
      filterCategory(null, pictures); 
    });
    
  
    ButtonCategory1.addEventListener('click', function() {
      filterCategory(1, pictures);
    });
  
    ButtonCategory2.addEventListener('click', function() {
      filterCategory(2, pictures);
    });
  
    ButtonCategory3.addEventListener('click', function() {
      filterCategory(3, pictures);
    });
  }
  
  function filterCategory(categoryId, pictures) {
  const filterPictures = categoryId ? pictures.filter(picture => picture.categoryId === categoryId) : pictures;
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  generatePicture(filterPictures);
  }

  function checkLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  
  function showConnectedElements() {
    const connectedDiv = document.querySelector('.connected');
    connectedDiv.style.display = 'block';
    console.log(connectedDiv)
  }
  
  
  if (checkLoggedIn()) {
    showConnectedElements();
  }

  let modal = null



  const openModal = function (e){
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href'))
    target.style.display = null;
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal','true')
    modal = target
    modal.addEventListener('click',closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
  }

  const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click',closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
  }

 

  const stopPropagation = function (e) {
    e.stopPropagation()
  }

  document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', function(e) {
      closeModal(e)
      openModal(e)
    })
  })
  
  window.addEventListener('keydown',function (e){
    if (e.key === "Escape" || e.key=== "Esc"){
      closeModal(e)
    }
  })

  function generatePictureModal(pictures) {
    const gallery = document.getElementById('gallery-modal');
  
    for (let i = 0; i < pictures.length; i++) {
      const article = pictures[i];
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      const trash = document.createElement('i');
      trash.classList.add("fa-solid","fa-trash-can")
      const editer = document.createElement('p');
      editer.textContent = ('éditer');

      img.src = article.imageUrl;
      img.alt = article.title;
      figure.appendChild(img);
      gallery.appendChild(figure);
      figure.appendChild(trash)
      figure.appendChild(editer);
    }
  }

 

  
  fetchSwagger();
});
