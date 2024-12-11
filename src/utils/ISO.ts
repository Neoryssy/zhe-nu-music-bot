export const msToISOString = (milliseconds: number) => {
  const hours = Math.floor(milliseconds / 1000 / 60 / 60);
  const isoString = new Date(milliseconds).toISOString();
  return hours > 0 ? isoString.slice(11, 19) : isoString.slice(14, 19);
}
