const names: string[] = ["Ricardino", "Afonso", "Mayke", "Fernando", "Paulo"];

export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max));
}

export function pickName(): string {
  const picke = getRandomInt(names.length);
  return names[picke];
}

export function getTimePreparation(): number {
  return getRandomInt(5) * 1000;
}
