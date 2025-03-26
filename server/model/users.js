// ADD USER TO THE DATABASE
export function addUser(connection, name, username, birthdate, email, password, signup_date, callback) {
    const query = "INSERT INTO users (name, username, birthdate, email, password, signup_date) VALUES (?, ?, ?, ?, ?, ?)";

    connection.query(query, [name, username, birthdate, email, password, signup_date], (err, results) => {
        if (err) {
            console.error("There was a problem doing the consult")
            return callback(err, null);
        }

        return callback(null, results);
    })
}

// VERIFY USER INPUTS BEFORE ADDING TO THE DATABASE
export function verifyInputs(name, username, password1, password2, email, date) {
    const errors = [];
    const dateNow = new Date();

    if (name == '' || username == '' || password1 == '' || password2 == '' || email == '' || date == '') errors.push('The inputs can not be empty');

    if (typeof name !== 'string') errors.push('Name must be a string');
    if (name.length < 1 || name.length > 50) errors.push('Name must be between 1 and 50 characters');
    if (username.length < 1 || username.length > 50) errors.push('Username must be between 1 and 50 characters');
    if (!password1 || !password2) {
        errors.push('Passwords cannot be empty');
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password1)) {
        errors.push('Password must have at least 8 characters, one lowercase, one uppercase, one number, and one special character');
    } else if (password1 !== password2) {
        errors.push('Passwords must match');
    }
    if (email.length < 1 || email.length > 100) errors.push('Email must have less than 100 characters');

    const birthDate = new Date(date);
    if (birthDate > dateNow) errors.push('Date of birth cannot be in the future');

    return errors;
}

export async function isUserExisting(connection, email) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE email = ?";

        connection.execute(query, [email], (err, results) => {
            if (err) return reject(err);

            if (results.length > 0) resolve(true);
            else resolve(false);
        });
    })
}

export function isUsernameRepeated(connection, username) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE username = ?";

        connection.execute(query, [username], (err, results) => {
            if (err) return reject(err);

            if (results.length > 0) resolve(true)
            else resolve(false);
        })
    })
}