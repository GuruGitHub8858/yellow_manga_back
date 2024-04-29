const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 5000;

const app = express();

mongoose.connect('mongodb+srv://drguru750:yellowmanga@details.ptwvafg.mongodb.net/?retryWrites=true&w=majority&appName=Details')
    .then(() => {
        console.log("Databases has been connected");
    })
    .catch(() => {
        console.log("Databases not connected");
    })

const UserSchema = new mongoose.Schema({
    fname: { type: String },
    lname: { type: String },
    email: { type: String, require: true },
    password: { type: String, require: true },

})

const paySchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, require: true },
    ph: { type: Number, require: true },
    adress: { type: String, require: true },
    tp: { type: Number, require: true }
})

const Collection = mongoose.model('yellowblogs', UserSchema)
const payCollection = mongoose.model('payments', paySchema);
app.use(express.json());
app.use(cors());

app.post('/posting', async (req, resp) => {
    try {
        const user = new Collection(req.body);
        const result = await user.save();
        const dataSending = result.toObject();
        resp.send(dataSending);
    }
    catch (e) {
        console.log(e);
    }
})

app.post('/pay', async (req, resp) => {
    try {
        const user = new payCollection(req.body);
        const result = await user.save();
        const dataSending = result.toObject();
        resp.send(dataSending);
    }
    catch (e) {
        console.log(e);
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Collection.findOne({ email, password });
        if (user) {
            res.status(200).json({ success: true, message: 'Login successful' });
        } else {

            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
    }
});


app.listen(port, () => {
    console.log(`App is listening to ${port}`);
})