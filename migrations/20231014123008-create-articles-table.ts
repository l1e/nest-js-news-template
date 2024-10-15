import { QueryInterface, DataTypes } from 'sequelize';

export = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable('Articles', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      publishStatus: {
        type: DataTypes.ENUM('published', 'unpublished', 'draft'),
        allowNull: false,
      },
      validationStatus: {
        type: DataTypes.ENUM('approved', 'rejected', 'pending'),
        allowNull: false,
      },
      requestor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      articleOfTheDay: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: false,
      },
      articleSpecial: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: false,
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        // onDelete: 'SET NULL',
      },
      creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        // onDelete: 'SET NULL',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable('Articles');
  },
};
