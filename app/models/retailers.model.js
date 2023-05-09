module.exports = (sequelize, Sequelize) => {
    const retailers = sequelize.define("retailers", {
        address: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      company_description: {
        type: Sequelize.TEXT
      },
      company_legal_name: {
        type: Sequelize.STRING
      },
      company_short_name: {
        type: Sequelize.STRING
      },
      customer_id: {
        type: Sequelize.STRING
      },
      email_domain: {
        type: Sequelize.STRING
      },
      is_company:{
        type:Sequelize.BOOLEAN
      },
      is_verified: {
        type:Sequelize.STRING
      },
      linked_in_company_page: {
        type:Sequelize.STRING
      },
      phone_number: {
        type:Sequelize.STRING
      },
      post_zip_code: {
        type:Sequelize.STRING
      },
      tax_id: {
        type:Sequelize.STRING
      },
      url_of_company_website: {
        type:Sequelize.STRING
      },
      country_id: {
        type:Sequelize.BIGINT
      },
      logo_id: {
        type:Sequelize.BIGINT
      },
      logo_120_id: {
        type:Sequelize.BIGINT
      },
      logo_30_id: {
        type:Sequelize.BIGINT
      },
      logo_60_id: {
        type:Sequelize.BIGINT
      },
      payment_plan_id: {
        type:Sequelize.BIGINT
      },
      stripe_payment_settings_id: {
        type:Sequelize.BIGINT
      },
      vat_number:{
        type:Sequelize.STRING
      },
      retailer_trial_limitation_id: {
        type:Sequelize.BIGINT
      },
    },{
      timestamps: false
    });
  
    return retailers;
  };