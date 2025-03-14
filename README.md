<!-- @format -->

# Tauri + SvelteKit + TypeScript

## TailwindCSS + SQLx + Stripe

## Auth is Google +

This template should help get you started developing with Tauri, SvelteKit and TypeScript in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer).

cd calculator
npm install
npm run tauri android init
npm run tauri ios init

For Desktop development, run:
npm run tauri dev

For Android development, run:
npm run tauri android dev

For iOS development, run:
npm run tauri ios dev

1. Set up your Google OAuth credentials
   First, create OAuth credentials in the Google Cloud Console:

Go to the Google Cloud Console and create a new project (or use an existing one)
Navigate to "APIs & Services" > "Credentials"
Create an OAuth client ID
Choose "Desktop application" as the application type
Set the authorized redirect URIs to something like: http://localhost:5173/auth/callback (or whatever port your SvelteKit dev server uses)

You should still maintain:

A logout functionality
Session/token management
Protected routes that check for authentication
# TauriStarter
