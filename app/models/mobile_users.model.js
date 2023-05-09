
module.exports = (sequelize, Sequelize) => {
    const mobileUsers = sequelize.define("mobile_users", {
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type:Sequelize.STRING
      },
      full_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type:Sequelize.STRING
      },
      phone_number: {
        type:Sequelize.STRING
      },
      reset_password_code:{
        type: Sequelize.STRING(50)  
      },
      reset_password_requested_on:{
          type: Sequelize.DATE
      },
      is_blocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_verified:{
        type:Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_linkedin_user: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      status: {
        type:Sequelize.STRING
      },
      is_deleted: {
        type:Sequelize.BOOLEAN,
        defaultValue: false
      },
    },{
      timestamps: true
    });
  
    return mobileUsers;
  };
  