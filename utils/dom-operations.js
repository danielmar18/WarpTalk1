
// Adds a new client to the client list in the corresponding room
const addNewClient = (room = "General-msgs", clientName) => {
  let list = document.getElementById(`${room}-clients`);
  let newDiv = document.createElement("div");
  let iconDiv = document.createElement("div");
  let contentDiv = document.createElement("div");

  if(clientName !== "") {
    clientName === nickname && newDiv.classList.add("client-self"); // Check if the client is my own user
    newDiv.classList.add("client");
    newDiv.classList.add("flex");

    // Check if the client is me, if so, use the personal gradient
    let gradient = clientName == nickname ? personalGradient : generateGradient(clientName);
    iconDiv.style.background = gradient;
    iconDiv.style.background = `-webkit-${gradient}`
    iconDiv.classList.add("client-icon");
    iconDiv.classList.add("shadow-sm");

    contentDiv.classList.add("client-content");
    contentDiv.appendChild(document.createTextNode(clientName));
  
    newDiv.appendChild(iconDiv);
    newDiv.appendChild(contentDiv);
    list.appendChild(newDiv);
  }
}

// Remove a client from the client list in the corresponding room
const removeClient = (room = "General-msgs", clientName) => {
  let parentElement = document.getElementById(`${room}-clients`);
  let list = parentElement.querySelectorAll(".client");
  list.forEach(div => {
    if(div.querySelector('.client-content').innerHTML === clientName) {
      parentElement.removeChild(div);
      gradientTracker = gradientTracker.filter(el => el.nickname !== clientName); // Make sure to remove the gradient from the tracker list as well
    }
  })
}

// Add a new message to the message list in the corresponding room
const addNewMessage = (room = "General-msgs", message, sender, self = false) => {
  let list = document.getElementById(`${room}-msgs`);
  let newDiv = document.createElement("div");
  let newUsernameDiv = document.createElement("div");
  let iconDiv = document.createElement("div");
  let contentDiv = document.createElement("div");

  if(self) newDiv.classList.add("msg-self");
  newDiv.classList.add("msg");
  newDiv.classList.add("flex");

  newUsernameDiv.classList.add("msg-content-username");
  newUsernameDiv.appendChild(document.createTextNode(`${new Date().getHours()}:${new Date().getMinutes()} | ${sender}`));

  iconDiv.classList.add("msg-client-icon");
  iconDiv.classList.add("shadow-sm");
  
  // Not as elegant as the one in addNewClient(), but it breaks if I try any other way and I don't have the time luxury of figuring out why
  let userGradientObj = gradientTracker.find(el => el.nickname === sender);
  if(userGradientObj){
    let gradient =  `linear-gradient(${angles[userGradientObj.angleIx]}, #762aa8 0%, ${colors[userGradientObj.colorIx]} 100%)`;
    iconDiv.style.background = gradient;
    iconDiv.style.background = `-webkit-${gradient}`
  }else {
    iconDiv.style.background = personalGradient;
    iconDiv.style.background = `-webkit-${personalGradient}`
  }

  contentDiv.classList.add("msg-content");
  contentDiv.appendChild(newUsernameDiv);

  // Credit for the idea: https://stackoverflow.com/a/15458987
  if(/<\/?[a-z][\s\S]*>/i.test(message)){
    contentDiv.innerHTML += message; // Opens up to possible XSS attacks, but since external libraries are not allowed I have to trust the server
  }else{
    contentDiv.appendChild(document.createTextNode(message));
  }
  
  newDiv.appendChild(iconDiv);
  newDiv.appendChild(contentDiv);
  list.appendChild(newDiv);

  list.scrollTop = list.scrollHeight;
}

// Add an activity message (joining, leaving or disconnecting from a room) to the message list in the corresponding room
const addActivity = (room = "General-msgs", nickname, message, alert = false) => {
  let list = document.getElementById(`${room}-msgs`);

  let usernameSpan = document.createElement("span");
  usernameSpan.id = "activity-indicator-username";
  usernameSpan.appendChild(document.createTextNode(nickname));

  let newDiv = document.createElement("div");
  newDiv.id = "activity-indicator";
  newDiv.classList.add("flex");
  newDiv.appendChild(usernameSpan);
  newDiv.appendChild(document.createTextNode(message));
  alert && newDiv.classList.add("activity-alert"); // Disconnect messages are marked red

  list.appendChild(newDiv);

  list.scrollTop = list.scrollHeight;
}