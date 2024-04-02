let username = '';

function setUsername(newUsername) {
    username = newUsername;
}

function getUsername() {
    return username;
}
function clearUser(){
    username =null;
}
module.exports = {
    setUsername,
    getUsername,
    clearUser
};
