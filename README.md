# 🐅 NANDANKANAN – The Living World of Wildlife
### ନନ୍ଦନକାନନ ପ୍ରାଣୀ ଉଦ୍ୟାନ • Experience the Wild. Protect the Future.

[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Django](https://img.shields.io/badge/Backend-Django%20REST-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An immersive, cinematic, and modern wildlife conservation web platform dedicated to **Nandankanan Zoological Park** (Bhubaneswar, Odisha, India) — world-renowned pioneer in white tiger guardianship and premier 437-hectare sanctuary.

---

## ✨ Key Features

- 🐅 **Cinematic Tiger Hero Section**: Ultra-high-definition walking Royal Bengal Tiger video hero with bilingual Odia & English typography (`ଯେଉଁଠି ବନ୍ୟଜୀବନ ପାଏ ଆଶ୍ରୟ • WHERE THE WILD FINDS ITS HOME`).
- 🗺️ **Interactive Enclosure Map**: Visual sanctuary map with clickable animal habitats, zoom-in focus, instant live stream player integration, and animal audio roars.
- 🔴 **The Wild, Live (Streaming Feeds)**: Dedicated live camera feeds (Royal Bengal Tiger, Asiatic Lion, Asian Elephant, Sloth Bear, Spotted Deer, Indian Peafowl) with real-time viewer stats and demo modes.
- 🐾 **Explore Wildlife**: Comprehensive species directory covering mammals, birds, reptiles, and wetlands with search, category filtering, and modal dossiers.
- 💬 **Interactive AI Chatbot ("Ask Nandankanan")**: Instant answers on park hours, safari timings, ticketing, animal welfare, and conservation programs.
- 🌿 **Conservation & Animal Stories**: *"Every Life Has a Story"* — spotlighting rescue, wildlife rehabilitation, and pangolin breeding success.
- 🎟️ **Park Visitation & Ticket Booking**: Integrated ticket booking and virtual animal sponsorship with instant certification preview.
- 🎧 **Interactive Audio Experience**: Custom animal sound player bringing the sanctuary's soundscape directly to visitors.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Forest Green Glassmorphism Palette
- **Icons & Graphics**: Lucide React + Custom SVG assets
- **3D / Canvas**: Three.js / Canvas Interactive Tiger Visualizer

### Backend
- **Framework**: Python 3.12 + Django 5 + Django REST Framework
- **Database**: SQLite (Ready for PostgreSQL)
- **CORS**: django-cors-headers

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/somyasurya-dwi/Nandankanan-Wildlife.git
cd Nandankanan-Wildlife
```

### 2. Backend Setup (Django)
```bash
# Navigate to backend
cd backend

# Install dependencies (or activate your python virtual environment)
pip install django djangorestframework django-cors-headers

# Apply migrations
python manage.py migrate

# Seed initial sanctuary and map marker data
python seed_data.py

# Run Django API server
python manage.py runserver 127.0.0.1:8000
```
Backend API will be accessible at `http://127.0.0.1:8000/api/`.

### 3. Frontend Setup (React + Vite)
```bash
# In a new terminal, navigate to frontend
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## 🎨 Color Palette

| Name | Hex Code | Role |
| --- | --- | --- |
| Deep Forest Green | `#123D2B` | Primary branding & Navbar |
| Nature Green | `#26734D` | Secondary elements & badges |
| Soft Ivory | `#F5F4EA` | Clean reading background |
| Golden Sand | `#C8A96B` | Accents & Odia typography |
| Dark Charcoal | `#202820` | Primary readable text |

---

## 🏛️ Official Nandankanan Information
- **Location**: Bhubaneswar, Odisha 754005, India
- **Established**: 1960
- **Sanctuary Hours**: 07:30 AM – 05:30 PM (Closed on Mondays)
- **Significance**: Pioneer in white tiger breeding and the world's premier host for Indian Pangolin and Gharial captive breeding.

---

## 📄 License
This project is open-source and released under the MIT License.
