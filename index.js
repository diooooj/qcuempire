const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const productRoute = require("./routes/product.route");
const homeRoute = require('./routes/home.route');
const loginRoute = require('./routes/login.route');
const userRoute = require('./routes/user.route');
const cartRoute = require('./routes/cart.route');
const orderRoute = require('./routes/order.route');
const entrepRoute = require('./routes/entrep.route');



const path = require('path')
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));


app.use('/', homeRoute);
app.use('/products', productRoute);
app.use('/login', loginRoute);
app.use('/user', userRoute);
app.use('/cart', cartRoute);
app.use('/order', orderRoute);
app.use('/entrep', entrepRoute);



mongoose
  .connect(
    "mongodb+srv://dbUser:dbUserPassword@backenddb.8q78t.mongodb.net/api?retryWrites=true&w=majority&appName=BackendDB"
  )
  .then(() => {
    console.log("Connected to database");
    app.listen(3000, () => {
      console.log("Server is running on pot 3000");
    });
  })
  .catch(() => {
    console.log("Connection Failed");
  });
