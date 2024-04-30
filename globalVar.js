let username = '';

function setUsername(newUsername) {
    username = newUsername;
}

function getUsername() {
    return username;
}

function clearUser() {
    username = '';
}

module.exports = {
    setUsername,
    getUsername,
    clearUser
};
