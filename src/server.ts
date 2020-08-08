import express from "express";
import router from "./routes/routes";

const app = express();
app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  res.send("Big Rules");
});

app.listen(3333, () => {
  console.log("Server up");
});
