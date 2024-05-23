import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,    // This line specifies which domains are allowed to access the server.
    credentials: true //This line allows cross-origin requests to include credentials like cookies or authentication tokens. This is useful for sessions or user authentication.
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


// import route 
import userRouter from "./routes/user.routes.js";
import bookRouter from "./routes/book.routes.js";
import cartRouter from "./routes/cart.routes.js"
import likeRouter from "./routes/like.routes.js"
import reviewRouter from "./routes/review.routes.js"

//routes declaration user
app.use("/api/v1/users", userRouter);

//routes declaration book
app.use("/api/v1/books", bookRouter);

//routes declaration cart
app.use("/api/v1/cart", cartRouter);

//routes declaration like
app.use("/api/v1/like", likeRouter);

//routes declaration like
app.use("/api/v1/review", reviewRouter);




export default app;