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