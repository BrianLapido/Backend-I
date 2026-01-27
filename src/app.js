require("dotenv").config();
const express = require("express");
const{engine} = require("express-handlebars")
const session = require("express-session");
const cookieParser = require("cookie-parser")

const routerSession = require("./routes/sessionsRouter.js")
const productsRouter = require("./routes/productsRouter.js");
const cartRouter = require("./routes/cartRouter.js")
const viewsRouter = require("./routes/viewsRouter.js");
const userRouter = require ("./routes/userRouter.js")
const emailRouter = require("./routes/emailRouter.js")

const {Server} = require("socket.io");
const {MongoSingleton } = require("./config/mongoSingleton.js");
const mongoStore = require("connect-mongo");
const passport = require("passport");
const {initializePassport} =require("./config/passport.config.js")

const mongoUrl=process.env.MONGO_URL;
const PORT = process.env.PORT;
const app = express();

//----------------------mongoInstance-----------------------------//
MongoSingleton.getInstance();

//-----------------middleware----------------------//
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"))
app.use(cookieParser(process.env.PRIVATE_KEY))

//---------------handlebars---------------------//
app.engine("hbs", engine({extname:"hbs"}));
app.set("view engine", "hbs");
app.set("views", "./src/views"); 

// --------------------passport---------------------------//
initializePassport()
app.use(passport.initialize())

//------------routes---------------------//
app.use((req, res, next)=>{
    req.io = io;
    next();
});
app.use(session({
    store: mongoStore.create({
        mongoUrl,
        collectionName: `sessions`,
        ttl: 24 * 60 * 60
    }),
    secret: process.env.PRIVATE_KEY,
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge:100 * 60 * 60},
}));

app.use("/api/users", userRouter)
app.use("/api/sessions", routerSession)
app.use("/", viewsRouter)
app.use("/api/products", productsRouter);
app.use("/api/carts" , cartRouter);
app.use("/api/email", emailRouter)

//----------------server HTTP y socket---------------------//
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost: ${PORT}`);
});


    const io = new Server(server)

    io.on("connection", (socket) => {
        console.log("Usuario conectado", socket.id)
        
        socket.on("nuevoProducto", (product)=>{
            io.emit("nuevoProducto", product);
        });
    
});

