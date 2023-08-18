import fastify from "fastify";
import PinoPretty from "pino-pretty";
import { prepere } from "./model/model";
import formbody from '@fastify/formbody'

const Fastify = fastify({ logger: true });

Fastify.register(formbody)

Fastify.post("/", async (_req, _res) => {
  const order = _req.body;
  const b = await prepere(order);
  _res.send(b);
});

Fastify.listen({ port: 8000 }, (error, adress) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});


