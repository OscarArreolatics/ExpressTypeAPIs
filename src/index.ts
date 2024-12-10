import express, { Request, Response, NextFunction } from "express";
import tasksRoutes  from "../src/routes/taskRoutes";
import { conDB } from "../src/connect/DBconnect";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); 
app.use(express.urlencoded({extended: true}))

//routes
app.use('/tasks', tasksRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
});
conDB().then(() => 
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  })
)

