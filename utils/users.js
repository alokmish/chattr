const users = [];

// Add user to chat room
function addUserToRoom(id, username, room) {
  const user = {
    id,
    username,
    room
  };
  users.push(user);
  return user;
}

// Remove user from room
function removeUserFromRoom(id) {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// Gwt all users in a room
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  addUserToRoom,
  removeUserFromRoom,
  getCurrentUser,
  getRoomUsers
}