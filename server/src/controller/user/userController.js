const { User } = require("../../config/database");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../email/sendEmail")
const path = require("path");

const getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch users", message: error.message });
    }
  };

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            where: {id : id},
        });
        
        if(user){
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found"});
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user"});
    }
};

const createUser = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            firstName,
            lastName,
            gender,
            country,
            city,
            phone_number,
        } = req.body;

        if (password.length < 8 || password.length > 30) {
            return res.status(400).json({ error: "Password must be between 8 and 32 characters"});
        }
        if (!/\d/.test(password)) {
            return res.status(400).json({ error: "Password must contain at least one number" });
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            return res.status(400).json({ error: "Password must contain at least one special character" });
        }
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ error: "Password must contain at least one uppercase character" });
        }
        if (!/[a-z]/.test(password)) {
            return res.status(400).json({ error: "Password must contain at least one lowercase letter" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({
            user_id: uuidv4(),
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            gender,
            country,
            city,
            phone_number,
            isActivated: false,
        });

        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

        const responseData = { ...User.dataValues, password: undefined};

        // Generate activation token with user_id
        const activationToken = jwt.sign(
            { user_id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const activationLink = `${process.env.APP_URL}/account-activation?token=${activationToken}`;
        const dynamicData = { firstName, lastName, activationLink };
        console.log("activationLink", activationLink);

        const templateFilePath = path.join(
            __dirname,
            "../../email-templates/activate-account.html"
          );
      
          const subject = "Activate Your Account";
      
        await sendEmail(email, subject, templateFilePath, dynamicData);

        res.status(201).json({user: responseData, token});
        
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create user"});
    }
};

const activateUser = async (req, res) => {
    const token = req.query.token;
    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.user_id;
  
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ error: "Invalid token" });
      }
  
      if (user.isActivated) {
        return res.status(400).json({ error: "Account already activated" });
      }
  
      await user.update({ isActivated: true });
      res.json({ message: "Account activated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to activate account" });
    }
  };

  const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    // Validate email format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
  
    try {
      // Check if user exists
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: "User with this email does not exist" });
      }
  
      // Generate password reset token
      const resetToken = jwt.sign(
        { user_id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Generate password reset link
      const resetLink = `${process.env.APP_URL}/change-password?token=${resetToken}`;
      const dynamicData = { firstName: user.firstName, resetLink };
  
      console.log("resetLink", resetLink);
  
      // Define the path to your HTML template
      const templateFilePath = path.join(
        __dirname,
        "../../email-templates/change-password.html"
      );
  
      const subject = "Change Your Password";
  
      // Send password reset email
      await sendEmail(email, subject, templateFilePath, dynamicData);
  
      res.status(200).json({ message: "Password change link sent to your email" });
    } catch (error) {
      console.error("Failed to send password change link:", error);
      res.status(500).json({ error: "Failed to send password change link" });
    }
  };

  const changePassword = async (req, res) => {
    const { newPassword } = req.body;
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.user_id;
  
      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ error: "Invalid token" });
      }
  
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
      await user.update({ password: hashedPassword });
  
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update password" });
    }
  };
  

const updateUser = async (req, res) => {
    const { id } = req.params;
    const {
        username,
            email,
            password,
            firstName,
            lastName,
            gender,
            country,
            city,
            phone_number,      
    } = req.body;
    try {
        const user = await User.findOne({
            where: { id: id },
        });

        if (user) {
            await user.update({
                username,
                email,
                password,
                firstName,
                lastName,
                gender,
                country,
                city,
                phone_number,
            });
            res.json(user);
        }
        else {
            res.status(404).json({ error: "User not found"});
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update user"});
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            where: { id: id },
        });

        if (user) {
            await user.destroy();
            res.json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        
        console.error(error);
        res.status(500).json({ error: "Failed to delete user" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email }});
        if(!user){
            return res.status(401).json({ error: "Invalid credentials "});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ error: "Invalid credentials "});
        }

        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h'});

        res.json({
            message: 'User logged in successfully',
            user: {
                username: user.username,
                email: user.email
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error'});
    }
};

const checkEmailAvailability = async (req, res) => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email }});

        if (existingUser) {
            return res.json({ available: false }); // Email is not available
        } else {
            return res.json({ available: true }); // Email is available
        }
    } catch (error) {
        console.error('Error checking email availability:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const checkUsernameAvailability = async (req, res) => {
    const { username } = req.body;

    try {
        const existingUser = await User.findOne({ where: { username }});

        if (existingUser) {
            return res.json({ available: false }); // Email is not available
        } else {
            return res.json({ available: true }); // Email is available
        }
    } catch (error) {
        console.error('Error checking username availability:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const checkPassword = async (req, res) => {
    const { userId, password } = req.body;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            return res.json({ valid: true }); // Password is correct
        } else {
            return res.json({ valid: false }); // Password is incorrect
        }
    } catch (error) {
        console.error('Error checking password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const checkPasswordUniqueness = async (req, res) => {
    const { userId, newPassword } = req.body;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isSame = await bcrypt.compare(newPassword, user.password);

        if (isSame) {
            return res.json({ unique: false }); // New password is the same as the current password
        } else {
            return res.json({ unique: true }); // New password is different
        }
    } catch (error) {
        console.error('Error checking password uniqueness:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updatePassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({ where: { id: id } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ error: "New password must be different from the current password" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await user.update({ password: hashedPassword });
        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: "Failed to update password" });
    }
};



module.exports = {
    User,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    checkEmailAvailability,
    checkUsernameAvailability,
    checkPassword,
    checkPasswordUniqueness,
    updatePassword,
    activateUser,
    forgotPassword,
    changePassword,
};