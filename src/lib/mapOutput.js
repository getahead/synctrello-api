export default function mapOutput(input, mapObjectKeys) {
  const outputObject = {};

  mapObjectKeys.map(key => {
    if (input[key] !== undefined) {
      outputObject[key] = input[key];
    }
  });

  return outputObject;
}
