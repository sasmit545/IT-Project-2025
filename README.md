# Sitebbuilder

**Sitebbuilder** is a no-code website builder that enables users to design and publish websites without writing any code. Built for both beginners and professionals, it provides a clean drag-and-drop interface, customizable templates, and real-time previews.

**Live Demo**: [https://it-project-2025.vercel.app](https://it-project-2025.vercel.app)

---

## Features

* Drag-and-drop website builder
* Pre-designed professional templates
* Fully customizable layout, fonts, and colors
* Real-time preview of changes
* Secure user authentication and project management

---

## Tech Stack

**Frontend**

* React
* Vercel (Deployment)

**Backend**

* Node.js, Express.js
* MongoDB Atlas (Database)
* Cloudinary (Media Storage)
* JWT & bcryptjs (Authentication)
* Render (Deployment)

**Version Control**

* GitHub

---

## Getting Started

### Prerequisites

* Node.js and npm
* MongoDB Atlas account
* Cloudinary account

---

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/sitebbuilder.git
cd sitebbuilder

# Setup frontend
cd frontend
npm install
npm run dev

# Setup backend
cd ../backend
npm install
npm run dev
```

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


---

## Folder Structure

```
sitebbuilder/
├── frontend/          # React application
├── backend/           # Node.js + Express API
├── .gitignore
├── README.md
```

---
