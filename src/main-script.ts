//Script that run and interact with the database using Prisma Client
//Performs CRUD operations:
// - Create a new customer
// - Create new products in the inventory
// - Create a new order for the customer with the products
// - Read the order and its items for each customer
// - Update the inventory quantity for each product after the order is created
// - Delete the order and its items for the customer if its canceled

import { prisma } from './db';

async function main() {
    // INSERT: Create a new client if it doesn't exist
    let customer = await prisma.customer.findFirst({
        where: { name: "Tortilla client 1" },
    });
    if (!customer) {
        customer = await prisma.customer.create({
            data: {
                name: "Tortilla client 1",
                contact: "client1@email.com",
            },
        });
        console.log("New customer created:", customer);
    } else {
        console.log("Customer already exists:", customer);
    }

    // INSERT: Create 2 new product in the inventory if they don't exist, and include the inventory record in the response
    let product = await prisma.product.findFirst({
        where: { name: "Blue Corn Tortilla" },
    });
    if (!product) {
        product = await prisma.product.create({
            data: {
                name: "Blue Corn Tortilla",
                price: 49.90,
                inventory: { create: { quantity: 100 } }, //nested write, to create inventory record along with product
            },
            include: { inventory: true }, //include the inventory record in the response
        });
    } else {
        console.log("Product already exists:", product);
    }

    let product3 = await prisma.product.findFirst({
        where: { name: "Pink Corn Tortilla" },
    });
    if (!product3) {
        product3 = await prisma.product.create({
            data: {
                name: "Pink Corn Tortilla",
                price: 39.90,
                inventory: { create: { quantity: 200 } },
            },
            include: { inventory: true },
        });
        console.log("Product created:", product3);
    } else {
        console.log("Product already exists:", product3);
    }

    // INSERT: Create a new order for the customer
    const order = await prisma.order.create({
        data: {
            customerId: customer.id,
            items: {
                create: [
                    { productId: product.id, quantity: 5 }, 
                    { productId: product3.id, quantity: 10 },
                ],
            },
        },
        include: { items: true }, 
    });
    console.log("Order created:", order);
    
    // READ and JOIN: Resume the order and its items for the customer
    const orderSummary = await prisma.order.findMany({
        include: {
            customer: true,
            items: { include: { product: true } },
        },
    });
    console.log("Order Summary:", JSON.stringify(orderSummary, null, 2));

    // UPDATE: update the inventory quantities after the order is created
    await prisma.inventory.update({
        where: { productId: product.id },
        data: { quantity: { decrement: 5 } }, //decrement the quantity by the ordered amount
    });

    await prisma.inventory.update({
        where: { productId: product3.id },
        data: { quantity: { decrement: 10 } },
    });
    
    const updateOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: "completed" },
    });
    console.log("Inventory updated for order:", updateOrder);

    // DELETE: Delete one canceled order, first the line items and then the order itself
    const cancelledOrder = await prisma.order.create({
        data: { customerId: customer.id, status: "cancelled" },
    });
    await prisma.orderItem.deleteMany({
        where: { orderId: cancelledOrder.id }
    });
    await prisma.order.delete({ where: { id: cancelledOrder.id } });
    console.log("Order canceled, id:", cancelledOrder.id);
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
