const response = await fetch("http://localhost:3000/products", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  // body: JSON.stringify({
  //   name: "Mouse",
  //   slug: "mouse",
  //   category: "electronics",
  //   price: 300,
  // }),
});

console.log(response);

const body = await response.json();

console.log(body);
