export const useRefName = (ref) => {
  const { current: refName } = ref;
  return refName;
}