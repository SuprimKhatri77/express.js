import { configDotenv } from "dotenv";
import app from "./server";

configDotenv();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
