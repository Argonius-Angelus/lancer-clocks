export const log = (message) => console.log(`Foundry VTT | Lancer Clock v14 | ${message}`);
export const warn = (message) => console.warn(`Foundry VTT | Lancer Clock v14 | ${message}`);
export const error = (message) => console.error(`Foundry VTT | Lancer Clock v14 | ${message}`);

export const foundryGeneration = () => {
  const generation = game.release?.generation ?? Number.parseInt(`${game.version ?? 0}`.split(".")[0], 10);
  return Number.isNaN(generation) ? 0 : generation;
};

export const getSystemId = () => game.system?.id ?? game.data?.system?.id ?? "";

export const getFilePicker = () => foundry.applications?.apps?.FilePicker ?? globalThis.FilePicker;

const isPlainObject = (value) => {
  return value !== null && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype;
};

const cloneValue = (value) => {
  if (Array.isArray(value)) return value.map(cloneValue);
  if (isPlainObject(value)) return mergeInto({}, value);
  return value;
};

const mergeInto = (target, source) => {
  if (!isPlainObject(source)) return target;
  for (const [key, value] of Object.entries(source)) {
    if (isPlainObject(value) && isPlainObject(target[key])) {
      mergeInto(target[key], value);
    } else {
      target[key] = cloneValue(value);
    }
  }
  return target;
};

export const mergeData = (...args) => {
  const maybeOptions = args.at(-1);
  const hasOptions = isPlainObject(maybeOptions) && Object.hasOwn(maybeOptions, "inplace");
  const options = hasOptions ? args.pop() : {};
  const [original = {}, ...sources] = args;
  const target = options.inplace ? original : cloneValue(original);
  for (const source of sources) mergeInto(target, source);
  return target;
};
