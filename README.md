# Next.js E-Commerce Store

Live Demo: [https://nextjs-ecommerce-store-pi.vercel.app](https://nextjs-ecommerce-store-pi.vercel.app)

## Description

A full-stack e-commerce web application built with the Next.js App Router. This project serves as a comprehensive example of a modern storefront, featuring a complete user journey from browsing products to adding items to a cart, alongside an admin dashboard for inventory management.

## Key Features

- **Product Catalog:** Browse and view detailed product information.
- **Shopping Cart:** Efficient state management for a seamless add-to-cart experience using Zustand.
- **Authentication:** Secure user registration and login implemented with NextAuth.js.
- **Admin Dashboard:** Protected routes allowing authorized users to manage product listings and categories.
- **Media Uploads:** Integrated Cloudinary for handling product image uploads.
- **Form Validation:** Robust client and server-side validation using React Hook Form and Zod.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4, Material Tailwind
- **State Management:** Zustand, SWR (Data Fetching)
- **Authentication:** NextAuth.js
- **Media Storage:** Cloudinary
- **Forms & Validation:** React Hook Form, Zod
- **Language:** TypeScript

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

Ensure you have Node.js installed on your machine.

### Installation

1.  Clone the repository and navigate into the directory:

    ```bash
    git clone https://github.com/rafiquee3/nextjs-ecommerce-store.git
    cd nextjs-ecommerce-store
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

### Environment Variables

Create a `.env.local` file in the root of your project and configure the following variables.

```env
# Base URL of the application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Cloudinary Configuration for Image Uploads
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
NEXT_PUBLIC_CLOUDINARY_UPLOADS_FOLDER=products
CLOUDINARY_API_SECRET=your_api_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_key
```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser to view the application.

## Testing Accounts

You can use the following credentials to test the application's authentication:

- **Test Account:**
  - Login: `admin`
  - Password: `Test1234`

## Project Structure

A high-level overview of the main directories:

- `app/`: Next.js App Router pages, API routes, and layouts.
- `src/components/`: Reusable React UI components.
- `src/data/`: Mock data or local JSON databases.
- `src/types/`: TypeScript interfaces and Zod schemas.
- `lib/`: Server-side utilities, helper functions, and database access logic.

## Deployment

This application is deployed on Vercel. Continuous deployment is configured to automatically build and deploy the `main` branch.
