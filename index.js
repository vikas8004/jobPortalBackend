
import app from "./src/app.js";
import connectDb from "./src/conn/db.js";
const PORT = process.env.PORT || 8000


app.listen(PORT, async () => {
    const res = await connectDb();
    console.log(`app is running on port number ${PORT}`, res.connection.host);
})