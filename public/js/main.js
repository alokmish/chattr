const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.main__messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get userName and roomName from the URL
const {
  username,
  room
} = Qs.parse(window.location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join chat room
socket.emit('joinRoom', {
  username,
  room
});

// Handle room and users info
socket.on('roomUsers', ({
  room,
  users
}) => {
  updateRoomName(room);
  updateRoomUsers(users);
})

// Handle messages from server
socket.on('message', message => {
  displayMessage(message);

  // Scroll down to show the new message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Handle message sending
chatForm.addEventListener('submit', e => {
  // Prevent default behaviour to writing to a file
  e.preventDefault();

  // Get message text from the input
  const message = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage', message);

  // Clear message input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

// Display message in the chat window
function displayMessage(message) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message');
  msgDiv.innerHTML = `<p class="meta">${message.userName} <span>${message.timeStamp}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
  document.querySelector('.main__messages').appendChild(msgDiv);
}

// Update the display with room name
function updateRoomName(room) {
  roomName.innerText = room;
}

// Update the display with room users
function updateRoomUsers(users) {
  userList.innerHTML = `
      ${users.map(user => `<li>
        <span class="fas fa-user-circle"></span>
        <span>${user.username}</span>
      </li>`).join('')}
    `;
}