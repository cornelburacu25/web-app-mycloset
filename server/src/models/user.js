const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    
    static async isUnique(attribute, value, message) {
      const user = await User.findOne({
        where: { [attribute]: value}
      });
      if(user) {
        throw new Error(message);
      }
    }

    static containsNumber(value){
      if(!/\d/.test(value)){
        throw new Error('Password must contain at least one number');
      }
    }

    static containsSpecialCharacter(value){
      if(!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)){
        throw new Error('Password must contain at least one special character');
      }
    }
    
    static containsUppercase(value) {
      if (!/[A-Z]/.test(value)) {
        throw new Error('The attribute must contain at least one uppercase character');
      }
    }

    static containsLowercase(value) {
      if (!/[a-z]/.test(value)) {
        throw new Error('The attribute must contain at least one lowercase letter');
      }
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Username is required'},
          notEmpty: { msg: "Username can't be empty"},
          async isUnique(value){
            await User.isUnique('username', value, 'Username is already taken')
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Email is required'},
          notEmpty: { msg: "Email can't be empty"},
          isEmail: {msg: 'Invalid email format'},
          async isUnique(value){
            await User.isUnique('email', value, 'Email is already taken')
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'Password is required' },
          notEmpty: { msg: "Password can't be null"},
          containsNumber(value){
            User.containsNumber(value)
          },
          containsSpecialCharacter(value){
            User.containsNumber(value)
          },
          containsUppercase(value){
            User.containsUppercase(value)
          },
          containsLowercase(value){
            User.containsLowercase(value)
          },
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {msg: 'First name is required'},
          notEmpty: {msg: "First name can't be empty"},
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {msg: 'Last name is required'},
          notEmpty: {msg: "Last name can't be empty"},
        },
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["male","female","other","unknown"],
        defaultValue: "unknown",
        allowNull: false,
        validate:{
          notNull: {msg: 'Gender is required'},
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,        
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isActivated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    }, {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      schema: 'mycloset',
      timestamps: true, // Adds createdAt and updatedAt
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });

    return User;
};