/**
 * Define the score
 * @param {Array} result 
 */
const defineScore = function(result) {
  const score = result.reduce((acc, el) => {
    return acc.indexOf(el) > -1 ? acc : acc.push(el), acc;
  }, []);

  switch(score.length) {
    case 1:
      return 16;
    case 2:
      return 8;
    case 3:
      return 4;
    default:
      return 0;
  }
}

export {defineScore};
