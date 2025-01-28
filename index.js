const express = require("express");
require('dotenv').config();
const path = require('path');
const app = express();
const port = process.env.PORT;
const methodOverride = require("method-override");
const system = require("./configs/system");
const database = require("./configs/database");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const moment = require("moment");


// hàm hết nối database 
database.connect();


// socket
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
global._io = io;
// socket

// nhúng file tĩnh
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser('SJWSGAX'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// End TinyMCE


// cài pug
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.locals.prefixAdmin = system.PATH_ADMIN;
app.locals.moment = moment;



const route = require("./routes/client/index.route");
const routeDashboard = require("./routes/admin/index.route");


route(app); // chạy route
routeDashboard(app);

app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found"
  })
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});