export const capitalize = (str: string) => str.charAt(0) + str.slice(1).toLowerCase() 

export const toDateFromTimeString = (time: string) => {
  const [h, m] = time.split(":").map(x => ~~x); // ~~x = bitwise buat cepat parse ke integer
  return new Date(new Date().setHours(h, m, 0, 0));
};
