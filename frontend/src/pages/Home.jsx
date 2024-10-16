import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/apiHelper";

const Home = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchJsonPlaceholder = async () => {
      try {
        const res = await apiRequest.get("/home/json_placeholder", {
          withCredentials: true,
        });
        if (res) {
          setData(res);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchJsonPlaceholder();
  }, []);
  return (
    <div>
      <h1 className="text-3xl text-green-500 font-medium">
        Protected Home Page
      </h1>
      {data &&
        data.length &&
        data.map((item) => {
          return (
            <div key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          );
        })}
    </div>
  );
};

export default Home;
