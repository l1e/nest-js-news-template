module.exports = {
	up: async (queryInterface, Sequelize) => {
	  console.log('Seeds for Categories START...');
  
	  await queryInterface.bulkInsert("Categories", [
		{
		  name: "Military",
		  description: "Articles covering the latest advancements in military robotics and their use in warfare.",
		  publishStatus: "published",
		  createdAt: new Date(),
		  updatedAt: new Date(),
		},
		{
		  name: "AI and Robot",
		  description: "Articles focusing on artificial intelligence and robotics integration in various industries.",
		  publishStatus: "published",
		  createdAt: new Date(),
		  updatedAt: new Date(),
		},
		{
		  name: "Cybersecurity",
		  description: "Articles exploring cybersecurity measures in robotics and autonomous military systems.",
		  publishStatus: "published",
		  createdAt: new Date(),
		  updatedAt: new Date(),
		},
		{
		  name: "Med and Robot",
		  description: "Articles about the use of robots in battlefield medicine and healthcare in warzones.",
		  publishStatus: "published",
		  createdAt: new Date(),
		  updatedAt: new Date(),
		},
		{
		  name: "Autonom Mil Sys",
		  description: "Articles discussing autonomous systems, drones, and their role in military operations.",
		  publishStatus: "published",
		  createdAt: new Date(),
		  updatedAt: new Date(),
		},
	  ]);
  
	  console.log('Seeds for Categories END...');
	},
  
	down: async (queryInterface, Sequelize) => {
	  console.log('Starting to delete data from Categories table...');
	  await queryInterface.bulkDelete("Categories", null, {});
	  console.log('Successfully deleted all records from Categories table.');
	},
  };
  