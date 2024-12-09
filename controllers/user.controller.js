const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { renderPage } = require("../utils/users.pagerender");
const path = require("path");
const fs = require("fs");

const updateUserProfile = async (userId, updatedFields) => {
  return User.findByIdAndUpdate(userId, updatedFields, { new: true });
};

const checkPassword = async (userId, oldPassword) => {
  const user = await User.findById(userId); 

  if (!user || !user.password) {
    throw new Error("User or password not found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  return isMatch;
};

const updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
  await User.findByIdAndUpdate(userId, { password: hashedPassword }); // Update the database
};



const registerUser = async (req, res) => {
  try {
    const isQcuStudent = req.body.qcuStudOption === "True";

    const user = new User({
      name: req.body.name,
      qcuStud: isQcuStudent,
      studentNo: isQcuStudent ? req.body.studNo : null,
      course: isQcuStudent ? req.body.course : null,
      contactNo: req.body.contactNo,
      email: req.body.email,
      address: req.body.address,
      fbLink: req.body.fbLink,
      password: await bcrypt.hash(req.body.password, 10),
    });

    await user.save();
    res.redirect("/");
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";

    if (error.code === 11000) {
      if (error.keyPattern.email) {
        errorMessage = "Email already exists.";
      } else if (error.keyPattern.studentNo) {
        errorMessage = "Student ID already exists.";
      }
    } else {
      errorMessage = error.message;
    }

    res.redirect(`/login?error=${encodeURIComponent(errorMessage)}&form=register`);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect(`/login?error=${encodeURIComponent("Invalid email or password")}&form=customer`);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect(`/login?error=${encodeURIComponent("Invalid email or password")}&form=customer`);
    }

    const token = jwt.sign(
      { id: user._id, qcuStud: user.qcuStud, email: user.email, name: user.name, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    res.redirect("/");
  } catch (error) {
    res.redirect(`/login?error=${encodeURIComponent(error.message)}&form=customer`);
  }
};

const userProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const pagePath = path.join(__dirname, "../views/pages/user/profile.html");
    let pageContent = fs.readFileSync(pagePath, "utf-8");

    pageContent = pageContent
      .replace(/<!-- NAME -->/g, user.name || "")
      .replace(/<!-- STUDNO -->/g, user.studentNo || "")
      .replace(/<!-- COURSE -->/g, user.course || "")
      .replace(/<!-- CONTACTNO -->/g, user.contactNo || "")
      .replace(/<!-- EMAIL -->/g, user.email || "")
      .replace(/<!-- ADDRESS -->/g, user.address || "")
      .replace(/<!-- FBLINK -->/g, user.fbLink || "")
      pageContent = pageContent
      .replace(/<!-- IMAGE -->/g, user.profilePicture || "/images/profile.jpg");
    
    const fullPage = renderPage(pageContent , 'Profile', 'profile');
    res.status(200).send(fullPage);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "An error occurred while fetching the profile" });
  }
};


const saveUserProfile = async (req, res) => {
  try {
    const {
      name,
      studNo,
      course,
      contactNo,
      email,
      address,
      fbLink,
      oldPassword,
      newPassword,
      removeImage,
    } = req.body;

    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (oldPassword && newPassword) {
      const isOldPasswordValid = await checkPassword(userId, oldPassword);
      if (!isOldPasswordValid) {
        return res.status(400).json({ message: "Incorrect old password" });
      }
      await updatePassword(userId, newPassword);
    }

    let profileImagePath = user.profilePicture;

    if (req.file) {
      if (user.profilePicture) {
        const oldImagePath = path.join(__dirname, "../public", user.profilePicture);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); 
        }
      }

      profileImagePath = `/uploads/${req.file.filename}`;
    }

    if (removeImage === "true") {
      if (profileImagePath) {
        const oldImagePath = path.join(__dirname, "../public", profileImagePath);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      profileImagePath = null;
    }

    // Update user profile
    const updatedUser = await updateUserProfile(userId, {
      name,
      studentNo: studNo,
      course,
      contactNo,
      email,
      address,
      fbLink,
      profilePicture: profileImagePath,
    });

    if (!updatedUser) {
      return res.status(500).json({ message: "Error updating user profile" });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      message: "An error occurred while updating the profile",
      details: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  userProfile,
  saveUserProfile,};
