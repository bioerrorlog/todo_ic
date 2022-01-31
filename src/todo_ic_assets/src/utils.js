export const convertArrayToObject = (array, key) => 
  array.reduce((acc, curr) => {
    acc[curr[key]] = curr;
    return acc;
  }, {});
