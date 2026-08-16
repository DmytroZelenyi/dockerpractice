import express, { type Request,  type Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { Pool } from 'pg';
import names from '../ukrainian_names_100.json' with { type: "json" };


const app = express();
const PORT = process.env.PORT || 3000;




app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    connectionString: process.env.DATABASE_URI
});
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

app.post('/check-password', (req: Request, res: Response) => {
    const { password } = req.body;

    if(!password || typeof password !== 'string'){
        return res.status(400).send('Password is required');
    }

    const reason = [];

    if(password.length < 8){
        reason.push('Password must be at least 8 characters long');
    }
    if(!/[A-Z]/.test(password)){
        reason.push('Password must contain at least one uppercase letter');
    }
    if(!/[0-9]/.test(password)){
        reason.push('Password must contain at least one number');
    }

    let strength = "";
    if(reason.length >= 2){
        strength = "weak";
    }else if(reason.length === 1){
        strength = "medium";
    }else if(reason.length === 0){
        strength = "strong";
    }

    return res.json({reason, strength});
   

})

app.post('/users', async (req: Request, res: Response) => {

    const { name, email, gender } = req.body;
    const user = { name, email, gender };

    if(!name || !email){
        return res.status(400).send('Name, email are required');
    }

    const queryText = `
        INSERT INTO users (name, email, gender)
        VALUES ($1, $2, $3)
        RETURNING *;
    `
    const values = [name, email, gender];

    try {
        const result = await pool.query(queryText, values);
        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error creating user');
    }
})





app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
