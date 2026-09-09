import { app } from "./app.js";

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`SeoScope backend running at http://localhost:${port}`);
});
