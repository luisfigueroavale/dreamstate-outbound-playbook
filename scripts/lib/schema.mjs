function unexpectedNames(data, schema) {
  if (schema.additionalProperties !== false) return [];
  const known = new Set(Object.keys(schema.properties ?? {}));
  return Object.keys(data).filter((name) => !known.has(name));
}

export function validate(data, schema, path = "$") {
  const errors = [];
  if (!schema || typeof schema !== "object") return errors;
  if (schema.const !== undefined && data !== schema.const) errors.push(`${path} must be ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(data)) errors.push(`${path} must be one of ${schema.enum.join(", ")}`);
  if (schema.type === "object") {
    if (data === null || typeof data !== "object" || Array.isArray(data)) {
      errors.push(`${path} must be an object`);
      return errors;
    }
    for (const key of schema.required ?? []) {
      if (data[key] === undefined) errors.push(`${path}.${key} is required`);
    }
    for (const name of unexpectedNames(data, schema)) errors.push(`${path}.${name} is not allowed`);
    for (const [key, child] of Object.entries(schema.properties ?? {})) {
      if (data[key] !== undefined) errors.push(...validate(data[key], child, `${path}.${key}`));
    }
  } else if (schema.type === "array") {
    if (!Array.isArray(data)) errors.push(`${path} must be an array`);
    else if (schema.items) data.forEach((item, index) => errors.push(...validate(item, schema.items, `${path}[${index}]`)));
    if (schema.maxItems !== undefined && Array.isArray(data) && data.length > schema.maxItems) errors.push(`${path} has more than ${schema.maxItems} items`);
  } else if (schema.type === "string") {
    if (typeof data !== "string") errors.push(`${path} must be a string`);
  } else if (schema.type === "number" || schema.type === "integer") {
    if (typeof data !== "number") errors.push(`${path} must be a number`);
  } else if (schema.type === "boolean") {
    if (typeof data !== "boolean") errors.push(`${path} must be a boolean`);
  } else if (schema.type === "null") {
    if (data !== null) errors.push(`${path} must be null`);
  }
  return errors;
}
