// Ye ek simple helper hai jo automatically token add kar deta hai
const useAuthFetch = () => {
  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("prayas-token");
    
    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        ...options.headers,
      }
    };
    
    return fetch(url, config);
  };

  return authFetch;
};

export default useAuthFetch;