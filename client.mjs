const baseUrl = "http://localhost:3000";

setTimeout(async () => {
  const response = await fetch(baseUrl + "/course/javascript");
  console.log(response.ok, response.status);
  const response1 = await fetch(baseUrl + "/");
  console.log(response1.ok, response1.status);
}, 200);
