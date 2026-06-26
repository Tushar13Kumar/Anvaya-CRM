import { useState, useEffect } from "react";

const useFetch = (url, initialData) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("prayas-token");

    fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        // ✅ Agar array aaya toh set karo, warna initialData rakho
        if (Array.isArray(data)) {
          setData(data);
        } else {
          setData(initialData); // error object aaya toh crash mat karo
        }
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, setData, loading, error };
};

export default useFetch;