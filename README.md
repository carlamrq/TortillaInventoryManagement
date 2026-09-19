# Overview

As a software developer, I aim to provide solutions to the challenges faced by both small and large businesses. I want to streamline their processes so they can focus on other priorities and grow.

The software is a TypeScript program that uses Prisma ORM to connect to a PostgreSQL database (hosted on Neon). It manages customers, products, stock levels, and orders. The program demonstrates inserting new records, retrieving data with a relational join (an order combined with its customer and product details), updating stock levels and order status, and deleting a cancelled order.

To run it: clone the repository, run `npm install`, add your own PostgreSQL connection string to a `.env` file, run `npx prisma migrate dev` to create the database tables, and then run `npx tsx src/main-script.ts` to see the program insert, update, delete, and query data.

I am working with a small tortilla-making company in Japan. I notice how much effort they put into record-keeping—wasting a great deal of time in the process—and how they often make errors when indexing the data. I want to streamline their entire workflow while gaining experience in developing business software solutions; that is why I started this project.

[Software Demo Video](http://youtube.link.goes.here)

# Relational Database

I used **PostgreSQL**, hosted on **Neon** a serverless Postgres provider, accessed through **Prisma ORM** as the interface between my TypeScript code and the database.

The database has five tables:
- **Customer**: stores customer name and contact info; a customer can have many orders.
- **Product**: stores product name and price; each product has one inventory record and can appear in many order line items.
- **Inventory**: tracks the current stock quantity for a single product (one-to-one with Product).
- **Order**: this save a customer's order, with a date and status (pending/completed/cancelled); belongs to one customer and can contain many order items.
- **OrderItem**: a line item connecting an Order to a Product, with a quantity; this resolves the many-to-many relationship between orders and products (an order can include several products, and a product can appear on several orders).

# Development Environment

I developed this project using:
- **TypeScript** as the main language for the script.
- **Node.js** with **npm** as the package manager.
- **Visual Studio Code**
- **Git/GitHub** for version control.
- **Neon**, a cloud PostgreSQL provider.
- **Prisma ORM** and **Prisma Studio** as the interface between my TypeScript code and PostgreSQL, and for visually inspecting the data.

-Supporting libraries:
- **@prisma/adapter-neon** to connect Prisma to Neon.
- **dotenv** To manage environment variables.
- **tsx** to run TypeScript files directly without compiling.

# Useful Websites

{Make a list of websites that you found helpful in this project}

- [Prisma Documentation – PostgreSQL Quickstart](https://www.prisma.io/docs/v7/prisma-orm/quickstart/postgresql)
- [Neon Docs – Connect from Prisma to Neon](https://neon.com/docs/guides/prisma)
- [Learn Prisma in 60 Minutes – Web Dev Simplified (YouTube)](https://www.youtube.com/watch?v=RebA5J-rlwg)

# Future Work

{Make a list of things that you need to fix, improve, and add in the future.}

- Build a web interface, using Next.js, with forms so records can be added or edited without running scripts manually.
- Generate real PDF invoices from order data.
- Add more realistic sample data with multiple customers and a larger product catalog.