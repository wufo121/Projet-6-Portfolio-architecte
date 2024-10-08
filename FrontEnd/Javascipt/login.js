/*Permet de vérifier les identifiants au login*/

document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const data = {
    email: email,
    password: password
  };

  fetch("http://localhost:5678/api/users/login", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(function(response) {
    if (response.ok) {
      return response.json(); 
    } else {
      document.getElementById("error-message").style.display = "block";
      throw new Error('Identifiants invalides. Veuillez réessayer.');
    }
  })
    /*Permet de stocker le Token ainsi que de savoir si l'utilisateur est connecté*/
    
    .then(function(data) {
      const token = data.token; 

      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');

      /*renvoie à mon index*/
      let indexPath = ""; 

      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        indexPath = "../../index.html";

      } else {
        const username = "wufo121";
        const repository = "Projet-6-Portfolio-architecte";
        indexPath = `https://${username}.github.io/${repository}/index.html`;
      }
      window.location.href = indexPath;
      
    })
    .catch(function(error) {
      document.getElementById("login-form").classList.add("error");
      console.log("Une erreur s'est produite lors de la connexion :", error);

      setTimeout(function() {
        document.getElementById("login-form").classList.remove("error");
        document.getElementById("error-message").style.display = "none";
      }, 2000);
  });  
});
