var express = require('express');
const { startups, sequelize } = require("../models");
const db = require("../models");
const Startupas = db.startups;
const startupsCountries = db.startupsCountries;
const startup_categories = db.startup_categories;
const users = db.user;
const startup_areas_of_interest = db.startup_areas_of_interest;

const countries = db.countries;

const Op = db.Sequelize.Op;

// countries.hasMany(startupsCountries);
// startupsCountries.belongsTo(countries);

const myArray = new Array();
// Number of Demo startups.
Startupas.count({ where: { account_type: "DEMO", company_status: "STARTUP" } }).then(data => {
  myArray['demo_Startups'] = data;
}),
  // Number of Imported startups Blocked:-
  Startupas.count({ where: { account_type: "IMPORTED", is_blocked: "true", company_status: "STARTUP" } }).then(data => {
    myArray['imported_Blocked'] = data;
  });
// Number of Imported startups Blocked Active:-
Startupas.count({ where: { account_type: "IMPORTED", is_blocked: "false", company_status: "STARTUP" } }).then(data => {
  myArray['imported_Active'] = data;
});
// Number of startups with Company status Growth 
Startupas.count({ where: { company_status: "GROWTH" } }).then(data => {
  myArray['startups_Growth'] = data;
});
// Number of startups with Company status Scaleup 
Startupas.count({ where: { company_status: "SCALEUP" } }).then(data => {
  myArray['startups_Scaleup'] = data;
});
// Number of standard type startups 
Startupas.count({ where: { company_type: "LIMITED_LIABILITY_COMPANY" } }).then(data => {
  myArray['standard_type_startups'] = data;
});

// timeline
var date = new Date();
var fromMonth = new Date(new Date().setDate(date.getDate() - 30)), y = fromMonth.getFullYear(), m = fromMonth.getMonth();;
var month = fromMonth = date.getMonth();
const datatimeline = new Array();
const NOW = new Date();
const moment = require('moment')
Startupas.count({
  where: {
    [Op.and]: [
      sequelize.fn('EXTRACT(YEAR from "created_at") =', y),
      sequelize.fn('EXTRACT(MONTH from "created_at") =', month),
    ]
  }
})
  .then(data => {
    myArray['last_month'] = data;
  });
Startupas.count({
  where: {
    [Op.and]: [
      sequelize.fn('EXTRACT(YEAR from "created_at") =', 2022),
      // this.app.sequelize.fn('EXTRACT(day from "createdAt") =', 3),
    ]
  }
})
  .then(data => {
    myArray['startups_added_in_2022'] = data;
  });
//
//number_of_startup_per_country
// sequelize.query("SELECT a.country_id, COUNT(a.*) as countbycountr, b.name FROM startup_presence_in_countries as a, countries b where a.country_id = b.id group by a.country_id, b.id ORDER BY a.country_id").then(data => {
//     myArray['number_of_startup_per_country']=data[0];
// });

//   sequelize.query("SELECT v.name name, COUNT(DISTINCT vo.startup_id) countbystartup,COUNT(DISTINCT oi.id) countbyuser FROM countries v LEFT OUTER JOIN startup_presence_in_countries vo ON v.id = vo.country_id LEFT OUTER JOIN users oi ON oi.country_id = v.id GROUP BY v.id, v.name LIMIT 10 OFFSET 22;").then(data => {
//     myArray['number_of_startup_per_country']=data[0];
// });

// number_of_startups_in_Fashion

sequelize.query("select count(*) from startup_areas_of_interest where category_id IN (select id from category where name like '%Fashion%' )").then(data => {

  myArray['number_of_startups_in_Fashion'] = parseInt(data[0][0].count);
});

//startup_areas_of_interest

sequelize.query("select count(*) from startup_areas_of_interest where category_id IN (select id from category where name like '%E-commerce%' )").then(data => {

  myArray['number_of_startups_in_E_commerce'] = parseInt(data[0][0].count);
});
// Number of startups in Blockchain
sequelize.query("select count(*) from startup_areas_of_interest where category_id IN (select id from category where name like '%Blockchain%')").then(data => {
  myArray['number_of_startups_in_blockchain'] = parseInt(data[0][0].count);
});

//
var dateFrom = moment(dateFrom).subtract(3, 'months').endOf('month').format('YYYY-MM-DD');
// number_of_users
sequelize.query("select role,count(*) from users group by role").then(data => {
  myArray['number_of_users'] = data[0];
});
//
//  added users in last 3 months
Startupas.count({
  where: {
    created_at: {
      [Op.gt]: dateFrom,
      [Op.lt]: NOW
    }
  }
})
  .then(data => {
    myArray['users_in_last_3months'] = data;
  });

// Number of users per country
// sequelize.query("SELECT a.country_id, COUNT(a.*) as countbycountr, b.name FROM users as a, countries b where a.country_id = b.id group by a.country_id, b.id ORDER BY a.country_id").then(data => {
//   myArray['users_per_country']=data[0];
// });
//
// Number of active Users in last month
sequelize.query("SELECT count(*) from users where created_at >  CURRENT_DATE - INTERVAL '1 months' and is_blocked='false'").then(data => {
  myArray['active_Users_in_last_month'] = parseInt(data[0][0].count);;
});

//
// Top keywords searched by Users
sequelize.query("select DISTINCT key_word from search_history where key_word IS NOT NULL limit 15").then(data => {
  myArray['top_keywords_searched_by_Users'] = data[0];
});

//Top list of [N] startups searched by users
// sequelize.query("SELECT a.startup_id, COUNT(a.*) as countbystrup, b.full_name FROM click_history as a, users b where a.user_id = b.id group by a.startup_id, b.id ORDER BY a.startup_id").then(data=>{
//   myArray['top_list_of_[N]_startups_searched_by_users']=data[0];
// });

sequelize.query("SELECT b.user_id, COUNT(b.*) as countbystrup, a.full_name FROM users as a, search_history b where a.id = b.user_id group by a.id, b.user_id ORDER BY a.id").then(data => {
  myArray['top_list_of_[N]_startups_searched_by_users'] = data[0];
});
// Which user clicked on which startup
sequelize.query("SELECT a.startup_id, COUNT(a.*) as countbystrup, b.full_name FROM click_history as a, users b where a.user_id = b.id group by a.startup_id, b.id ORDER BY a.startup_id").then(data => {
  myArray['Which_user_clicked_on_which_startup'] = data[0];
});
//

// country wise price
// sequelize.query("SELECT countries.id FROM countries join users on users.country_id=countries.id join payments on payments.clientid=users.id group by countries.id").then(data=>{
//   myArray['country_id']=data;
// });
//users 
sequelize.query("SELECT countries.name as country_name, payments.payment_status as pa,payments.isdeleted as isdeleted, countries.id as cid ,users.id, payments.price as revenue_amount FROM countries join users on users.country_id=countries.id join payments on payments.clientid=users.id where payments.payment_status != 'Delete' AND payments.isdeleted = 'false' group by countries.id,users.id,payments.price,payments.payment_status,payments.isdeleted").then(data => {
  const a = data[0];
  var temp = {};
  a.forEach(function (obj) {
    if (!temp[obj.country_name]) {
      temp[obj.country_name] = parseInt(obj.revenue_amount.slice(4))
    } else {
      temp[obj.country_name] = Number(temp[obj.country_name]) + Number(obj.revenue_amount.slice(4));
    }
  });

  //Format the data into desired output
  const result = [];
  const cname = [];
  for (var key in temp) {
    result.push({
      country_name: key,
      revenue_amount: temp[key]
    })

  }
  myArray['sum_price'] = result;

  // can.forEach(element => {
  //   myArray['sum_price']+=parseInt(element.price.slice(4));
  // });
});
//

exports.dashboardCount = (req, res) => {
  myArray['currentPage'] = req.params.id;
  if (myArray['currentPage'] == null) {
    sequelize.query("SELECT v.name vname, COUNT(DISTINCT vo.startup_id) countbystartup,COUNT(DISTINCT oi.id) countbyuser FROM countries v LEFT OUTER JOIN startup_presence_in_countries vo ON v.id = vo.country_id LEFT OUTER JOIN users oi ON oi.country_id = v.id GROUP BY v.id, v.name;").then(data => {
      const pages = Math.ceil(data[0].length / 10);
      myArray['pages'] = pages;
    });
    sequelize.query("SELECT v.name vname, COUNT(DISTINCT vo.startup_id) countbystartup,COUNT(DISTINCT oi.id) countbyuser FROM countries v LEFT OUTER JOIN startup_presence_in_countries vo ON v.id = vo.country_id LEFT OUTER JOIN users oi ON oi.country_id = v.id GROUP BY v.id, v.name LIMIT 10 OFFSET 1;").then(data => {
      myArray['number_of_startup_per_country'] = data[0];
    });
    myArray['currentPage'] = 1;
  } else {
    sequelize.query("SELECT v.name vname, COUNT(DISTINCT vo.startup_id) countbystartup,COUNT(DISTINCT oi.id) countbyuser FROM countries v LEFT OUTER JOIN startup_presence_in_countries vo ON v.id = vo.country_id LEFT OUTER JOIN users oi ON oi.country_id = v.id GROUP BY v.id, v.name;").then(data => {
      const pages = Math.ceil(data[0].length / 10);
      myArray['pages'] = pages;
    });
    sequelize.query("SELECT v.name vname, COUNT(DISTINCT vo.startup_id) countbystartup,COUNT(DISTINCT oi.id) countbyuser FROM countries v LEFT OUTER JOIN startup_presence_in_countries vo ON v.id = vo.country_id LEFT OUTER JOIN users oi ON oi.country_id = v.id GROUP BY v.id, v.name LIMIT 10 OFFSET " + myArray['currentPage'] + ";").then(data => {
      myArray['number_of_startup_per_country'] = data[0];
    });
  }
  res.json({
    "success": true,
    "message": "Dashboard count in successfully",
    "data": {
      standard_type_startups: myArray['standard_type_startups'],
      demo_Startups: myArray['demo_Startups'],
      imported_Active: myArray['imported_Active'],
      imported_Blocked: myArray['imported_Blocked'],
      startups_Growth: myArray['startups_Growth'],
      startups_Scaleup: myArray['startups_Scaleup'],
      startups: myArray['startups'],
      retailer_sectors: myArray['retailer_sectors'],
      areas_of_interest: myArray['areas_of_interest'],
      last_month: myArray['last_month'],
      startups_added_in_2022: myArray['startups_added_in_2022'],
      // number_of_startup_per_country:{data:myArray['number_of_startup_per_country']},
      number_of_startup_per_country: { lastPage: myArray['pages'], currentPage: myArray['currentPage'], data: myArray['number_of_startup_per_country'] },
      number_of_startups_in_Fashion: myArray['number_of_startups_in_Fashion'],
      number_of_startups_in_E_commerce: myArray['number_of_startups_in_E_commerce'],
      number_of_startups_in_blockchain: myArray['number_of_startups_in_blockchain'],
      //user
      number_of_user: myArray['number_of_users'],
      users_in_last_3months: myArray['users_in_last_3months'],
      // users_per_country:myArray['users_per_country'],
      // ACTIVITY
      active_Users_in_last_month: myArray['active_Users_in_last_month'],
      top_keywords_searched_by_Users: myArray['top_keywords_searched_by_Users'],
      top_list_of_N_startups_searched_by_users: myArray['top_list_of_[N]_startups_searched_by_users'],
      which_user_clicked_on_which_startup: myArray['Which_user_clicked_on_which_startup'],
      country_wise_revenue_amount: myArray['sum_price'],
    }
  });
};

// time line count
//
exports.timeline = (req, res) => {
  res.json({
    "success": true,
    "message": "Timeline count  in successfully",
    // "data": {timeline: datatimeline['timeline']}
    "data": { last_month: datatimeline['last_month'], last_month: datatimeline['startups_added_in_2022'] }
  });
};