import express from "express";
import router from "./routes/routes";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

app.get("/", (req, res) => {
  res.json({ message: "Big Rules" });
});

app.listen(3333, () => {
  console.log("Server up");
});
