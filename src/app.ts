import express, { type Request,  type Response } from 'express';

import names from '../ukrainian_names_100.json' with { type: "json" };

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const namesDictinary: Record<string, string> = names;

app.get('/check-gender', (req: Request, res: Response) =>{
    const name = req.query.name as string;

    if(!name){
        return res.status(400).send('Name is required');
    }

    const gender = namesDictinary[name] || 'unknown';

    console.log(gender);

    return res.json({gender});
})

app.post('/validate-email', (req: Request, res: Response) => {

    const { email } = req.body;

    if (!email || typeof email !== 'string') {
        return res.status(400).json({
            error: 'Email is required',
        });
    }

    const checkEmail = email.includes('@gmail.com') || email.includes('@yahoo.com') || email.includes('@outlook.com');


    return res.json({checkEmail});
});

app.post('/check-age', (req: Request, res: Response) => {

    const { birthDate } = req.body;

    if(!birthDate){
        return res.status(400).send('Date is required');
    }
    const isAdult = new Date().getFullYear() - new Date(birthDate).getFullYear() >= 18;
        
    console.log(birthDate);
    console.log(isAdult);

    return res.json({isAdult});
})




app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
