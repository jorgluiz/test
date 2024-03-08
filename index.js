const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

// Configuração do CORS para todas as requisições
app.use(cors());

const { MercadoPagoConfig, Customer, PaymentMethod, CustomerCard, Payment, CardToken } = require('mercadopago');
const client = new MercadoPagoConfig({ accessToken: 'TEST--030112-fc76768e07cf6b9c6ea84c4746d4b504-436624597' });
const customerClient = new Customer(client)
const customerCard = new CustomerCard(client);
const payment = new Payment(client);
const cardToken = new CardToken(client);

// Define o diretório de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

app.post('/process_payment', (req, res) => {
   return res.send(req.body)

    payment.create({
        body: { 
            transaction_amount: req.transaction_amount,
            token: req.token,
            description: req.description,
            installments: req.installments,
            payment_method_id: req.paymentMethodId,
            issuer_id: req.issuer,
                payer: {
                email: req.email,
                identification: {
            type: req.identificationType,
            number: req.number
        }}},
        requestOptions: { idempotencyKey: '<SOME_UNIQUE_VALUE>' }
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