import express from 'express';
import type { Request, Response } from 'express';
import userRouter from './routes/user.route.js';
import eventRouter from './routes/event.route.js';
import expenseRouter from './routes/expense.route.js';
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',(req: Request, res: Response) => {
    res.send('Hello World!');
})
function consoler(req:Request,res:Response,next:any){
    console.log('Entering in user Route');
    next();
}

app.use('/api/v1/user',consoler, userRouter);
app.use('api/v1/event',eventRouter);
app.use('api/v1/money',expenseRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})


