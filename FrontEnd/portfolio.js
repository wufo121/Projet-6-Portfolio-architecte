function fetchSwagger() {
  fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(pictures => {
      generatePicture(pictures);
      setupFilterButtons(pictures);
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
    fetchSwagger();
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
  const filterPictures = pictures.filter(picture => picture.categoryId === categoryId);
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  generatePicture(filterPictures);
}

fetchSwagger();
