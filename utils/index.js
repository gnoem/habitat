import dayjs from "dayjs";

export const fancyClassName = ({ styles, className }) => {
  if (!className) return '';
  if (!styles) return className;
  const classNameArray = className.split(' ');
  return classNameArray.map(classNameString => {
    return styles[classNameString] ?? classNameString;
  }).filter(el => el).toString().replace(/,/g, ' ');
}

export const getUnitFromLabel = (label) => {
  return label?.split('{')[1]?.split('}')[0]?.trim();
}

export const getQueryParams = async ({ query }) => ({ query });

export const differenceInMinutes = (earlierDate, laterDate = new Date()) => {
  const createdAt = dayjs(earlierDate);
  const differenceInMinutes = dayjs(laterDate).diff(createdAt, 'minute');
  return differenceInMinutes;
}