// THIS UTILIZED GOOGLE AUTH AND STRIPE


use tauri::command;
use reqwest::Client;
use stripe::{Client as StripeClient, Customer, CreateCustomer};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct GoogleToken {
    pub token: String,
}

// A command that handles Google OAuth token verification and Stripe customer creation
#[command]
async fn handle_google_login(google_token: GoogleToken) -> Result<String, String> {
    // Step 1: Verify the Google ID token with Google's API
    let token = &google_token.token;

    let client = Client::new();
    let google_response = client
        .get(format!(
            "https://oauth2.googleapis.com/tokeninfo?id_token={}",
            token
        ))
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json::<GoogleUserInfo>()
        .await
        .map_err(|e| e.to_string())?;

    // Step 2: Create the Stripe customer using the email from the Google profile
    let stripe_client = StripeClient::new("<YOUR_STRIPE_SECRET_KEY>");
    let create_customer = CreateCustomer {
        email: Some(google_response.email),
        ..Default::default()
    };

    let customer: Customer = stripe_client
        .customers()
        .create(create_customer)
        .await
        .map_err(|e| e.to_string())?;

    // Return the customer ID as a confirmation
    Ok(format!("Stripe customer created with ID: {}", customer.id))
}

#[derive(Deserialize)]
struct GoogleUserInfo {
    email: String,
    name: String,
}



