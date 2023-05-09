module.exports = (sequelize, Sequelize) => {
  const startup_forms = sequelize.define("startup_forms", {
    name: {
      type: Sequelize.STRING
    },
    stage: {
      type: Sequelize.STRING
    },
    hq_country_id: {
      type: Sequelize.BIGINT
    },
    funding_amount: {
      type: Sequelize.BIGINT
    },
    business_model: {
      type: Sequelize.TEXT
    },
    customer_count: {
      type: Sequelize.STRING
    },
    image_src: {
      type: Sequelize.STRING
    },
    area_interest: {
      type: Sequelize.JSON
    },
    description: {
      type: Sequelize.TEXT
    },
    contact_name: {
      type: Sequelize.STRING
    },
    contact_email: {
      type: Sequelize.STRING
    },
    job_title: {
      type: Sequelize.STRING
    },
    phone_number: {
      type: Sequelize.STRING
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
  },{
    timestamps: true
  });

  return startup_forms;
};