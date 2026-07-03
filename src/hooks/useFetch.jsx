import { useState, useEffect } from "react";

const useFetch = (url, initialData) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("prayas-token");
    
    console.log("🔍 Fetching URL:", url);        // ADD
    console.log("🔑 Token:", token);              // ADD

    fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Response from", url, ":", data); // ADD
        if (Array.isArray(data)) {
          setData(data);
        } else {
          console.warn("⚠️ Array nahi aaya:", data);     // ADD
          setData(initialData);
        }
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, setData, loading, error };
};

export default useFetch;