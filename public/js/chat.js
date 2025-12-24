let user = null;
let socket = null;

/// Html references
const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsers = document.querySelector("#ulUsers");
const btnOut = document.querySelector("#btnOut");
const ulMessages = document.querySelector("#ulMessages");

let messagesHtml = "";

async function validateJWT() {
  const token = localStorage.getItem("token") || "";
  if (token.length <= 10) {
    window.location = "index.html";
    throw new Error("No token found");
  }
  const resp = await fetch("http://localhost:8080/api/auth/", {
    method: "POST",
    headers: { Authorization: token },
  });
  const { user: userDB, token: tokenDB } = await resp.json();
  localStorage.setItem("token", tokenDB);
  user = userDB;
  document.title = user.name;

  await connectSocket();
}

const connectSocket = async () => {
  const token = localStorage.getItem("token") || "";
  socket = io({
    extraHeaders: {
      Authorization: token,
    },
  });

  socket.on("connect", () => {
    console.log("Sockets online");
  });

  socket.on("disconnect", () => {
    console.log("Sockets offline");
  });

  socket.on("recieve-messages", drawMessages);

  socket.on("active-users", drawUsers);

  socket.on("private-message", drawPrivateMessage);
};

const drawUsers = (users = []) => {
  let usersHtml = "";
  users.forEach(({ name, uid }) => {
    usersHtml += `
    <li>
    <p>
    <h5 class="text-success">${name}</h5>
          <span class="fs-6 text-muted">${uid}</span>
        </p>
        </li>
        `;
  });
  ulUsers.innerHTML = usersHtml;
};

const drawMessages = (last10 = []) => {
  last10.forEach(({ name, message }) => {
    messagesHtml += `
      <li>
      <p>
      <span class="text-primary">${name}:</span>
      <span>${message}</span>
      </p>
      </li>
      `;
  });
  ulMessages.innerHTML = messagesHtml;
};

const drawPrivateMessage = (messages = []) => {
  messages.forEach(({ name, message }) => {
    messagesHtml += `
    <li>
    <p>
    <span class="text-primary">${name}(Private):</span>
    <span>${message}</span>
    </p>
    </li>
    `;
  });
  ulMessages.innerHTML = messagesHtml;
};

btnOut.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location = "index.html";
  socket.disconnect();
});

txtMensaje.addEventListener("keyup", ({ keyCode }) => {
  const message = txtMensaje.value;
  const uid = txtUid.value;
  if (keyCode !== 13) return;
  if (message.length === 0) return;
  socket.emit("send-message", { message, uid });
  txtMensaje.value = "";
});

const main = async () => {
  await validateJWT();
};

main();
