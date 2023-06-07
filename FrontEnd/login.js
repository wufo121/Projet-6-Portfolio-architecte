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
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = "index.html";
      } else {
        document.getElementById("login-form").classList.add("error")
        console.log("Identifiants invalides. Veuillez réessayer.");

        setTimeout(function() {
            document.getElementById("login-form").classList.remove("error");
          }, 500);
      }
    })
    .catch(function(error) {
      console.log("Une erreur s'est produite lors de la connexion :", error);
    });
  });

  function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
  



