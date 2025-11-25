const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },

        businessName: {
            type: String,
            required: [true, "Business name is required"],
            trim: true,
        },
        businessType: {
            type: String,
            required: [true, "Business type is required"],
            trim: true,
        },
        businessPhone: {
            type: String,
            required: [true, "Business phone number is required"],
            match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
        },

        altPhone: {
            type: String,
            default: "",
            match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
        },

        businessEmail: {
            type: String,
            required: false,
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
            validate: {
                validator: function (value) {
                    // validate only during creation or password change
                    return !this.isModified("password") || value === this.password;
                },
                message: "Passwords do not match",
            },
        },

        termsAccepted: {
            type: Boolean,
            required: [true, "You must accept the terms and conditions"],
        },

        role: {
            type: String,
            enum: ["admin", "owner", "customer"],
            default: "customer",  // ✔ FIXED
            required: true,
        },

        otp: { type: String, default: null },
        otpVerified: { type: Boolean, default: false },
        resetOTP: { type: String },
        otpExpires: { type: Date },

        isUserRegister: { type: Boolean, default: false },
        isAddLocation: { type: Boolean, default: false },
        isAddPersonal: { type: Boolean, default: false },
        isAddService: { type: Boolean, default: false },
        isFormSubmit: { type: Boolean, default: false },
        isBusinessHours: { type: Boolean, default: false },

        businessWebsite: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
            match: [
                /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/,
                "Please enter a valid website URL",
            ],
        },

        // Admin verification
        verificationStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            default: null,
        },

        verificationNotes: { type: String, default: null },
        verifiedAt: { type: Date, default: null },

        isVerified: {
            type: Boolean,
            default: false,
        },
        businessLocation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Locations",
        },

        businessHours: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BusinessHours",
        },

        shopVerification: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ShopVerify",
        },

    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
    next();
});

module.exports = mongoose.model("BusinessUsers", userSchema);
