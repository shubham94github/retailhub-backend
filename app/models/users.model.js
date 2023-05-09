
module.exports = (sequelize, Sequelize) => {
    const users = sequelize.define("users", {
      approved_by_admin_at: {
        type: Sequelize.DATE
      },
      email: {
        type: Sequelize.STRING
      },
      first_name: {
        type: Sequelize.STRING
      },
      full_name: {
        type: Sequelize.STRING
      },
      is_approved_by_admin: {
        type: Sequelize.BOOLEAN
      },
      is_blocked: {
        type: Sequelize.BOOLEAN
      },
      is_enable_2fa: {
        type: Sequelize.BOOLEAN
      },
      is_verified:{
        type:Sequelize.BOOLEAN
      },
      last_name: {
        type:Sequelize.STRING
      },
      password: {
        type:Sequelize.STRING
      },
      phone_number: {
        type:Sequelize.STRING
      },
      position: {
        type:Sequelize.STRING
      },
      role: {
        type:Sequelize.STRING
      },
      status: {
        type:Sequelize.STRING
      },
      avatar_id: {
        type:Sequelize.BIGINT
      },
      avatar_120_id: {
        type:Sequelize.BIGINT
      },
      avatar_30_id: {
        type:Sequelize.BIGINT
      },
      avatar_60_id: {
        type:Sequelize.BIGINT
      },
      user_online_status_id: {
        type:Sequelize.BIGINT
      },
      retailers_id: {
        type:Sequelize.BIGINT
      },
      startup_id: {
        type:Sequelize.BIGINT
      },
      is_enable_mailing:{
        type:Sequelize.BOOLEAN
      },
      department_id: {
        type:Sequelize.BIGINT
      },
      position_id: {
        type:Sequelize.BIGINT
      },
      city: {
        type:Sequelize.STRING
      },
      authority_id: {
        type:Sequelize.BIGINT
      },
      country_id: {
        type:Sequelize.BIGINT
      },
      member_id: {
        type:Sequelize.BIGINT
      },
      complete_percentage: {
        type:Sequelize.STRING
      },
      is_trial_for_reg: {
        type:Sequelize.BOOLEAN
      },
      trial_end_at:{
        type:Sequelize.STRING
      },
      provider:{
          type:Sequelize.STRING
      },
      system_type:{
        type:Sequelize.STRING,
        defaultValue: 'web'
      },
      is_deleted: {
        type:Sequelize.BOOLEAN
      },
    },{
      timestamps: false
    });
  
    return users;
  };
  