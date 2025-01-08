import express, {Request, Response, Application} from "express";
import * as path from "node:path";

const app: Application = express();
const port = 8080; // default port to listen

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// define a route handler for the default home page
app.get("/", (req: Request, res: Response) => {
    res.render("index");
});

// start the Express server
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
