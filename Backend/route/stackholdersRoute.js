const express = require('express');
const User = require('../models/Users');
const Admin = require('../models/Admin');
const Staff = require('../models/Staff');
const app = express();
const router = express.Router();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register route (simplified)
router.post('/register', async (req, res) => {
  const { name, email, role, phone, address } = req.body;

  try {
    let user;

    if (role === 'admin') {
      user = new Admin({ name, email, phone, address });
    } else if (role === 'staff') {
      user = new Staff({ name, email, phone, address, department: req.body.department });
    } else {
      user = new User({ name, email, phone, address });
    }

    await user.save();
    res.status(201).send('User created successfully');
  } catch (err) {
    res.status(400).send(err.message);
  }
});



router.get('/users', async (req, res) => {
    try {
      const admins = await Admin.find(); // Fetch admins
      const staff = await Staff.find(); // Fetch staff
      const users = await User.find(); // Fetch regular users
  
      // Combine all users into a single array
      const allUsers = [...admins, ...staff, ...users];
  
      res.status(200).json(allUsers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

// Update user (simplified)
router.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete user (simplified)
router.delete('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Attempt deletion from each collection
      const deletedUser =
        (await Admin.findByIdAndDelete(userId)) ||
        (await Staff.findByIdAndDelete(userId)) ||
        (await User.findByIdAndDelete(userId));
  
      if (!deletedUser) {
        return res.status(404).send('User not found');
      }
  
      res.send('User deleted');
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
  

module.exports = router;
