# Aacharya Shwetaa Kapoor Astrology Website

A full-stack web application built for Aacharya Shwetaa Kapoor. 

## Tech Stack
*   **Frontend:** React (Vite), Tailwind CSS v4, Framer Motion, GSAP, React Router, Lenis
*   **Backend:** Node.js, Express, MongoDB, JWT, bcrypt
*   **Architecture:** Monorepo with `/client` and `/server`

## Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB running locally or a MongoDB Atlas URI

### 1. Server Setup
1.  Navigate to the `/server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Copy `.env.example` to `.env` and update your variables:
    ```bash
    cp .env.example .env
    ```
4.  Run the server:
    ```bash
    npm run dev
    ```
    (The server will start on `http://localhost:5000`)
5.  Seed the database (Testimonials and Admin account):
    Send a POST request to `http://localhost:5000/api/seed` using Postman or cURL.

### 2. Client Setup
1.  Navigate to the `/client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    (The frontend will start on `http://localhost:5173`)

## Features
*   Smooth scrolling and stunning page transitions.
*   GSAP ScrollTrigger animations.
*   Framer Motion components.
*   Fully responsive UI.
*   Working contact form integrated with backend API.
