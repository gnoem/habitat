export const fancyClassName = ({ styles, className }) => {
  if (!className) return '';
  if (!styles) return className;
  const classNameArray = className.split(' ');
  return classNameArray.map(classNameString => {
    return styles[classNameString] ?? classNameString;
  }).filter(el => el).toString().replace(',', ' ');
}