export async function addLike(connection, username, publicationID) {
    const query = "INSERT INTO likes (username, publicationID) VALUES (?, ?)";
    try {
        await connection.execute(query, [username, publicationID]);
    } catch (error) {
        console.error("Error al añadir like:", error);
        throw error;
    }
}

export async function removeLike(connection, username, publicationID) {
    const query = "DELETE FROM likes WHERE username = ? AND publicationID = ?";
    try {
        await connection.execute(query, [username, publicationID]);
    } catch (error) {
        console.error("Error al quitar like:", error);
        throw error;
    }
}

export async function getLikes(connection, publicationID) {
    const query = "SELECT COUNT(*) as likes FROM likes WHERE publicationID = ?";
    try {
        const [rows] = await connection.execute(query, [publicationID]);
        return rows[0].likes;
    } catch (error) {
        console.error("Error al obtener likes:", error);
        throw error;
    }
}