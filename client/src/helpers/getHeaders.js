// getting the headers from the local storage and combine with the bearer keyword
const getHeaders = () => {
    const token = localStorage.getItem("token");
   if(!token){
    return {}
   }
    return {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };
  
  export { getHeaders };