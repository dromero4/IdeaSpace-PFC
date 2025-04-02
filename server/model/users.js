import bcrypt from 'bcrypt';

// ADD USER TO THE DATABASE
export async function addUser(connection, name, username, birthdate, email, password, signup_date) {
    const query = "INSERT INTO users (name, username, birthdate, email, password, signup_date) VALUES (?, ?, ?, ?, ?, ?)";

    const [rows] = await connection.execute(query, [name, username, birthdate, email, password, signup_date]);

    if (rows) return true;

    return false;
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
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await connection.execute(query, [email]);

    if (rows.length > 0) return true;

    return false;
}

export async function isUsernameRepeated(connection, username) {
    const query = "SELECT * FROM users WHERE username = ?";
    const [rows] = await connection.execute(query, [username]);

    if (rows.length > 0) return true;

    return false;
}

export async function login(connection, username, password) {
    try {
        if (!username || !password) {
            throw new Error("Username or password is missing");
        }

        // Conseguir la contraseña del usuario introducido.
        const query = "SELECT password FROM users WHERE username = ?";
        const [rows] = await connection.execute(query, [username]);

        console.log("Query result:", rows);  // <-- Verifica qué devuelve la consulta

        if (rows.length === 0) {
            console.log("User not found in database");
            return false;
        }

        const hashedPassword = rows[0].password;

        console.log("Stored hashed password:", hashedPassword);
        console.log("Entered password:", password);

        // Comparar contraseñas
        const match = await bcrypt.compare(password, hashedPassword);

        return match;
    } catch (error) {
        console.error("Error during login:", error);
        throw new Error("Error durante la autenticación: " + error.message);
    }
}


export async function getInformation(connection, username) {
    const query = "SELECT * FROM users WHERE username = ?";

    const [rows] = await connection.execute(query, [username]);

    if (rows.length === 0) {
        return false;
    }

    return rows[0];
}
