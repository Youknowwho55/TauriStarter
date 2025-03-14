#[tauri::command]
fn initialize_database() -> Result<(), String> {
    // Create a connection to the SQLite database (it will create the file if it doesn't exist)
    let conn = Connection::open("local_database.db").map_err(|e| e.to_string())?;

    // Create a simple table if it doesn't exist
    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL
        )",
        params![],
    )
    .map_err(|e| e.to_string())?;

    Ok(())
}