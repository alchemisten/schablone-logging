type indexObject = object & {
  [key: string]: unknown;
};

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type Merge<A extends unknown[]> = UnionToIntersection<A[number]>;

export const deepmerge = <A extends unknown[]>(...args: A): Merge<A> => {
  const extended: indexObject = {};

  // Merge the object into the extended object
  const merge = (obj: indexObject) => {
    if (obj !== undefined && obj !== null) {
      Object.keys(obj).forEach((prop) => {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
            // If the property is an object
            extended[prop] = deepmerge(extended[prop] as indexObject, obj[prop] as indexObject);
          } else if (Object.prototype.toString.call(obj[prop]) === '[object Array]') {
            // If the property is an array
            extended[prop] = [...(obj[prop] as Array<unknown>)];
          } else {
            // Otherwise, do a regular merge
            extended[prop] = obj[prop];
          }
        }
      });
    }
  };

  // Loop through each object and conduct a merge
  const aLength = args.length;
  for (let i = 0; i < aLength; i += 1) {
    merge(args[i] as indexObject);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return extended as UnionToIntersection<any>;
};
