module.exports = (sequelize, Sequelize) => {
    const category = sequelize.define("category", {
        child_header: {
        type: Sequelize.STRING
      },
      is_custom: {
        type: Sequelize.BOOLEAN
      },
      name: {
        type: Sequelize.STRING
      },
      parent_id: {
        type: Sequelize.BIGINT
      },
      parent_names:{
        type:Sequelize.TEXT
      },
      weight: {
        type: Sequelize.INTEGER
      },
      count_subcategories:{
        type:Sequelize.BIGINT
      },
      count_using_retailers: {
        type: Sequelize.BIGINT
      },
      count_using_startup_in_areas_of_interest: {
        type: Sequelize.BIGINT
      },
      count_using_startup_in_categories: {
        type: Sequelize.BIGINT
      },
      logo_url: {
        type: Sequelize.STRING
      },
      logo24_id: {
        type: Sequelize.BIGINT
      },
      areas_logo_url: {
        type: Sequelize.STRING
      },
      areas_logo24_id: {
        type: Sequelize.BIGINT
      },
      is_deleted: {
        type: Sequelize.BOOLEAN
      }
    },{
        timestamps:false,
        tableName : "category"
    },);
    
    return category;
  };
  