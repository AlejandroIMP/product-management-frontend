# Product Management System

A modern web application for managing products built with React, TypeScript, and Vite. This application provides a clean interface for creating, viewing, updating, and deleting products with image upload capabilities.

## Features

- 📦 **Product Management**: Create, read, update, and delete products
- 🖼️ **Image Upload**: Upload and manage product images
- ✅ **Form Validation**: Client-side validation using Zod schema validation
- 📱 **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- 🔍 **Product Details**: Detailed product view with comprehensive information
- ⚡ **Fast Performance**: Built with Vite for optimal development and build performance

## Tech Stack

- **Frontend Framework**: React 19
- **Type Safety**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router 7
- **Validation**: Zod
- **Code Quality**: ESLint with TypeScript support

## Project Structure

```
src/
├── features/
│   └── Management/
│       └── Products/
│           ├── components/          # Product components
│           │   ├── ui/             # Reusable UI components
│           │   ├── CreateProductModal.tsx
│           │   ├── ProductsList.tsx
│           │   └── UpdateProductForm.tsx
│           ├── hooks/              # Custom React hooks
│           ├── services/           # API services
│           ├── types/              # TypeScript type definitions
│           ├── utils/              # Utility functions
│           └── validation/         # Zod validation schemas
├── Layouts/                        # Layout components
├── pages/                          # Page components
│   ├── products/
│   └── NotFound/
└── main.tsx                        # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- pnpm (recommended package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd productManagement
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Switch to branch development
   ```bash
   git switch development
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm lint` - Run ESLint for code quality checks
- `pnpm preview` - Preview the production build locally

## Key Components

### Product Types

The application uses TypeScript interfaces defined in [`src/features/Management/Products/types/product.types.ts`](src/features/Management/Products/types/product.types.ts):

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  image?: imageDto;
}
```

### Main Features

- **Product List**: View all products in a responsive card layout ([`ProductsList`](src/features/Management/Products/components/ProductsList.tsx))
- **Product Cards**: Individual product display with status indicators ([`Card`](src/features/Management/Products/components/ui/Card.tsx))
- **Create Product**: Modal form for adding new products ([`CreateProductModal`](src/features/Management/Products/components/CreateProductModal.tsx))
- **Product Validation**: Comprehensive form validation using Zod schemas

### Validation

The application includes robust form validation using Zod schemas defined in [`validation/product.validation.ts`](src/features/Management/Products/validation/product.validation.ts):

- Name: Required, 1-100 characters
- Description: Required, 1-255 characters  
- Price: Minimum $0.01, positive numbers only
- Stock: Non-negative integers
- Image upload validation

## Development Guidelines

### Code Style

This project uses ESLint with TypeScript support. The configuration is defined in [`eslint.config.js`](eslint.config.js) and follows modern React best practices.

### TypeScript Configuration

The project uses multiple TypeScript configurations:
- [`tsconfig.json`](tsconfig.json) - Root configuration
- [`tsconfig.app.json`](tsconfig.app.json) - Application-specific settings
- `tsconfig.node.json` - Node.js specific settings

## Building for Production

To create a production build:

```bash
pnpm build
```

The built files will be available in the `dist` directory.

---

Built with ❤️ using React, TypeScript, and Vite