# DermaGlow - AI-Powered Skincare Platform

An AI-driven skincare platform that analyzes user-uploaded skin images to detect concerns like acne, dark spots, or dark circles, and recommends personalized skincare products based on the results and user questionnaire responses.

---

## Features

📷 Image Upload & AI Skin Analysis -- Upload a skin image and get a predicted primary skin concern using a trained AI/ML model (TensorFlow/Keras).

🧑‍⚕️ Personalized Recommendations -- Suggests products after analyzing skin + questionnaire responses.

🌐 Full-Stack App -- Flask backend + React (React-Bootstrap) frontend.

🔒 CORS Enabled - Seamless communication between backend and frontend.

🛍️ Skincare Shop -- Browse products by category such as cleanser, serum, moisturiser, and sunscreen.

🛒 Cart and Demo Checkout -- Add products to cart, adjust quantities, and place demo orders that are saved in the database.

🔒User Authentication -- Sign up, log in, log out, and manage profile details.

💬 Reviews System -- Submit ratings and feedback, with reviews stored in the database.

👤 Profile and Order History -- Logged-in users can update personal information and view previous orders.

🌐 Static Website Pages -- Includes Privacy Policy, Terms & Conditions, FAQs, and Contact links.

---

## Project Structure

```bash
DermaGlowAI-capstone/
│── backend/                       # Flask backend
│   ├── app.py                     # Main Flask app
│   ├── models.py                  # Database models
│   ├── requirements.txt           # Backend dependencies
│   ├── routes/                    # API routes
│   │   ├── auth_routes.py
│   │   ├── order_routes.py
│   │   ├── personalised_products_routes.py
│   │   ├── product_routes.py
│   │   ├── review_routes.py
│   │   └── skin_analysis_routes.py
│   ├── models/                    # Trained ML model files
│   │   └── DermaGlow_model.keras
│   ├── uploads/                   # Temporary uploaded images
│   └── instance/                  # SQLite database
│
│── frontend/                      # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
│── README.md
```
---

## Installation & Setup

## Backend (Flask + TensorFlow)

### Clone the repo
```
git clone https://github.com/malak-khalil/DermaGlowAI-capstone.git
cd DermaGlowAI-capstone/backend
```

### Create virtual environment
```
python -m venv venv
source venv/bin/activate   # On Mac/Linux
venv\Scripts\activate      # On Windows
```

### Install dependencies
```
pip install -r requirements.txt
```

### Run Flask server
```
python app.py
```

Backend will run at: http://127.0.0.1:5000

## 🔹 Frontend (React + Bootstrap)
```
Open a new terminal and run:
cd DermaGlowAI-capstone/frontend
```

### Install dependencies
```
npm install
```

### Start development server
```
npm start
```

Frontend will run at: http://localhost:3000

---

## 🚀 Usage

-Open the website in the browser.
-Browse skincare products in the shop.
-Create an account or log in.
-Use AI Skin Analysis by uploading a clear skin image.
-Use the Product Finder for personalized recommendations.
-Add products to cart and complete demo checkout.
-View your profile and order history.
-Leave a review and rating.

---

## 🧠 Tech Stack

### Frontend
- React
- React Router
- React-Bootstrap
- CSS

### Backend
- Flask
- Flask-CORS
- Flask-SQLAlchemy
- SQLite

### AI / Machine Learning
- TensorFlow / Keras
- NumPy

### Database
- TSQLite
- PostgreSQL

---

## 📌 Future Improvements

Add secure forgot-password by email

Add real payment gateway integration

Improve model accuracy with larger datasets.

Save AI analysis history per user

Deploy to Heroku / Vercel / AWS.

Integrate with e-commerce APIs for live product recommendations.

Add admin dashboard for product and review management  

---

## AI Skin Analysis Notes

The AI analysis uses a trained .keras model stored in: backend/models/DermaGlow_model.keras

For best results, upload:
    -clear images
    -good lighting
    -visible skin area
    -minimal blur or filters

-----

##Database

The project uses SQLite for development.

Main database entities include:

-User
-Product
-Order
-OrderItem
-Review

These support authentication, product browsing, cart checkout, order history, and customer reviews.

------

## Current Pages
-Home
-Shop
-Product Finder
-AI Skin Analysis
-Reviews
-User Profile
-Checkout
-Payment
-Privacy Policy
-Terms & Conditions
-FAQs

-------
 