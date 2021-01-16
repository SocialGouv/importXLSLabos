let apiURL = "XXX";

if (process.env.NODE_ENV === "development") apiURL = "http://localhost:3000";

const S3PREFIX = "XXX";

console.log("apiURL",apiURL)

export { apiURL, S3PREFIX };
