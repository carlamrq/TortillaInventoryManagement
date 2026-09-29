# Overview

As a software developer, I aim to provide solutions to the challenges faced by both small and large businesses. I want to streamline their processes so they can focus on other priorities and grow.

The software is a Node.js web application, built with Express and EJS, that uses Prisma ORM to connect to the same PostgreSQL database (hosted on Neon) from my previous project. It lets a user view existing orders on a dashboard, create new orders by choosing a customer and products, generate invoices automatically, mark orders as completed, and add new customers and products directly from the browser, without running any scripts by hand.

To run it: clone the repository, run `npm install`, add your own PostgreSQL connection string to a `.env` file, run `npx prisma generate` to generate the Prisma Client, and then run `node server.js` to start the local server. Open `http://localhost:3000` in a browser to see the Orders Dashboard.

I am working with a small tortilla-making company in Japan. In my previous project I built the database behind their records, and for this one I wanted to give them an actual interface they can use, instead of running scripts by hand every time they need to log an order or check stock. This web app is a step toward a real tool the company could use day to day.

[Software Demo Video](https://youtu.be/fTfxNtJYq9s)

# Web Pages

I built five pages, all rendered server-side with **EJS** and connected live to the database through **Prisma**.

- **Orders Dashboard** (`/orders`): shows every order from the database, with the customer name, date, status, and a link to its invoice. A pending order shows a "Complete" button that updates its status right from the page. It also has links to create a new order, add a client, or add a product.
- **New Order** (`/orders/new`): a form where I pick a customer and choose quantities for one or more products. The customer list and product list come directly from the database, so anything added later shows up here automatically. A product with low stock shows a warning next to it. Submitting the form checks the available stock for each product before saving anything; if there's enough, it creates the order, decreases the inventory, and redirects to the invoice.
- **Invoice** (`/orders/:id/invoice`): shows a single order's details — customer, each item with its quantity and price, and the total — calculated from the database every time the page loads.
- **New Client** (`/customer/new`): a short form to add a customer's name and contact info; after submitting, it redirects back to the New Order page so the new customer is ready to pick right away.
- **New Product** (`/product/new`): a form to add a product's name, price, and starting stock quantity. It checks that the name isn't already taken and that the price and quantity aren't negative, then creates the product and its inventory record together in one write. It also redirects back to New Order.

The flow goes: Dashboard → New Order / New Client / New Product (using the buttons) → submit → back to the Dashboard, back to New Order, or forward to the order's Invoice, depending on the action.

# Development Environment

I developed this project using:
- **JavaScript** as the main language for the app.
- **Node.js** with **npm** as the package manager.
- **Express** as the web framework, and **EJS** to render the HTML pages on the server.
- **Visual Studio Code**
- **Git/GitHub** for version control.
- **Neon**, a cloud PostgreSQL provider.
- **Prisma ORM** and **Prisma Studio** as the interface between my code and PostgreSQL, and for visually inspecting the data.

Supporting libraries:
- **@prisma/adapter-neon** to connect Prisma to Neon.
- **dotenv** to load environment variables.

# Useful Websites

- [Express Documentation](https://expressjs.com/)
- [EJS Documentation](https://ejs.co/)
- [Prisma Documentation – PostgreSQL Quickstart](https://www.prisma.io/docs/v7/prisma-orm/quickstart/postgresql)
- [Neon Docs – Connect from Prisma to Neon](https://neon.com/docs/guides/prisma)

# Future Work

- Export the invoice as a downloadable PDF instead of just an HTML page.
- Add basic authentication so only staff can access the app.
- Allow editing or cancelling an order from the dashboard, instead of only marking it completed.
- Add pagination and a search/filter on the Orders Dashboard as the number of orders grows.