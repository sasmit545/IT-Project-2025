# Sitebbuilder  <img src="https://res.cloudinary.com/dfgoyoeml/image/upload/v1746971973/wwvstk5vxklqb4pntxw3.png" alt="Sitebbuilder Logo" width="40" style="vertical-align: middle; margin-left: 10px;">

**Sitebbuilder** is a no-code website builder that empowers users to design and publish professional websites without writing a single line of code. With a drag-and-drop interface, customizable templates, and real-time preview, it provides a seamless and flexible web design experience for both beginners and professionals.

**Live Demo**: [https://it-project-2025.vercel.app](https://it-project-2025.vercel.app)

---

## Screenshots

### Editor Interface

![Editor](https://res.cloudinary.com/dfgoyoeml/image/upload/v1746971897/qlxma0n0mnenbni9wq3p.png)

### Dashboard

![Dashboard](https://res.cloudinary.com/dfgoyoeml/image/upload/v1746972068/sveqgod13iha9rwf0o9s.png)

### Templates Page

![Templates](https://res.cloudinary.com/dfgoyoeml/image/upload/v1746972084/mtepahajnjx7mnc6p7b9.png)

### Logo

![Sitebbuilder Logo](https://res.cloudinary.com/dfgoyoeml/image/upload/v1746971973/wwvstk5vxklqb4pntxw3.png)

---

## Features

* Drag-and-drop builder for intuitive editing
* Pre-designed templates for fast startup
* Real-time preview for instant feedback
* Fully customizable components: layout, fonts, colors
* Secure login and project management system

---

## Tech Stack

**Frontend**

* React
* Deployed on Vercel

**Backend**

* Node.js, Express.js
* MongoDB Atlas (cloud database)
* bcryptjs and JWT for authentication
* Cloudinary for media storage
* Deployed on Render

**Version Control**

* GitHub

---

## Getting Started

### Prerequisites

* Node.js and npm installed
* MongoDB Atlas account
* Cloudinary credentials

---

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/sitebbuilder.git
cd sitebbuilder

# Frontend setup
cd frontend
npm install
npm run dev

# Backend setup
cd ../backend
npm install
npm run dev
````

---

### Environment Variables

Create a `.env` file in the `backend/` directory with the following keys:

```
MONGODB=your_mongodb_connection_string
JWT_SECRET_AUTH=your_jwt_secret_auth
JWT_EXPIRY_AUTH=1d
JWT_SECRET_REFRESH=your_jwt_secret_refresh
JWT_EXPIRY_REFRESH=7d
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=8000
CORS_ORIGIN=http://localhost:5173
```

> Tip: Refer to a `.env.example` file to structure your configuration. Never commit your real `.env` file to version control.

---

## Folder Structure

```
sitebbuilder/
├── frontend/          # React application
├── backend/           # Node.js + Express API
├── .gitignore
├── README.md
```



