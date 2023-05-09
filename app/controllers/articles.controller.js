const { articles, articles_file_entities, startups, file_entities, sequelize, Sequelize, articles_tags, tags, article_file } = require("../models");
const imageDownloader = require('image-downloader');
const fs = require('fs');
const db = require("../models");
const Articles = db.articles;
const Articles_file = db.article_file;
const file_entitie = db.file_entities;
const Op = db.Sequelize.Op;
const { where, DATE } = require("sequelize");
const { body, validationResult } = require('express-validator');
const { json } = require("body-parser");
const os = require('os');
const Cryptr = require('cryptr');
const { Domain } = require("domain");
const cryptr = new Cryptr('myTotallySecretKey', { pbkdf2Iterations: 10000, saltLength: 10 });

const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  apiKey: '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'
})

const openai = new OpenAIApi(configuration)

const axios = require('axios');
exports.articles = (req, res) => {
  const startup_id = req.params.id;
  Articles.findAll({
    where: [{ start_up_id: startup_id }, { isdeleted: false }]
  }).then(data => {
    res.status(200).json({
      success: true,
      message: "Aticles  found....",
      data: data
    })
  }).catch(err => {
    res.status(400).json({
      success: true,
      message: "Aticles not found....",
      data: err
    })
  })

}


exports.genrateArticle = async (req, res) => {
  const startup_name = req.body.startup_name
  const requested_data = req.body.articles_field
  let response = ''
  if (requested_data == 'description') {
    let result = await openai.createCompletion(
      {
        model: "text-davinci-003",
        prompt: `Tell me description about ${startup_name}  in 50 words:`,
        max_tokens: 1024,
        n: 1,
        temperature: 0.5
      }

    )
    response = result.data.choices[0].text

  }
  else if (requested_data == 'tags') {
    let result = await openai.createCompletion(
      {
        model: "text-davinci-003",
        prompt: `give me  10 important tags or keywords related ${startup_name} startup in json array.`,
        max_tokens: 1024,
        n: 1,
        temperature: 0.5
      }

    )
    response = JSON.parse(result.data.choices[0].text)
  }
  else if (requested_data == 'article') {
    let keywords_ = await openai.createCompletion(
      {
        model: "text-davinci-003",
        prompt: `give me  10 important tags or keywords related ${startup_name} startup in json array.`,
        max_tokens: 1024,
        n: 1,
        temperature: 0.5
      }

    )
    const keywords = JSON.parse(keywords_.data.choices[0].text)


    let result = await openai.createCompletion(
      {
        model: "text-davinci-003",
        prompt: `write an nice article about ${startup_name} startup  using these keywords ${keywords.join(',')}Experience and use proper **headings** and **sub-headings**.`,
        max_tokens: 1024,
        n: 1,
        temperature: 0.5
      }

    )
    response = result.data.choices[0].text
  }

  res.status(200).json({
    result: response
  })
}

//get all articles
exports.all_articles = (req, res) => {
  let articles = [];
  Articles.findAll({
    include: [{
      model: startups,
      as: 'startup'
    }], where: { isdeleted: false }
  }).then(data => {
    let jsonArticles = {

    }

    res.status(200).send({
      success: true,
      message: "Found all Articles",
      data: data
    });

  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Articles."
      });
    });
}
//get articles by tagname
exports.articles_by_tagname = (req, res) => {
  const tagname = req.params.id;
  Articles.findAll({ where: { tags: tagname } }).then(data => {
    res.status(200).send({
      success: true,
      message: "Article find with tag name :" + tagname,
      data: data
    });
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Articles by tagname."
      });
    });
}

//delete articles by articles id
//get all articles
exports.delete_articles = (req, res) => {
  const id = req.params.id;
  Articles.update({ isdeleted: true },
    {
      where: { id: id }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Articles was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Articles with id=${id}. Maybe Articles was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Articles with id=" + id
      });
    });
};


//insert articles
let i = 1;

const myArray = new Array();
exports.insert_articles = async (req, res) => {
  const jsonObj = JSON.parse(req.body.articleInputDto);
  console.log("FILE", jsonObj)

  const encryptedString = cryptr.encrypt(req.file.destination);
  const decryptedString = cryptr.decrypt(encryptedString);
  await sequelize.query("INSERT INTO r_articles_file_entities (extension,filename,filename_on_disk,size) VALUES ('" + req.file.mimetype.slice(6) + "','" + req.file.filename + "','" + encryptedString + "','" + req.file.size + "') RETURNING id").then(data => {
    myArray['file_id'] = data[0][0].id;
  });
  const file_articles_img = {
    extension: req.file.mimetype.slice(6),
    filename: req.file.filename,
    filename_on_disk: encryptedString,
    size: req.file.size,
    user_id: jsonObj.startupId
  };
  file_entitie.create(file_articles_img);
  const errors = validationResult(jsonObj);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // const image = req.file.path.slice(25);;;
  // res.send(req.body);
  const article = {
    body: jsonObj.body,
    date: jsonObj.date,
    description: jsonObj.description,
    isdeleted: false,
    articles_link: jsonObj.link,
    title: jsonObj.title,
    file_id: myArray['file_id'],
    start_up_id: jsonObj.startupId,
    imagedata: null,
    image_name: null,
    image_type: null,
    tags: jsonObj.tag,
    area_interest: jsonObj.areaOfInterest,
    restricted: 00
  };
  // console.log("FILE", article)
  Articles.create(article).then(res => {
    res.status(200).send({
      success: true,
      message: "Article Added Successfully.",
      article: article
    });
  }).catch(err => {
    res.status(200).send({
      success: false,
      message: "Article Not Added Successfully.",
      article: err
    });
  });



  // res.send(myArray['file_id']);
}


//Update article areas of interest

exports.updateInterest = (req, res) => {
  const id = req.params.id;

  Articles.update(req.body, {
    where: { id: id }
  }).then(num => {
    if (num == 1) {
      res.send({
        success: true,
        message: "Aera of interest updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot upadte Aera of interest with id=${id}`
      });
    }
  })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Articles interest with id=" + id
      });
    });

};

//Update tags areas of interest

exports.updateTags = (req, res) => {
  const id = req.params.id;

  Articles.update(req.body, {
    where: { id: id }
  }).then(num => {
    if (num == 1) {
      res.send({
        success: true,
        message: "Tags updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update articles tag with id=${id}`
      });
    }
  })
    .catch(err => {
      res.status(500).send({
        message: "Error updating articles tag with id=" + id
      });
    });

};

//updtae articles by articles id

exports.update = async (req, res) => {
  const id = req.params.id;
  const jsonObj = JSON.parse(req.body.articleInputDto);

  const encryptedString = cryptr.encrypt(req.file.filename);
  const decryptedString = cryptr.decrypt(encryptedString);
  await sequelize.query("SELECT * FROM public.rh_articles where rh_articles.id = " + id + " RETURNING file_id").then(data => {
    myArray['old_file_id'] = data[0][0].id;
  });
  await sequelize.query("UPDATE r_articles_file_entities SET extension = '" + req.file.mimetype.slice(6) + "', filename='" + req.file.filename + "',filename_on_disk = '" + encryptedString + "',size ='" + req.file.size + "' WHERE id=" + myArray['old_file_id'] + " RETURNING id").then(data => {
    myArray['file_id'] = data[0][0].id;
  });
  Articles.update(jsonObj, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          success: true,
          message: "Articles was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Articles with id=${id}. Maybe Articles was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Articles with id=" + id
      });
    });
};
// filterArticle
exports.filterArticle = (req, res) => {
  const text = req.body.id;
  // sequelize.query("select * from r_articles where body like '%"+text+"%' OR description like '%"+text+"%'").then(data => {
  //   res.send(data[0]);
  //   // myArray['number']=data;
  // });  
  Articles.findAll(
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
          articles_link: {
            [Op.like]: `%${req.body.articles_link}%`
          }
        },
        {
          createdAt: {
            [Op.data]: req.body.createdAt
          }
        },
        {
          updateAt: {
            [Op.data]: req.body.createdAt
          }
        },

        ]
      }
    }).then(data => {
      if (data[0] == null) {
        res.json({
          success: true,
          message: "Articles not found....",
          data: data
        })
      } else {
        res.json({
          success: true,
          message: "Articles find successfully",
          data: data
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Missions."
      });
    })
};

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );
// Download article image
exports.downloadImage = (req, res) => {
  const id = req.params.id;
  var hostname = req.headers.host
  Articles_file.findOne({ where: { id: id } }).then(data => {
    const decryptedString = cryptr.decrypt(data.filename_on_disk);

    let example_image_1 = download_image('http://localhost:3000/images/image-1678357449993.png', 'example-1.png');

    if (example_image_1.success) {
      res.status(200).send({
        message: "Error updating Articles interest with id="
      });
    }

    // const localPath = './'+data[0].filename;
    // const options = {
    //   // Specify the SSL/TLS version explicitly
    //   // You can try different versions until you find one that works
    //   secureProtocol: 'TLSv1_2_method'
    // };
    // https.get(imageUrl,options, (res) => {
    //   const fileStream = fs.createWriteStream(localPath);
    //   res.pipe(fileStream);

    //   fileStream.on('error', (err) => {
    //     console.error(`Error writing to file: ${err}`);
    //   });

    //   fileStream.on('finish', () => {
    //     console.log(`Image downloaded and saved to ${localPath}`);
    //   });
    // }).on('error', (err) => {
    //   console.error(`Error downloading image: ${err}`);
    // });
  })
}

//get article which has event tags
exports.event_tags = async (req, res) => {
  await sequelize.query("SELECT c.*, p.articles_id,r.filename FROM rh_articles as c INNER JOIN articles_tags as p ON p.articles_id = c.id INNER JOIN r_articles_file_entities as r ON r.id = c.id INNER JOIN tags as s ON p.tags_id = s.id where name = 'Events' ORDER BY p.articles_id, r.filename;").then(data => {
    data[0].forEach(element => {
      if (element.filename != null) {
        element.filename = 'https://' + req.headers.host + '/api/images/' + element.filename;
      }
    });
    res.status(200).send({
      success: true,
      message: "Succesfully find article which has 'Events' tags",
      data: data[0]
    });
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while find article events tags."
      });
    });
}
//Training
exports.training_tags = async (req, res) => {
  await sequelize.query("SELECT c.*, p.articles_id,r.filename FROM rh_articles as c INNER JOIN articles_tags as p ON p.articles_id = c.id INNER JOIN r_articles_file_entities as r ON r.id = c.id INNER JOIN tags as s ON p.tags_id = s.id where name = 'Training' ORDER BY p.articles_id, r.filename;").then(data => {
    data[0].forEach(element => {
      if (element.filename != null) {
        element.filename = 'https://' + req.headers.host + '/api/images/' + element.filename;
      }
    });
    res.status(200).send({
      success: true,
      message: "Succesfully find article which has 'Training' tags",
      data: data[0]
    });
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while find article Training tags."
      });
    });
}


