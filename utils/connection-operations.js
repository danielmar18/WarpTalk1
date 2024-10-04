// 'Borrowed' & repurposed function from the provided example code
function connected() {

  // Connect to 'General' by default (Admittedly, this is vulnerable to changes in the order of rooms, but again, time is not unlimited)
  let room = wt.join(wt.availableRooms[0].name);

  // Set the active room to the joined room
  activeRoom = room;

  // Add the room to the channel list
  channelList.push(wt.availableRooms[0].name);

  // Add event listeners for the 'General' channel so it is possible to click it as well
  let generalChannelButton = document.getElementById("channel-names").children[2];
  
  generalChannelButton.addEventListener("click", () => toggleChannels("General", room));
  
  let channelChoices = document.getElementById("channel-choices");

  // For each room we want to create an entry in the channel menu, as well as adding the functionality of joining a new room, adding it to the channel list up top, and being able to click it
  // Once again, not the most elegant solution, but you can't have it all
  wt.availableRooms.forEach(r => {

      // Create the div for the channel choice
      let div = document.createElement("div");
      div.classList.add("channel-choice");

      if(channelList.includes(r.name)) {
        div.classList.add("channel-choice-selected");
      }

      // Create the div for the channel name
      let nameDiv = document.createElement("div");
      nameDiv.classList.add("channel-choice-name");
      nameDiv.appendChild(document.createTextNode(r.name));

      // Create the div for the channel description
      let descDiv = document.createElement("div");
      descDiv.classList.add("channel-description");
      descDiv.appendChild(document.createTextNode(r.description));

      div.appendChild(nameDiv);
      div.appendChild(descDiv);

      // Add the event listener for joining the channel and creating the corresponding 'artefacts' as a result
      div.addEventListener("click", () => {
        if(!channelList.includes(r.name)) { // Check if the channel is already joined

          // Join the room and add it to the channel list
          let newRoom = wt.join(r.name);
          channelList.push(r.name);

          // Mark the channel as one of the selected
          div.classList.add("channel-choice-selected");
          toggleChannelChoice();

          // Create and add the channel to the channel list above the chat itself
          let channelContainer = document.getElementById("channel-names");
          let channelDiv = document.createElement("div");
          channelDiv.classList.add("channel-name");
          channelDiv.appendChild(document.createTextNode(r.name));
          channelDiv.addEventListener("click", () => toggleChannels(r.name, newRoom)); // Connect it to the horrible toggling function of mine
          channelContainer.appendChild(channelDiv);

          // Create the empty chat room and client list itself and set the corresponding event listeners and attributes
          let generalRoom = document.getElementById("General-msgs");
          let generalClients = document.getElementById("General-clients");
          let newChatRoom = document.createElement("div");
          let newClientList = document.createElement("div");
          newChatRoom.id = `${r.name}-msgs`;
          newClientList.id = `${r.name}-clients`;
          newChatRoom.classList.add("msg-list-hidden");
          newClientList.classList.add("client-list-hidden");

          // Quite an elegant way of stacking the chats and client lists in the parent div with little effort
          // Credit: https://stackoverflow.com/a/21422401
          generalRoom.parentNode.insertBefore(newChatRoom, generalRoom.nextSibling);
          generalClients.parentNode.insertBefore(newClientList, generalClients.nextSibling);

          // Add the event listeners for the new room
          // Admittedly, this is redundant and could be refactored into a function or more elegant solution but you can't win them all
          newRoom.onMessage((room, msg) => {
            addNewMessage(room.name, msg.message, msg.sender, msg.sender == nickname);
          });
      
                  
          newRoom.onJoin((room, nickname) => {       
            if(clientList[room.name] === undefined) {
                clientList[room.name] = room.clients.map(client => client.nickname);
                clientList[room.name].forEach(client => {
                  addNewClient(room.name, client);
                })
            }else{
                clientList[room.name].push(nickname);
                addNewClient(room.name, nickname);
            }
            addActivity(room.name, nickname, ` joined the chatroom`);
          });
      
          newRoom.onLeave((room, nickname) => {
              clientList[room.name] = clientList[room.name].filter(client => client !== nickname);
              removeClient(room.name, nickname);
              addActivity(room.name, nickname, ` left the chatroom`);
          });

          newRoom.onDisconnect((room) => {
            addActivity(room.name, "", "You have been disconnected from the chatroom", true);
          });
        }
    
      });
      channelChoices.appendChild(div);
  });

  // Add the event listener for the initial 'General' channel
  room.onMessage((room, msg) => {
    addNewMessage(room.name, msg.message, msg.sender, msg.sender == nickname);
  });

  room.onJoin((room, nickname) => {       
      if(clientList[room.name] === undefined) {
        clientList[room.name] = room.clients.map(client => client.nickname);
        clientList[room.name].forEach(client => {
          addNewClient(room.name, client);
        })
      }else{
        clientList[room.name].push(nickname);
        addNewClient(room.name, nickname);
      }
      addActivity(room.name, nickname, ` joined the chatroom`);
  });

  room.onLeave((room, nickname) => {
      clientList[room.name] = clientList[room.name].filter(client => client !== nickname);
      removeClient(room.name, nickname);
      addActivity(room.name, nickname, ` left the chatroom`);
  });

  room.onDisconnect((room) => {
    addActivity(room.name, "", "You have been disconnected from the chatroom", true);
  });

  // I didn't touch these so ther are stragiht from the example code
  // These two lines puts the functions on the global window object so
  // so they can be called from the JavaScript console
  window.send = function(msg) {
      room.send(msg);
  };
  window.login = function(username, password) {
      wt.login(username, password);
  }
  window.logout = function() {
      wt.logout();
  }
};
