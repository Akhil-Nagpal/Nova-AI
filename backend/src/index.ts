import { app } from "./app";
import { connectDB } from "./db/connect";

const PORT = Number(Bun.env.PORT) || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database Connection Failed!", error);
  });
