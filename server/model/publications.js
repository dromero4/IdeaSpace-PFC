export async function addPublication(connection, date, username, content, likes, comments) {
    const query = "INSERT INTO publications (date, username, content, likes, n_comments) VALUES (?, ?, ?, ?, ?)";
    try {
        const [result] = await connection.execute(query, [date, username, content, likes, comments]);
        return result.insertId; // Devuelve el ID de la publicación recién creada
    } catch (error) {
        console.error("Error al añadir publicación:", error);
        throw error;
    }
}

export async function getPublications(connection) {
    const query = "SELECT * FROM publications";
    try {
        const [rows] = await connection.execute(query);
        return rows;
    } catch (error) {
        console.error("Error al obtener publicaciones:", error);
        throw error;
    }
}