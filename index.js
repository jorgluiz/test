const express = require('express');
const path = require('path');
const cors = require('cors')

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*'); // ou substitua '*' pela origem específica
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// }); 

const app = express();

const { MercadoPagoConfig, Customer, PaymentMethod, CustomerCard, Payment, CardToken } = require('mercadopago');
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-5989202427278445-030112-dc4e3f0d64cb3963e679a437e5ab5e90-436624597' });
const customerClient = new Customer(client)
const customerCard = new CustomerCard(client);
const payment = new Payment(client);
const cardToken = new CardToken(client);

app.set("view engine", "html");
// app.engine("html", require("hbs").__express);
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static("./public"));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

app.post('/process_payment', (req, res) => {
    console.log(req.body)

    payment.create({
        body: { 
            transaction_amount: req.body.transaction_amount,
            token: req.body.token,
            description: req.body.description,
            installments: req.body.installments,
            payment_method_id: req.body.paymentMethodId,
            issuer_id: req.body.issuer,
                payer: {
                email: req.body.email,
                identification: {
            type: req.body.identificationType,
            number: req.body.number
        }}},
        requestOptions: { idempotencyKey: '' }
    })
    .then((result) => {
        console.log(result)
        return res.send(result)
    })
    .catch((error) => console.log(error));
})

app.listen(3000, () => {
    console.log('Servidor HTTPS está ouvindo na porta 3000');
});