// This function removes all the null,  empty objects, "" (empty string values from the object), undefined values from the object

// @example

// const object = {
//   a: "string not empty",
//   b: { c: "string not empty" },
//   d: { e: false, f: 0, g: true, h: 10 },
//   i: { j: 0, k: null },
//   l: { m: null },
//   n: { o: 1, p: "", q: {} },
//   r: [{ foo: null }],
// };

// const cleanedObj = cleanObject(object)
// console.log(cleanedObj);

// ========= Result ==============

// {
//   a: 'string not empty',
//   b: { c: 'string not empty' },
//   d: { e: false, f: 0, g: true, h: 10 },
//   i: { j: 0 },
//   n: { o: 1 }
// }

const cleanObject = (object) => {
  Object.entries(object).forEach(([key, value]) => {
    if (value && typeof value === "object") {
      cleanObject(value);
    }
    if (
      (value && typeof value === "object" && !Object.keys(value).length) ||
      value === null ||
      value === undefined ||
      value === ""
    ) {
      if (Array.isArray(object)) {
        object.splice(key, 1);
      } else {
        delete object[key];
      }
    }
  });
  return object;
};

export default cleanObject;
