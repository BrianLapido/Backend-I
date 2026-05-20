const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

process.env.PRIVATE_KEY = process.env.PRIVATE_KEY || "test-secret";

const emailServicePath = require.resolve("../src/service/emailService.js");
require.cache[emailServicePath] = {
    id: emailServicePath,
    filename: emailServicePath,
    loaded: true,
    exports: {
        sendWelcomeEmail: async () => ({accepted: []})
    }
};

const {cartsDAO} = require("../src/dao/mongoCarts.js");
const {productModel} = require("../src/dao/models/productsModel.js");
const {productsDAO} = require("../src/dao/mongoProducts.js");
const {usersDAO} = require("../src/dao/mongoUsers.js");
const {CartService} = require("../src/service/cartsService.js");
const {productsService} = require("../src/service/productsService.js");
const {userService} = require("../src/service/usersService.js");
const {generateToken} = require("../src/utils/jwt.js");

function mockMethod(t, object, method, implementation) {
    const original = object[method];
    object[method] = implementation;
    t.after(() => {
        object[method] = original;
    });
}

test("createCartService devuelve el carrito existente del usuario", async (t) => {
    const userId = "507f1f77bcf86cd799439011";
    const existingCart = {_id: "507f191e810c19729de860ea", user: userId, products: []};
    let createWasCalled = false;

    mockMethod(t, cartsDAO, "getCartByUser", async () => existingCart);
    mockMethod(t, cartsDAO, "createNewCart", async () => {
        createWasCalled = true;
    });

    const result = await CartService.createCartService(userId);

    assert.equal(result, existingCart);
    assert.equal(createWasCalled, false);
});

test("createCartService crea un carrito vacio cuando el usuario no tiene uno", async (t) => {
    const userId = "507f1f77bcf86cd799439011";
    const createdCart = {_id: "507f191e810c19729de860ea", user: userId, products: []};

    mockMethod(t, cartsDAO, "getCartByUser", async () => null);
    mockMethod(t, cartsDAO, "createNewCart", async (cartData) => {
        assert.deepEqual(cartData, {user: userId, products: []});
        return createdCart;
    });

    const result = await CartService.createCartService(userId);

    assert.equal(result, createdCart);
});

test("addProductToCartService agrega un producto nuevo con cantidad 1", async (t) => {
    const cid = "507f191e810c19729de860ea";
    const pid = "507f1f77bcf86cd799439011";
    const cart = {
        _id: cid,
        products: [],
        modifiedField: null,
        saved: false,
        populatedPath: null,
        markModified(field) {
            this.modifiedField = field;
        },
        async save() {
            this.saved = true;
        },
        async populate(path) {
            this.populatedPath = path;
            return this;
        }
    };

    mockMethod(t, cartsDAO, "getCartByIdRaw", async () => cart);
    mockMethod(t, productModel, "findById", async () => ({_id: pid}));

    const result = await CartService.addProductToCartService(cid, pid);

    assert.equal(result, cart);
    assert.equal(cart.products.length, 1);
    assert.equal(cart.products[0].product, pid);
    assert.equal(cart.products[0].quantity, 1);
    assert.equal(cart.modifiedField, "products");
    assert.equal(cart.saved, true);
    assert.equal(cart.populatedPath, "products.product");
});

test("addProductToCartService incrementa la cantidad si el producto ya existe", async (t) => {
    const cid = "507f191e810c19729de860ea";
    const pid = "507f1f77bcf86cd799439011";
    const cart = {
        _id: cid,
        products: [{product: pid, quantity: 2}],
        markModified() {},
        async save() {},
        async populate() {
            return this;
        }
    };

    mockMethod(t, cartsDAO, "getCartByIdRaw", async () => cart);
    mockMethod(t, productModel, "findById", async () => ({_id: pid}));

    await CartService.addProductToCartService(cid, pid);

    assert.equal(cart.products.length, 1);
    assert.equal(cart.products[0].quantity, 3);
});

test("addProductToCartService rechaza ids invalidos", async () => {
    await assert.rejects(
        () => CartService.addProductToCartService("id-malo", "otro-id-malo"),
        /ID de carrito o producto invalido/
    );
});

test("updateProductQuantityService actualiza la cantidad de un producto del usuario", async (t) => {
    const userId = "507f1f77bcf86cd799439011";
    const pid = "507f191e810c19729de860ea";
    const cart = {
        _id: "507f191e810c19729de860eb",
        products: [{product: {_id: pid, title: "Mouse"}, quantity: 1}],
        markModifiedField: null,
        saved: false,
        markModified(field) {
            this.markModifiedField = field;
        },
        async save() {
            this.saved = true;
        },
        async populate() {
            return this;
        }
    };

    mockMethod(t, cartsDAO, "getCartByUser", async () => cart);

    const result = await CartService.updateProductQuantityService(userId, pid, 4);

    assert.equal(result.products[0].quantity, 4);
    assert.equal(cart.markModifiedField, "products");
    assert.equal(cart.saved, true);
});

test("deleteProductFromCartService elimina un producto del carrito del usuario", async (t) => {
    const userId = "507f1f77bcf86cd799439011";
    const pid = "507f191e810c19729de860ea";
    const otherPid = "507f191e810c19729de860eb";
    const cart = {
        products: [
            {product: {_id: pid, title: "Mouse"}, quantity: 1},
            {product: {_id: otherPid, title: "Teclado"}, quantity: 2}
        ],
        async save() {},
        async populate() {
            return this;
        }
    };

    mockMethod(t, cartsDAO, "getCartByUser", async () => cart);

    const result = await CartService.deleteProductFromCartService(userId, pid);

    assert.equal(result.products.length, 1);
    assert.equal(result.products[0].product._id, otherPid);
});

test("clearCartService vacia todos los productos del carrito del usuario", async (t) => {
    const userId = "507f1f77bcf86cd799439011";
    const cart = {
        products: [{product: {_id: "507f191e810c19729de860ea"}, quantity: 2}],
        saved: false,
        async save() {
            this.saved = true;
        },
        async populate() {
            return this;
        }
    };

    mockMethod(t, cartsDAO, "getCartByUser", async () => cart);

    const result = await CartService.clearCartService(userId);

    assert.deepEqual(result.products, []);
    assert.equal(cart.saved, true);
});

test("registerUserService crea usuario, crea carrito y guarda el id del carrito", async (t) => {
    const userId = "507f1f77bcf86cd799439011";
    const cartId = "507f191e810c19729de860ea";
    const createdUser = {
        _id: userId,
        first_name: "Ada",
        last_name: "Lovelace",
        email: "ada@test.com",
        age: 30,
        role: "user",
        password: "hashed-password",
        cart: null,
        saveCalled: false,
        async save() {
            this.saveCalled = true;
        }
    };

    mockMethod(t, usersDAO, "getUsersByEmail", async () => null);
    mockMethod(t, usersDAO, "createUser", async (userData) => {
        assert.equal(userData.password, "hashed-password");
        return createdUser;
    });
    mockMethod(t, CartService, "createCartService", async (receivedUserId) => {
        assert.equal(receivedUserId, userId);
        return {_id: cartId, user: userId, products: []};
    });
    mockMethod(t, bcrypt, "hashSync", () => "hashed-password");

    const token = await userService.registerUserService({
        first_name: "Ada",
        last_name: "Lovelace",
        email: "ada@test.com",
        age: 30,
        password: "123456"
    });
    const payload = jwt.verify(token, process.env.PRIVATE_KEY);

    assert.equal(createdUser.cart, cartId);
    assert.equal(createdUser.saveCalled, true);
    assert.equal(payload.id, userId);
    assert.equal(payload.email, "ada@test.com");
    assert.equal(payload.cart, cartId);
});

test("loginUserServices devuelve token con id y carrito del usuario", async (t) => {
    const userId = "507f1f77bcf86cd799439011";
    const cartId = "507f191e810c19729de860ea";

    mockMethod(t, usersDAO, "getUsersByEmail", async () => ({
        _id: userId,
        first_name: "Ada",
        last_name: "Lovelace",
        email: "ada@test.com",
        role: "user",
        cart: cartId,
        password: "hashed-password"
    }));
    mockMethod(t, bcrypt, "compareSync", () => true);

    const {token} = await userService.loginUserServices({
        email: "ada@test.com",
        password: "123456"
    });
    const payload = jwt.verify(token, process.env.PRIVATE_KEY);

    assert.equal(payload.id, userId);
    assert.equal(payload.cart, cartId);
});

test("generateToken acepta objetos con id o _id", () => {
    const token = generateToken({
        id: "507f1f77bcf86cd799439011",
        email: "ada@test.com",
        role: "user",
        cart: "507f191e810c19729de860ea"
    });
    const payload = jwt.verify(token, process.env.PRIVATE_KEY);

    assert.equal(payload.id, "507f1f77bcf86cd799439011");
    assert.equal(payload.cart, "507f191e810c19729de860ea");
});

test("addProductService completa defaults cuando el formulario envia datos minimos", async (t) => {
    mockMethod(t, productsDAO, "getProductsByFilter", async () => []);
    mockMethod(t, productsDAO, "createProduct", async (productData) => {
        assert.equal(productData.title, "Mouse");
        assert.equal(productData.price, 10);
        assert.equal(productData.description, "Mouse");
        assert.equal(productData.stock, 1);
        assert.equal(productData.category, "general");
        assert.match(productData.code, /^mouse-\d+$/);
        return {_id: "507f191e810c19729de860ea", ...productData};
    });

    const product = await productsService.addProductService({title: "Mouse", price: 10});

    assert.equal(product.title, "Mouse");
});

test("getProductsService pasa limit y page al DAO", async (t) => {
    mockMethod(t, productsDAO, "getAll", async (limit, page) => {
        assert.equal(limit, 5);
        assert.equal(page, 2);
        return {docs: [], page: 2, limit: 5};
    });

    const result = await productsService.getProductsService(5, 2);

    assert.deepEqual(result, {docs: [], page: 2, limit: 5});
});
