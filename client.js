const baseUrl = "http://localhost:3000";

console.clear();
const functions = {
  async getCourse() {
    const response = await fetch(baseUrl + "/course/javascript");
    const body = await response.json();
    console.table(body);
  },
};

functions[process.argv[2]]();
