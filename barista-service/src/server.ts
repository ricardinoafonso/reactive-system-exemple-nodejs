import "dotenv/config";
import EventEmitter from "events";
import fastify from "fastify";
import  FastifySSEPlugin  from "fastify-sse-v2";
import { Kafka } from "kafkajs";
import axios from "axios";
import { CreateFullBackBerage, InQueue } from "./model/beverage";
import { nanoid } from "nanoid";
import * as ejs from "ejs"
import * as url from 'url'
import fastifyFormbody from "@fastify/formbody";
const Fastify = fastify({ logger: true });
Fastify.register(fastifyFormbody)
Fastify.register(import("@fastify/static"), {
  root: url.fileURLToPath(new URL("..", import.meta.url)) + '/public'
});
Fastify.register(FastifySSEPlugin);

const kafkaConect = new Kafka({
  brokers: ["stunning-manatee-14111-us1-kafka.upstash.io:9092"],
  sasl: {
    mechanism: "scram-sha-256",
    username: "c3R1bm5pbmctbWFuYXRlZS0xNDExMSS2ZoW8hd-z-5NBE2Qw2M4Tkt1urgwwfqE",
    password: "d6f5a0e2552044fe981210071c036d96",
  },
  ssl: true,
});

Fastify.register(import("@fastify/view"),{
  engine: {
    ejs: ejs,
  },
  templates: url.fileURLToPath(new URL(".", import.meta.url))  + '/view'
})
Fastify.get('/', async (req,res)=>{
   return res.view('index.ejs')
})

Fastify.post("/http", async (_req, res) => {
 const order = { orderId: nanoid(), custumer: _req.body.name, beverage: _req.body!.product };
  try {
    const response = await axios.post("http://127.0.0.1:8000",order);
    console.log(response.data)
    res.send(response.data);
  } catch (error) {
    res.send(CreateFullBackBerage(order));
  }
});

const queue = new EventEmitter();
const producer = kafkaConect.producer();
const consumer = kafkaConect.consumer({ groupId: "APP_TEST_" });

Fastify.get("/queue", async (req, res) => {
  res.header('Content-Type', 'text/event-stream')
  queue.on("update", (data) => {
    res.sse({data: data});
  });
});

Fastify.post("/messaging", async (request, response) => {
  const { name, product } = request.body;
  const order = { orderId: nanoid, custumer: name, beverage: product };
  producer.send({
    topic: "orders",
    messages: [{ value: JSON.stringify({ ...order }) }],
  });
  queue.emit("update", InQueue(order));
  response.send(order);
});

const start = async () => {
  await consumer.connect();
  await producer.connect();

  await consumer.subscribe({ topic: "queue", fromBeginning: true });
  Fastify.listen({ port: 8001 }, (error, adress) => {
    if (error) {
      console.log(error);
      process.exit(1);
    }
    consumer.run({
      eachMessage: async (message: any) => {
        const beverage = JSON.parse(message.value.toString());
        queue.emit("update", beverage);
      },
    });
  });
};
start();
