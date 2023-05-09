module.exports = (sequelize, Sequelize) => {
  const startups = sequelize.define("startups", {
    account_status: {
      type: Sequelize.STRING
    },
    business_model: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    clients_list: {
      type: Sequelize.TEXT
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
    company_type: {
      type: Sequelize.STRING
    },
    company_status: {
      type: Sequelize.STRING
    },
    email_domain: {
      type: Sequelize.STRING
    },
    feedback_count: {
      type: Sequelize.STRING
    },
    founded_at: {
      type: Sequelize.STRING
    },
    integration_timing: {
      type: Sequelize.STRING
    },
    is_blocked: {
      type: Sequelize.STRING
    },
    is_company: {
      type: Sequelize.BOOLEAN
    },
    is_new_feedbacks: {
      type: Sequelize.BOOLEAN
    },
    is_verified: {
      type: Sequelize.BOOLEAN
    },
    linked_in_company_page: {
      type: Sequelize.STRING
    },
    number_of_clients: {
      type: Sequelize.BIGINT
    },
    owner: {
      type: Sequelize.STRING
    },
    phone_number: {
      type: Sequelize.STRING
    },
    platform_partners: {
      type: Sequelize.TEXT
    },
    rate: {
      type: Sequelize.DOUBLE
    },
    rate_stars: {
      type:Sequelize.INTEGER
    },
    solutions_products_services: {
      type:Sequelize.TEXT
    },
    total_funding_amount: {
      type: Sequelize.BIGINT
    },
    
    url_of_company_website: {
      type: Sequelize.STRING
    },
    hq_country_id: {
      type: Sequelize.BIGINT
    },
    logo_id: {
      type: Sequelize.BIGINT
    },
    logo_120_id: {
      type: Sequelize.BIGINT
    },
    logo_30_id: {
      type: Sequelize.BIGINT
    },
    logo_60_id: {
      type: Sequelize.BIGINT
    },
    account_type: {
      type: Sequelize.STRING
    },
    admin_note: {
      type: Sequelize.TEXT
    },
    approved_at: {
      type: Sequelize.DATE
    },
    company_short_name_lower_case: {
      type: Sequelize.TEXT
    },
    is_enable_mailing: {
      type: Sequelize.BOOLEAN
    },
    is_approved_by_admin: {
      type: Sequelize.BOOLEAN
    },
    startup_interview_video_id: {
      type: Sequelize.BIGINT
    },
    startup_marketing_video_id: {
      type: Sequelize.BIGINT
    },
    brand_name: {
      type: Sequelize.TEXT
    },
    recommended_top_6: {
      type: Sequelize.BOOLEAN
    },
    recommended_top_20: {
      type: Sequelize.BOOLEAN
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
  },{
    timestamps: false
  });

  return startups;
};