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

export const habitLabelIsValid = (label) => {
  if (label.indexOf('{') === -1) return false;
  if (label.indexOf('}') === -1) return false;
  if (label.indexOf('{') > label.indexOf('}')) return false;
  return true;
}