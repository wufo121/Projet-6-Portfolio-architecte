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
        return response.json(); // Convertir la réponse en JSON
      } else {
        throw new Error('Identifiants invalides. Veuillez réessayer.');
      }
    })
    .then(function(data) {
      const token = data.token; // Accéder au token dans le corps de la réponse JSON

      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = "index.html";
    })
    .catch(function(error) {
      document.getElementById("login-form").classList.add("error");
      console.log("Une erreur s'est produite lors de la connexion :", error);

      setTimeout(function() {
        document.getElementById("login-form").classList.remove("error");
      }, 500);
    });
});

function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true';
}
