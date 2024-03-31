// To format the date in readable
// march 30 2024 something like this
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  };
  return date.toLocaleDateString("en-US", options);
};

// To extract random elements from an array 
// Function accepts an array and a number
// as im using redux i can't directly work with that
// so im creating a copy of the array
// then working with the array
export const getRandomElements = (arr, num) => {
  // copying array
  const copyArray = [...arr];

  // shuffle the array to ensure randomness
  const shuffledArray = copyArray.sort(() => Math.random() - 0.5);
  
  // get the first numElements elements from the shuffled array
  return shuffledArray.slice(0, num);
};
