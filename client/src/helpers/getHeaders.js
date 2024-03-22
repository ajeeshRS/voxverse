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