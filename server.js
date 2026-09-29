import 'dotenv/config'; // Load environment variables from .env file
import express from 'express';
import { PrismaClient } from './src/generated/prisma/client.js';
import { PrismaNeon } from '@prisma/adapter-neon';

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL,
});

const app = express();
const prisma = new PrismaClient({ adapter });

app.use(express.static('public')); //for use the css as static

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/orders');
});

//show the orders in the dashboard page.
app.get('/orders', async (req, res) => {
    const orders = await prisma.order.findMany({
        include: {
        customer: true,
        items: { include: { product: true } }
        },
        orderBy: { date: 'desc' }
    });

    res.render('dashboard', { orders });
});

//show the orders in the dashboard page.
app.get('/orders', async (req, res) => {
    const orders = await prisma.order.findMany({
        include: {
        customer: true,
        items: { include: { product: true } }
        },
        orderBy: { date: 'desc' }
    });

    res.render('dashboard', { orders });
});

// Get the clients and products for the <select>
app.get('/orders/new', async (req, res) => {
    const customers = await prisma.customer.findMany();
    const products = await prisma.product.findMany({ include: {inventory: true} });
    res.render('new-order', { customers, products });
});

//POST run when click on create the order button. req.body get the data that I fill in the form.
app.post('/orders/new', async (req, res) => {
    const { customerId, ...quantities } = req.body;

    //console.log('req.body completo:', req.body);
    //console.log('customerId recibido:', customerId, '→ convertido:', Number(customerId));

    if (!customerId) {
        return res.status(400).send('Please select a client');
    }

    const items = Object.entries(quantities)
        .filter(([key, value]) => key.startsWith('quantity_') && Number(value) > 0)
        .map(([key, value]) => ({
            productId: Number(key.replace('quantity_', '')),
            quantity: Number(value)
        }));
    
    //1. Check stock before creating anything
    for (const item of items) {
        const inventory = await prisma.inventory.findUnique({
            where: { productId: item.productId }
        });
        if (!inventory || inventory.quantity < item.quantity) {
            return res.status(400).send('Not enough stock for one of the selected products.  <a href="/orders/new">Go back</a>');
        }
    }

    //2.- Create the order
    const order = await prisma.order.create({
        data: {
            customerId: Number(customerId),
            status: 'pending',
            items: { create: items }
        }
    });

    // 3. Decrease inventory for each item ordered
    for (const item of items) {
        await prisma.inventory.update({
            where: { productId: item.productId },
            data: { quantity: { decrement: item.quantity } }
        });
    }

    res.redirect(`/orders/${order.id}/invoice`);
});

//show the invoice page.
app.get('/orders/:id/invoice', async (req, res) => {
    const order = await prisma.order.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            customer: true,
            items: { include: { product: true } }
        }
    });
    const total = order.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0); 
    res.render('invoice', { order, total });
});

//UPDATE the order status
app.post('/orders/:id/complete', async (req, res) => {
    await prisma.order.update({
        where: { id: Number(req.params.id)},
        data: { status: 'completed' }
    });
    res.redirect('/orders');
});

//ADD new client form
app.get('/customer/new', (req, res) => {
    res.render('new-customer');
});

//POST add new client
app.post('/customer/new', async (req, res) => {
    const { name, contact } = req.body;

    await prisma.customer.create({
        data: { name: name, contact: contact }
    });
    res.redirect('/orders/new');
});

//GET new product form
app.get('/product/new', (req, res) => {
    res.render('new-product');
});

//POST new product 
app.post('/product/new', async (req, res) => {
    const { name, price, quantity } = req.body;

    const existing = await prisma.product.findFirst({ where: { name } });
    if (existing) {
        return res.status(400).send('A product with that name already exists.');
    }

    if (Number(price) < 0 || Number(quantity) < 0) {
        return res.status(400).send('Price and quantity cannot be negative.');
    }

    await prisma.product.create({
        data: {
            name: name,
            price: Number(price),
            inventory: {
                create: { quantity: Number(quantity) }
            }
        }
    });

    res.redirect('/orders/new');
});

app.listen(3000, () => {
    console.log('Server running in http://localhost:3000');
});