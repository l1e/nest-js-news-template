import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface, sequelize: Sequelize) => {
    return queryInterface.createTable('Media', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Articles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      src: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isPhysicallyExist: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'no',
      },
      publishStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'draft', 
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'), 
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), 
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
	
	// Remove all Media
	await queryInterface.bulkDelete('Media', null, {});

	// Drop the Media table
    return queryInterface.dropTable('Media');
  },
};
