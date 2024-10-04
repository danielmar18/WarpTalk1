// Global variables
let wt = new WarpTalk("wss", "warp.cs.au.dk/talk/");
let nickname = undefined;
let clientList = {};
let channelList = [];
let activeRoom = undefined;

// Miscellaneous functions used in the chat

// Function called when user clicks 'confirm' in the nickname prompt
const setNickname = () => {
  let inputNickname = document.getElementById("prompt-input").value;
  nickname = inputNickname;
  wt.connect(connected, inputNickname);
  let div = document.getElementById("nickname-prompt");
  div.classList.remove("visible");
  div.classList.add("hidden");
}

// Function used to trigger the nickname prompt if the user is not logged in
wt.isLoggedIn(function(isLoggedIn) {
    if (isLoggedIn) {
        wt.connect(connected);
    } 
    else { 
      let div = document.getElementById("nickname-prompt");
      div.classList.remove("hidden");
      div.classList.add("visible");
    }
});
// --------------------------------------------------------------------------------------------

// * Toggle/Helper Functions Functions

// Function used to 'open' and 'close' the menu for choosing channels
const toggleChannelChoice = () => {
  let div = document.getElementById("channel-choice-prompt");
  if(nickname !== undefined) { // CTRL should not be able to open the channel choice menu if there is no nickname
    div.classList.toggle("hidden");
    div.classList.toggle("visible-channels");
  }
}

// Function which is passed to event listener
const toggleChannelChoiceHandler = (e) => {
  if(e.key === "Control") {
    toggleChannelChoice();
  }
}

// Load bearing function in the 'shifting' between channels - It rolls through all 'open' channels and closes the ones that are not the active one and opens the active one
// This might very well be one of the ugliest functions I have ever written, but it does not work any other way
// Using .toggle() resulted in some very strange behavior, so manual manipulation was the only way I got it to work
const toggleChannels = (channelName, inputRoom) => {
  activeRoom = inputRoom;
  channelList.forEach(channel => {
    let msgChannelDiv = document.getElementById(`${channel}-msgs`);
    let clientChannelDiv = document.getElementById(`${channel}-clients`);
    let arr = [...document.getElementById("channel-names").querySelectorAll("*")];
    
    channelButton = arr.find(el => el.innerText == channel);

    if(channel !== channelName) {
      msgChannelDiv.classList.remove("flex-col");
      msgChannelDiv.classList.remove("shadow-sm");
      msgChannelDiv.classList.remove("msg-list");
      msgChannelDiv.classList.add("msg-list-hidden");
      clientChannelDiv.classList.remove("flex-col");
      clientChannelDiv.classList.remove("shadow-sm");
      clientChannelDiv.classList.remove("client-list");
      clientChannelDiv.classList.add("client-list-hidden");
      channelButton.classList.remove("channel-name-selected");
      channelButton.classList.add("channel-name");
    } else {
      msgChannelDiv.classList.add("flex-col");
      msgChannelDiv.classList.add("shadow-sm");
      msgChannelDiv.classList.add("msg-list");
      msgChannelDiv.classList.remove("msg-list-hidden");
      clientChannelDiv.classList.add("flex-col");
      clientChannelDiv.classList.add("shadow-sm");
      clientChannelDiv.classList.add("client-list");
      clientChannelDiv.classList.remove("client-list-hidden");
      channelButton.classList.add("channel-name-selected");
      channelButton.classList.remove("channel-name");
    }

  })
}
// * --------------------------------------------------------------------------------------------

// ? Event Listeners Bindings

// Used to bind the clicks, 'Enter' key and 'Control' key to the corresponding functionality of the chat
const bodyDiv = document.querySelector("body");
const inputContainer = document.getElementById("input");
const promptInputContainer = document.getElementById("prompt-input-container");

// Event listener for the channel menu toggling
bodyDiv.addEventListener("keydown", (e) => toggleChannelChoiceHandler(e));

// Event listeners for the input field used to write and send messages
inputContainer.querySelector('#icon-container').addEventListener("click", () => {
  let inputValue = inputContainer.querySelector('#msg-input').value;
  if(inputValue !== "") {
    activeRoom.send(inputValue);
    document.getElementById("msg-input").value = "";
  }
});

inputContainer.querySelector('#msg-input').addEventListener("keypress", (e) => {
  if(e.key === "Enter") {
    let inputValue = inputContainer.querySelector('#msg-input').value;
    if(inputValue !== "") {
      activeRoom.send(inputValue);
      document.getElementById("msg-input").value = "";
    }
  }
})

// Event listener for the 'confirm' button in the nickname prompt in the beginning
promptInputContainer.querySelector('#prompt-confirm-button').addEventListener("click", setNickname);

promptInputContainer.querySelector('#prompt-input').addEventListener("keypress", (e) => {
  if(e.key === "Enter" && nickname === undefined) {
    setNickname();
  }
})

// ? --------------------------------------------------------------------------------------------