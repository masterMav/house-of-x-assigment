import React from "react";
import axios from "axios";

function Home() {
  const url = "http://localhost:5000/all";
  axios
    .get(url)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  return <div>Home</div>;
}

export default Home;
