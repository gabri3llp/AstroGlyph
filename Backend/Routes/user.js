const router = require("express").Router();
const User = require("../Models/user");

// REGISTER
router.post("/register", async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.send("User registered");
});

// LOGIN
router.post("/login", async (req, res) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.send("User not found");

    if (user.password !== req.body.password)
        return res.send("Wrong password");

    res.send("Login successful");
});

module.exports = router;