import pino from "pino";
import { Kafka } from "kafkajs";
import { prepere } from "./model/model";

const logger = pino();
const kafka = new Kafka({
  brokers: ["stunning-manatee-14111-us1-kafka.upstash.io:9092"],
  sasl: {
    mechanism: "scram-sha-256",
    username: "c3R1bm5pbmctbWFuYXRlZS0xNDExMSS2ZoW8hd-z-5NBE2Qw2M4Tkt1urgwwfqE",
    password: "d6f5a0e2552044fe981210071c036d96",
  },
  ssl: true,
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "baristas" });

const run = async () => {
  await consumer.connect();
  await producer.connect();

  await consumer.subscribe({ topic: "orders", fromBeginning: true });

  await consumer.run({
    eachMessage: async (message: any) => {
      const order = JSON.parse(message.value.toString());
      const beverage = prepere(order);
      logger.info(`Order ${order.orderId} for ${order.customer} is ready`);

      producer.send({
        topic: "queue",
        messages: [{ value: JSON.stringify({ ...beverage }) }],
      });
    },
  });
};
