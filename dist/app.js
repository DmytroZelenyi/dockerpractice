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
app.post('/check-age', (req, res) => {
    const { birthDate } = req.body;
    if (!birthDate) {
        return res.status(400).send('Date is required');
    }
    const isAdult = new Date().getFullYear() - new Date(birthDate).getFullYear() >= 18;
    console.log(birthDate);
    console.log(isAdult);
    return res.json({ isAdult });
});
app.post('/check-password', (req, res) => {
    const { password } = req.body;
    if (!password || typeof password !== 'string') {
        return res.status(400).send('Password is required');
    }
    const reason = [];
    if (password.length < 8) {
        reason.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        reason.push('Password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
        reason.push('Password must contain at least one number');
    }
    let strength = "";
    if (reason.length >= 2) {
        strength = "weak";
    }
    else if (reason.length === 1) {
        strength = "medium";
    }
    else if (reason.length === 0) {
        strength = "strong";
    }
    return res.json({ reason, strength });
});
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
//# sourceMappingURL=app.js.map