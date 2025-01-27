import * as bcrypt from "bcrypt";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('Seeds for Users START...');
    
    const users = [
      {
        email: "admin@example.com",
        password: await bcrypt.hash("password123", 10),
        phone: "0834567890",
        biography: "An amazing writter.",
        firstName: "John",
        lastName: "Doe",
        nickname: "admin",
        role: "admin",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "publisher@example.com",
        password: await bcrypt.hash("password123", 10),
        phone: "0982354331",
        biography: "Young publisher.",
        firstName: "Jane",
        lastName: "Smith",
        nickname: "publisher",
        role: "publisher",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "publisher.usa@example.com",
        password: await bcrypt.hash("password123", 10),
        phone: "0987454321",
        biography: "Publisher USA",
        firstName: "Lisa",
        lastName: "Merino",
        nickname: "publisher.amazing",
        role: "publisher",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Log the users data being inserted
    console.log('Inserting users:', JSON.stringify(users, null, 2));

    try {
      await queryInterface.bulkInsert("Users", users);
      console.log('Seeds for Users END...');
    } catch (error) {
      console.error('Error during user seeding:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
