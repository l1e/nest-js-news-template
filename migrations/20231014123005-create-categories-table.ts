module.exports = {
	up: async (queryInterface, Sequelize) => {
	  await queryInterface.createTable('Categories', {
		id: {
		  type: Sequelize.INTEGER,
		  autoIncrement: true,
		  primaryKey: true,
		  allowNull: false,
		},
		name: {
		  type: Sequelize.STRING,
		  allowNull: false,
		  unique: true, 
		},
		description: {
		  type: Sequelize.TEXT,
		  allowNull: true, 
		},
		publishStatus: {
		  type: Sequelize.ENUM('published', 'unpublished'),
		  allowNull: false,
		},
		createdAt: {
		  type: Sequelize.DATE,
		  allowNull: false,
		  defaultValue: Sequelize.NOW,
		},
		updatedAt: {
		  type: Sequelize.DATE,
		  allowNull: false,
		  defaultValue: Sequelize.NOW,
		},
	  });
	},
  
	down: async (queryInterface, Sequelize) => {
	  // Remove all categories
	  await queryInterface.bulkDelete('Categories', null, {});
  
	  // Drop the Categories table
	  await queryInterface.dropTable('Categories');
	},
  };
  