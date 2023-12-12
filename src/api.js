const http = require("http");
const DEFAULT_USER = {
  username: "Guilherme",
  password: "123",
};

const { once } = require("events");

const routes = {

  "/home:get": (request, response) => {

    response.writeHead(200);
    response.write("Root page");

    return response.end();
  },

  "/contact:get": (request, response) => {
    response.write("Page Of Contact!");

    return response.end();
  },

  // \curl -i -X POST --data '{"username":"Guilherme","password": "123"}' localhost:3000/login
  // \curl -i -X POST --data '{"username":"Guilherme","password": "123"}' localhost:3000/login

  "/register:post": async (request, response) => {

    const user = JSON.parse(await once(request, "data"));
    const toLower = (text) => text.toLowerCase();

    if (user.username === "") {
      response.writeHead(401);
      response.end("This field 'name' is required! Fill in correctly!");

      return;
    }

    if (user.password === "") {
      response.writeHead(401);
      response.end("This field 'password' is required! Fill in correctly!");

      return;
    }

    if (toLower(user.username) !== toLower(DEFAULT_USER.username) || user.password !== DEFAULT_USER.password) {
      response.writeHead(401);
      response.end("Incorrect username or password. Please, type again!");

      return;
    }

    return response.end("Log in succeeded!");
  },

  default(request, response) {
    response.writeHead(400);
    response.write("Not found url");

    return response.end();
  },
};

function handler(request, response) {
  const { url, method } = request;

  const routeKey = `${url.toLowerCase()}:${method.toLowerCase()}`;
  const chosen = routes[routeKey] || routes.default;

  return chosen(request, response);
}
const app = http.createServer(handler).listen(3000);

module.exports = app;