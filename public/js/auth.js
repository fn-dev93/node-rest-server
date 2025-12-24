const formLogin = document.querySelector("form");
const signOutButton = document.getElementById("sign_out");

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  let formData = {};
  for (let i of formLogin.elements) {
    if (i.name.length > 0) {
      formData[i.name] = i.value;
    }
  }

  console.log(formData);
  console.log(JSON.stringify(formData));
  fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then(({ msg, token }) => {
      if (msg) {
        return console.error(msg);
      }
      localStorage.setItem("token", token);
      console.log({ token });
      window.location = "chat.html";
    })
    .catch((err) => {
      console.error("Error:", err);
    });
});

function decodeJWT(token) {
  let base64Url = token.split(".")[1];
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

function handleCredentialResponse(response) {
  const body = { id_token: response.credential };
  fetch("http://localhost:8080/api/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id_token: response.credential }),
  })
    .then((res) => res.json(body))
    .then((data) => {
      localStorage.setItem("token", data.token);
      window.location = "chat.html";
    })
    .catch((err) => {
      console.error("Error:", err);
    });
}

window.onload = function () {
  signOutButton.onclick = () => {
    const email = localStorage.getItem("email");
    console.log(email);
    google.accounts.id.disableAutoSelect();

    localStorage.removeItem("email");
    console.log("User signed out.");
    localStorage.clear();
    location.reload();
  };
};
