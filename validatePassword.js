function validatePassword(password) {
    if (password.length < 6) {
        return false;
    }

    if (!/\d/.test(password)) {
        return false;
    }

    if (!/[A-Z]/.test(password)) {
        return false;
    }

    return true;
}

module.exports =  validatePassword;