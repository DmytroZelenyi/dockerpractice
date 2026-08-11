import express, {} from 'express';
import names from '../ukrainian_names_100.json' with { type: "json" };
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const namesDictinary = names;
app.get('/check-gender', (req, res) => {
    const name = req.query.name;
    if (!name) {
        return res.status(400).send('Name is required');
    }
    const gender = namesDictinary[name] || 'unknown';
    console.log(gender);
    return res.json({ gender });
});
app.post('/validate-email', (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
        return res.status(400).json({
            error: 'Email is required',
        });
    }
    const checkEmail = email.includes('@gmail.com') || email.includes('@yahoo.com') || email.includes('@outlook.com');
    return res.json({ checkEmail });
});
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
//# sourceMappingURL=app.js.map