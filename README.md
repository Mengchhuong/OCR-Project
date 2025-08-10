# Automating the Digitization of Printed and Handwritten Khmer Documents Using OCR

A modern web application frontend designed for the digitization of Khmer-language documents. This project provides a clean, intuitive user interface for uploading document images/PDFs and displaying extracted content, ready to be integrated with any OCR backend.

---

## 📄 Table of Contents

- [📄 Project Description](#project-description)
- [✨ Key Features](#key-features)
- [🎯 Target Use Cases](#-target-use-cases)
- [⚙️ Tech Stack](#️tech-stack)
- [🔧 Developer-Focused Architecture](#developer-focused-architecture)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
- [📄 Acknowledgements](#Acknowledgements)

---

## 📄 Project Description

Khmer Document Digitizer is a modern web application built to support the digitization of Khmer-language documents through a clean, intuitive user interface. This application allows users to upload scanned images or PDF files of printed Khmer texts and provides a responsive interface for displaying extracted content.

The goal of this project is to assist in the preservation and digitization of Khmer documents and literature by providing a seamless, user-friendly tool for document submission, viewing, and future post-processing of OCR results.

---

## ✨ Key Features

- 🖼 **Upload Interface:** Supports Khmer document files (JPG, PNG, PDF).
- ⚙️ **Modern Framework:** Built with Next.js (App Router, TypeScript).
- 🎨 **Stylish UI:** Styled using Tailwind CSS for a sleek, responsive design.
- 🧩 **Component-Powered:** UI components from shadcn/ui for consistency and quality.
- ⚡ **Optimized for ML:** Designed for easy integration with machine learning-based OCR systems.
- 🌐 **Responsive Design:** Mobile-friendly and accessible on various devices.
- 🇰🇭 **Khmer-Language Focus:** Prioritizes Khmer-language support with modern UX principles.
- 💬 **Extendable:** Easily adaptable to support multilingual interfaces.

---

## 🎯 Target Use Cases

- **National Digitization Initiatives:** Assisting Cambodia in large-scale digitization efforts.
- **Academic & Archival Institutions:** Enabling the digitization of Khmer texts for research and preservation.
- **AI/ML Research:** Providing a frontend for teams building OCR models for Khmer script.
- **Cultural Preservation:** Supporting government or NGO efforts to preserve cultural records.

---

## ⚙️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (using App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Package Manager:** (Specify npm, yarn, or pnpm)
- **Linting/Formatting:** (e.g., ESLint, Prettier - if configured)

---

## 🔧 Developer-Focused Architecture

This project leverages modern frontend technologies and adheres to best practices in React development:

- **Modular Component Structure:** Promotes reusability and maintainability.
- **Global Styling with Tailwind:** Efficiently manages styles utility-first.
- **Accessible UI:** Utilizes shadcn/ui components, designed with accessibility in mind.
- **API Ready:** Easily connectable to RESTful APIs for the OCR backend.
- **Extensible:** Built for future growth, such as adding user authentication, history tracking, or role-based access.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/) (choose one)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Mengchhuong/OCR-Project
    cd frontend
    ```

### Frontend

2.  **Install dependencies:**
    - Using npm:
      ```bash
      npm install
      ```
    - Using yarn:
      ```bash
      yarn install
      ```
    - Using pnpm:
      ```bash
      pnpm install
      ```

### Running the Development Server

Once dependencies are installed, you can start the development server:

- Using npm:
  ```bash
  npm run dev
  ```
- Using yarn:
  ```bash
  yarn dev
  ```
- Using pnpm:
  ```bash
  pnpm dev
  ```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in your terminal) with your browser to see the application.

---

### Backend

3.  **Clone the repository:**

    ```bash
    cd backend
    cd .venv
    cd Scripts
    ```

4.  **Install dependencies:**

    - Using npm:
      ```bash
      activate.bat
      ```
    - Install Fastapi:

      ```
      pip install "fastapi[standard]"
      ```

    - Using npm:
      ```bash
      deactivate.bat
      ```

### Running the Development Server

Once dependencies are installed, you can start the development server:

- Using fastapi:
  ```bash
  fastapi dev app/main.py
  ```
- Using uvicorn:
  ```bash
  uvicorn app.main:app --reload
  ```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000) (or the port specified in your terminal) with your browser to see the application.

---

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
