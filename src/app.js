const express = require("express");
const{engine} = require("express-handlebars")

const {productsRouter} = require("./routes/productsRouter.js");
const {cartRouter} = require("./routes/cartRouter.js")
const {router:viewsRouter} = require("./routes/viewsRouter.js");

const {Server} = require("socket.io");
const PORT = 3000;
const app = express();

//-----------------middleware----------------------//
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./src/public"))

//---------------handlebars---------------------//
app.engine("hbs", engine({extname:"hbs"}));
app.set("view engine", "hbs");
app.set("views", "./src/views"); 

//------------routes---------------------//
app.use((req, res, next)=>{
    req.io = io;
    next();
});
app.use("/api/realTimeProducts", productsRouter);
app.use("/api/cart" , cartRouter);
app.use("/", viewsRouter)

//----------------server HTTP y socket---------------------//
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost: ${PORT}`);
});

const io = new Server(server)


io.on("connection", (socket) => {
    console.log("Usuario conectado", socket.id)
})


