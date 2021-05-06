export const validationError = (errorObject) => {
  const errors = Object.entries(errorObject).map(([key, value]) => {
    const parseValue = (value) => {
      if (Array.isArray(value)) return value[0];
      return value;
    }
    return {
      location: key,
      message: parseValue(value)
    }
  });
  return {
    __typename: 'FormErrorReport',
    errors
  }
}