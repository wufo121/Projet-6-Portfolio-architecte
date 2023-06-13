


document.addEventListener("DOMContentLoaded", function() {

  /*requête pour récupérer les travaux en json*/

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
  /*Apparition des images et de leur description dans la gallerie*/

  function generatePicture(pictures) {
    const gallery = document.getElementById('gallery');
  
    for (let i = 0; i < pictures.length; i++) {
      const article = pictures[i];
      const imgExists = Array.from(gallery.getElementsByTagName('img')).some(img => img.src === article.imageUrl);
      const figure = document.createElement('figure');
      if (imgExists) {
        continue; 
      }

      const img = document.createElement('img');
      img.src = article.imageUrl;
      img.alt = article.title;
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = article.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
      console.log(article)
    }
  }
  /* filtres pour gérer les catégories*/

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


  /* Fonction pour vérifier que l'utilisateur est bien connecté*/

  function checkLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
  /* Fonction pour faire apparaitre les éléments si connecté*/

  function showConnectedElements() {
    const connectedDiv = document.querySelector('.connected');
    connectedDiv.style.display = 'block';
    console.log(connectedDiv)
  }
  if (checkLoggedIn()) {
    showConnectedElements();
  }

  /*section des modals*/

  let modal = null

  /*ouverture des modals*/
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

  /*fermeture des modals*/
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

  /*Permet de génerer les images dans la modal avec les éléments correspondant en plus*/

  function generatePictureModal(pictures) {
    const galleryModal = document.getElementById('gallery-modal');
  
    for (let i = 0; i < pictures.length; i++) {
      const article = pictures[i];
      const imgExists = Array.from(galleryModal.getElementsByTagName('img')).some(img => img.src === article.imageUrl);
  
      if (imgExists) {
        continue; 
      }
  
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      const trash = document.createElement('i');
      trash.classList.add("fa-solid","fa-trash-can");
      trash.addEventListener('click', function() {
        deleteElement(article.id);
      });
      const editer = document.createElement('p');
      editer.textContent = 'éditer';
  
      img.src = article.imageUrl;
      img.alt = article.title;
      figure.appendChild(img);
      figure.appendChild(trash);
      figure.appendChild(editer);
      galleryModal.appendChild(figure);
    }
  }
  
/* gerer le bouton pour ajouter une photo*/
  document.getElementById('fileStatus').addEventListener('click', function() {
    document.getElementById('buttonAddPictures').click();
  });


  const buttonAddPictures = document.getElementById('buttonAddPictures');
  const previewImage = document.getElementById('previewImage');


  /*Prévisualisation de l'image*/

  buttonAddPictures.addEventListener('change', function() {
    const file = buttonAddPictures.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
        document.getElementById('fileStatus').style.display = 'none';
      }
      reader.readAsDataURL(file);
    }
  });


  const titleInput = document.getElementById('title');
  const categorySelect = document.getElementById('category');
  const fileInput = document.getElementById('buttonAddPictures');
  const validateButton = document.getElementById('validatePush')

  /* Vérification que tout les champs ont été remplie au préalable et change la couleur du bouton push*/
  function checkFields() {
    const titleValue = titleInput.value.trim();
    const categoryValue = categorySelect.value;
    const fileValue = fileInput.value;

    if (titleValue !== '' && categoryValue !== '' && fileValue !== '') {
      validateButton.style.backgroundColor = '#1D6154';
    } else {
      validateButton.style.backgroundColor = '';
    }
  }

  titleInput.addEventListener('input', checkFields);
  categorySelect.addEventListener('change', checkFields);
  fileInput.addEventListener('change', checkFields);

  /*envoi des données*/

  function sendData() {
    const titleValue = document.getElementById('title').value.trim();
    const categoryValue = document.getElementById('category').value;
    const fileValue = fileInput.files[0];
  
    if (titleValue === '' || categoryValue === '' || fileValue === undefined) {
      console.error('Veuillez remplir tous les champs.');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', fileValue, fileValue.name);
    formData.append('title', titleValue);
    formData.append('category', categoryValue);
  
    const token = localStorage.getItem('token');
  
    const options = {
      method: 'POST',
      body: formData,
      headers: {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    };
  
    fetch('http://localhost:5678/api/works', options)
      .then(response => {
        if (response.ok) {
          console.log('Données envoyées avec succès !');
          document.getElementById('title').value = '';
          document.getElementById('category').value = '';
          document.getElementById('buttonAddPictures').value = '';
  
          refreshGallery();
          refreshModalGallery();
        } else {
          console.error('Échec de l\'envoi des données.');
        }
      })
      .catch(error => {
        console.error('Erreur lors de l\'envoi des données:', error);
      });
  }
   
  validateButton.addEventListener('click', function(event) {
    event.preventDefault();
    sendData();
  });

  /*supression d'un élément*/

  function deleteElement(id) {
    const token = localStorage.getItem('token');
    const options = {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };
  
    fetch(`http://localhost:5678/api/works/${id}`, options)
      .then(response => {
        if (response.ok) {
          console.log(`Élément avec l'ID ${id} supprimé avec succès.`);
          refreshGallery();
          refreshModalGallery();
        } else {
          console.error(`Échec de la suppression de l'élément avec l'ID ${id}.`);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la suppression de l\'élément:', error);
      });
  }
  
/*fonctions pour actualiser les galleries*/

  function refreshGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; 
      
    fetchSwagger(); 
  }
  function refreshModalGallery() {
    const galleryModal = document.getElementById('gallery-modal');
    galleryModal.innerHTML = ''; 
    
    fetchSwagger(); // 
  }  

  
  fetchSwagger();

 
  });
