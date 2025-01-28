import router from "express";
import jwt from "jsonwebtoken";


const sneakersRouter = router();

sneakersRouter.get("/sneakers", async (req, res) => {
    const token = req.cookies.sneakers

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        if (!data) {
            return res.status(401).json({ message: "Invalid token" });
        }
        console.log(data);
        res.json({ message: "You are authenticated", data });
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});
    

export default sneakersRouter;