const express = require('express');
const path = require('path');
const cors = require('cors')
const fs = require('fs')
const https = require('https')

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
  const { body } = req
  console.log(body)

 const paymentData = {
    transaction_amount: Number(body.transaction_amount),
    token: body.token,
    description: body.description,
    installments: Number(body.installments),
    payment_method_id: body.paymentMethodId,
    issuer_id: body.issuer,
    payer: {
      email: body.email,
      identification: {
        type: body.identificationType,
        number: body.number
      }
    }
  }

  payment.create({ body: paymentData })
    .then(function (data) {
      res.status(201).json({
        detail: data.status_detail,
        status: data.status,
        id: data.id,
      });
    })
    .catch(function (error) {
      console.log(error);
      const { errorMessage, errorStatus } = validateError(error);
      res.status(errorStatus).json({ error_message: errorMessage });
    });

})

function validateError(error) {
  let errorMessage = "Unknown error cause";
  let errorStatus = 400;

  if (error.cause) {
    const sdkErrorMessage = error.cause[0].description;
    errorMessage = sdkErrorMessage || errorMessage;

    const sdkErrorStatus = error.status;
    errorStatus = sdkErrorStatus || errorStatus;
  }

  return { errorMessage, errorStatus };
}

const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert', 'server.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert', 'server.cert'))
};


app.listen()