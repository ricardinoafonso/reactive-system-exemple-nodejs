const state = {
  IN_QUEUE: "IN_QUEUE",
  BEGIN_PREPARED: "BEGIN_PREPARED",
  READY: "READY",
  FAILED: "FAILED",
};

export function InQueue(order: any) {
  return {
    ...order,
    preparationState: state.IN_QUEUE,
  };
}

export function CreateFullBackBerage(order: any) {
  return {
    ...order,
    preparationState: state.FAILED,
  };
}

