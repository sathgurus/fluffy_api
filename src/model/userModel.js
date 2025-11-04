const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/.+\@.+\..+/, "Please enter a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
        confirmPassword: {
            type: String,
            required: function () {
                // Required only on creation
                return this.isNew;
            },
            validate: {
                validator: function (value) {
                    return value === this.password;
                },
                message: "Passwords do not match",
            },
        },
        termsAccepted: {
            type: Boolean,
            required: [true, "You must accept the terms and conditions"],
            validate: {
                validator: function (value) {
                    return value === true;
                },
                message: "You must accept the terms and conditions",
            },
        },
        role: {
            type: String,
            enum: ["admin", "business_owner", "end_user"],
            default: "end_user",
            required: [true, "User role is required"],
        },
        otp: { type: String, default: null },
        otpVerified: { type: Boolean, default: false },
        resetOTP: { type: String },
        otpExpires: { type: Date },
        isUserRegister: { type: Boolean, default: false },
        isAddBusiness: { type: Boolean, default: false },
        isAddLocation: { type: Boolean, default: false },
        isAddPersonal: { type: Boolean, default: false },
        isAddService: { type: Boolean, default: false },
        isFormSubmit: { type: Boolean, default: false },
    },

    {
        timestamps: true,
    }
);

// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined; // remove confirmPassword before saving
    next();
});

module.exports = userSchema;
