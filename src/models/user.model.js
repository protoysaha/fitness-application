import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/database.js";
// import Role from "./Role.js";
const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fullname: {
            type: DataTypes.STRING(100),
            allowNull: false,
            trim: true,
            index: true
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
            lowecase: true,
            trim: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            lowecase: true,
            trim: true,
            index: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        avatar: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        cover_image: {
            type: DataTypes.STRING(100),
            allowNull: true,

        },
        refresh_token: {
            type: DataTypes.STRING(100),

        },
        // role: {
        //   type: DataTypes.ENUM("user", "admin"),
        //   defaultValue: "user",
        //   allowNull: false,
        // },
        // role_id: {
        //   type: DataTypes.INTEGER,
        //   references: {
        //     model: "roles",
        //     key: "id",
        //   },
        // },

    },
    {
        tableName: "users",
        timestamps: true,
        hooks: {
            beforeCreate: async (user) => {
                if (!this.isModified("password")) {
                    if (user.password) {
                        user.password = await bcrypt.hash(user.password, 12);
                    }
                }

            },
            beforeUpdate: async (user) => {
                if (!this.isModified("password")) {
                    if (user.changed("password")) {
                        user.password = await bcrypt.hash(user.password, 12);
                    }
                }

            },
        },
    }
);
User.prototype.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

User.prototype.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
User.prototype.generateRefreshToken = function(){
     return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


// User.belongsTo(Role, { foreignKey: "role_id", as: "role" });
// Role.hasMany(User, { foreignKey: "role_id", as: "users" });

export default User;
