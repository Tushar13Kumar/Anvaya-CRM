import { useState, useEffect } from "react";
const useFetch = (url, initialData) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);

        const token = localStorage.getItem("prayas-token"); // ADD

    fetch(url , {
      headers: {
        "Authorization": `Bearer ${token}` // ADD
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [url]);
  // Yahan setData ko add karna zaroori hai ⬇️
  return { data, setData, loading, error };
};
export default useFetch;