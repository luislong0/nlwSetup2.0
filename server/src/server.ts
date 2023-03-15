// Back-end API RESTful
import cors from "@fastify/cors";
import Fastify from "fastify";
import { habitsRoutes } from "./routes/habits";
import { usersRoutes } from "./routes/users";

const app = Fastify();

app.register(cors);
app.register(usersRoutes);
app.register(habitsRoutes);

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("HTTP Server running in port 3333!");
  });
