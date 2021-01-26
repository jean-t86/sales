module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OrderLines', {
      orderId: {
        type: Sequelize.INTEGER,
      },
      productId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint('OrderLines', {
      fields: ['orderId', 'productId'],
      type: 'primary key',
      name: 'OrderLines_pkey',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('OrderLines');
  },
};
