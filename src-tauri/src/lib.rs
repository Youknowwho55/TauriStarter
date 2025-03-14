// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use dotenv::dotenv;
use std::env;


#[tauri::command]
fn greet(name: &str) -> String {
    format!(
        "Hello, {}! You've been greeted from the backend Rust program!",
        name
    )
}

#[tauri::command]
fn counter(count: &str) -> String {
    format!("{}!", count)
}




#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    dotenv().ok(); // Load .env file

    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        // initialize_database
        .invoke_handler(tauri::generate_handler![greet, counter, ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}




