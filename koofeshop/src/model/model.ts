import { getTimePreparation, pickName } from "../util/util";

const barista = pickName();

const state = {
  IN_QUEUE: "IN_QUEUE",
  BEGIN_PREPARED: "BEGIN_PREPARED",
  READY: "READY",
  FAILED: "FAILED",
};

export const prepere = (order: any) =>
  new Promise((resolve) => {
    const delay = getTimePreparation();
    setTimeout(() => {
      resolve({
        ...order,
        preparedBy: barista,
        preparation: state.READY,
      });
    }, delay);
  });
