import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {

    await queryInterface.createTable('Users', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      biography: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
      },
      role: {
        type: DataTypes.ENUM('admin', 'publisher'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'disabled'),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    // Remove all users
    await queryInterface.bulkDelete('Users', null, {});

    // Drop the Users table
    await queryInterface.dropTable('Users');
  },
};
