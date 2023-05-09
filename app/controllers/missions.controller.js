const { missions, users, sequelize, user } = require("../models");
const db = require("../models");
const User = db.user;
const Missions = db.missions;
const Op = db.Sequelize.Op;
const { body, validationResult } = require('express-validator');
const { where } = require("sequelize");
var nodemailer = require('nodemailer');
const usersModel = require("../models/users.model");
const { QueryTypes } = require('sequelize');
const SMTPConnection = require("nodemailer/lib/smtp-connection");
// Create and Save a new Missions
exports.create = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const missions = {
    title: req.body.title,
    description: req.body.description,
    timeline: req.body.timeline,
    budget: req.body.budget,
    user_id: req.body.user_id,
    locations: req.body.locations,
    startup: req.body.startup,
    interest: req.body.interest,
    assignto: null,
    isdeleted: false,
    mission_result: null,
    status: "new"
  };
  // Save Missions in the database
  Missions.create(missions).then(missions => res.json(missions))
}
// Retrieve all Missions from the database.
exports.findAll = (req, res) => {
  const myArray = new Array();
  const page = req.params.id;
  Missions.findAll({
    include: [{
      model: user,
      as: 'user'
    },
    {
      model: user,
      as: 'assign_user'
    }
    ],
    where: [{ isdeleted: false }]
  }).then(data => {
    if (data[0] == null) {
      res.json({
        success: true,
        message: "Mission not found....",
        data: data
      })
    } else {
      res.json({
        success: true,
        message: "Mission find with user successfully",
        data: data
      })
    }

  })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Missions with id=" + err
      });
    });

  // sequelize.query("SELECT public.missions.*,users.full_name FROM public.missions  LEFT OUTER JOIN users  ON public.missions.assignto=users.id  where public.missions.isdeleted=false").then(data => {
  //   res.status(200).json({
  //     success: true,
  //     message: "Mission not found....",
  //     data: data[0]
  //   })
  // });
  // SELECT public.missions.*, users.full_name FROM public.missions  LEFT OUTER JOIN users  ON public.missions.assignto = users.id  where public.missions.isdeleted = false and user_id = 211
  // if(page==null){
  //   sequelize.query("SELECT m.*,u.full_name as assign_user_name,u.first_name,u.last_name,u.email FROM missions m left JOIN users u ON m.assignto =u.id WHERE m.isdeleted=false ORDER BY m.id DESC LIMIT 10 OFFSET 1").then(data=>{
  //     res.status(200).send({data:data[0],lastPage:myArray['pages'],currentPage:1,numbers_of_records:"1-"+myArray['pages']+" of "+myArray['record'] +" Results",sort:{"direction": "ASC",
  //     "fieldName": "status"}});
  //   })
  //     .catch(err => {
  //       res.status(500).send({
  //         message:
  //           err.message || "Some error occurred while retrieving Missions."
  //       });
  //     });
  // }else{
  //   sequelize.query("SELECT m.*,u.full_name as assign_user_name,u.first_name,u.last_name,u.email FROM missions m left JOIN users u ON m.assignto =u.id WHERE m.isdeleted=false ORDER BY m.id DESC LIMIT 10 OFFSET "+page+";").then(data=>{
  //     res.status(200).send({data:data[0],lastPage:myArray['pages'],currentPage:page,numbers_of_records:"1-"+myArray['pages']+" of "+myArray['record'] +" Results",sort:{"direction": "ASC",
  //     "fieldName": "status"}});
  //   })
  //     .catch(err => {
  //       res.status(500).send({
  //         message:
  //           err.message || "Some error occurred while retrieving Missions."
  //       });
  //     });
  //   }
  // const id = req.params.id;
  // if (id) {
  //   Missions.findAll({
  //     where: {
  //       user_id
  //         : id
  //     }
  //   })
  //     .then(data => {
  //       res.status(200).send({ data: data });
  //     })
  //     .catch(err => {
  //       res.status(500).send({
  //         message:
  //           err.message || "Some error occurred while retrieving Missions."
  //       });
  //     });
  // } else {
  //   Missions.findAll()
  //     .then(data => {
  //       res.status(200).send({ data: data });
  //     })
  //     .catch(err => {
  //       res.status(500).send({
  //         message:
  //           err.message || "Some error occurred while retrieving Missions."
  //       });
  //     });
  // }

};

// Find a single Missions with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Missions.findAll({
    include: [{
      model: user,
      as: 'user'
    },
    {
      model: user,
      as: 'assign_user'
    }
    ],
    where: { id: id }
  }).then(data => {
    if (data[0] == null) {
      res.json({
        success: true,
        message: "Mission not found....",
        data: data[0]
      })
    } else {
      res.json({
        success: true,
        message: "Mission find with user successfully",
        data: data[0]
      })
    }

  })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Missions with id=" + id
      });
    });
};


// sequelize.query("SELECT a.*, b.id as userid, to_jsonb(b.*) as userData FROM missions as a, users b where a.user_id = b.id and a.id="+id+" ORDER BY a.id").then(data => {
//       res.json({success: true,
//           message: "Mission find successfully",
//           data: data})
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error retrieving Missions with id=" + id
//       });
//     });
//};

// Update a Missions by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Missions.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          success: true,
          message: "Missions was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Missions with id=${id}. Maybe Missions was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Missions with id=" + id
      });
    });
};

// Delete a Missions with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Missions.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Missions was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Missions with id=${id}. Maybe Missions was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Missions with id=" + id
      });
    });
};

// Delete all Missions from the database.
exports.deleteAll = (req, res) => {
  Missions.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Missions were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Missions."
      });
    });
};
exports.updateStatus = (req, res) => {
  const id = req.params.id;

  Missions.update(req.body, {
    where: { id: id }
  }).then(num => {
    if (num == 1) {
      res.send({
        success: true,
        message: "Status was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update Status with id=${id}`
      });
    }
  })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Missions with id=" + id
      });
    });

};
const myArray = new Array();
exports.assignto = (req, res) => {
  const user_id = req.body.assignto;
  const id = req.params.id;
  //  sequelize.query("select * from missions where id="+id+"")
  Missions.findAll({
    include: [{
      model: user,
      as: 'user'
    },
    {
      model: user,
      as: 'assign_user'
    }
    ],
    where: { id: id }
  }).then(data => {
    myArray['mission'] = data[0];
  });
  const mission = sequelize.query("select * from missions where id=" + id + "");
  //  res.send(mission);
  sequelize.query("select * from users where id =" + user_id + "").then(data => {
    myArray['assigned_user'] = assigned_user;
  });
  Missions.update({ assignto: user_id }, { where: { id: id } }).then(data => {
    res.send({
      success: true,
      message: "successfully assign to user",
      data: { mission: myArray['mission'], assigned_user: myArray['assigned_user'] }

    });
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Missions."
      });
    });
};
exports.mission_mail = (req, res) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,               // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
      user: 'bharat95584@gmail.com',
      pass: 'BHARAT@7046222422'
    }
  });

  var mailOptions = {
    from: 'bharat95584@gmail.com',
    to: 'kk.greatideas@gmail.com',
    subject: 'mission create',
    text: 'mission info'
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(422).json({ message: "email not sent" })
    } else {
      console.log(info.response)
      //res.status(200).json('Email sent: ');
    }
  });
}
//get missions of user by id
exports.myMission = (req, res) => {
  const id = req.params.id;
  Missions.findAll({
    include: [{
      model: user,
      as: 'user'
    },
    {
      model: user,
      as: 'assign_user'
    }
    ],
    where: [{ user_id: id }, { isdeleted: false }]
  }).then(data => {
    if (data[0] == null) {
      res.json({
        success: true,
        message: "Mission not found....",
        data: data
      })
    } else {
      res.json({
        success: true,
        message: "Mission find with user successfully",
        data: data
      })
    }

  })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Missions with id=" + err
      });
    });

};

//update missions result 

exports.updateResult = (req, res) => {
  const id = req.params.id;

  Missions.update(req.body, {
    where: { id: id }
  }).then(num => {
    if (num == 1) {
      res.send({
        success: true,
        message: "Mission result was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update Mission result with id=${id}`
      });
    }
  })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Mission result with id=" + id
      });
    });

};

// Find a single Missions with an id
exports.findMissionByUser = (req, res) => {
  const id = req.params.id;
  Missions.findAll({ where: { user_id: id }, where: { isdeleted: false } }).then(data => {
    if (data == null) {
      res.json({
        success: true,
        message: "Mission not found....",
        data: data
      })
    } else {
      res.json({
        success: true,
        message: "Mission find of user id=" + id + "successfully",
        data: data
      })
    }

  })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Missions with id=" + id
      });
    });
};
//filter missions by title,body and description
//search users by
exports.filter_mission = async (req, res) => {

  Missions.count({
    where: {
      [Op.or]: [{
        title: {
          [Op.like]: `%${req.body.title}%`
        }
      },
      {
        description: {
          [Op.like]: `%${req.body.description}%`
        }
      },
      {
        status: {
          [Op.like]: `%${req.body.status}%`
        }
      },
      {
        createdAt: {
          [Op.data]: req.body.createdAt
        }
      }
      ]
    }
  })
    .then(data => {
      myArray['alldata'] = data;
    });

  Missions.findAll(
    {
      where: {
        [Op.or]: [{
          title: {
            [Op.like]: `%${req.body.title}%`
          }
        },
        {
          description: {
            [Op.like]: `%${req.body.description}%`
          }
        },
        {
          status: {
            [Op.like]: `%${req.body.status}%`
          }
        },
        {
          createdAt: {
            [Op.data]: req.body.createdAt
          }
        }
        ]
      }, limit: req.body.limit, offset: req.body.page
    }).then(data => {
      myArray['currentPages'] = req.body.page;
      const pages = Math.ceil(data.length / 10);
      if (req.body.page = null) {
        const pages = Math.ceil(data.length / 10);
        const records = data.length;
        myArray['pages1'] = pages;
        myArray['record1'] = records;
      } else {
        const pages = Math.ceil(myArray['alldata'] / req.body.limit);

        const records = data.length;
        myArray['pages1'] = pages;
        myArray['record1'] = records;
      }

      if (data[0] == null) {
        res.json({
          success: true,
          message: "Mission not found....",
          data: data
        })
      } else {
        res.json({
          success: true,
          message: "Mission find successfully",
          data: data, lastPage: myArray['pages1'], currentPage: myArray['currentPages'], numbers_of_records: "1-" + myArray['pages1'] + " of " + myArray['record1'] + " Results"
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Missions."
      });
    });
}