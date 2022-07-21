require("dotenv").config();

const Sequelize = require("sequelize");
const { DATABASE_URL } = process.env;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
const clientID = 5;
const userID = 11;

module.exports = {
  getUserInfo: (req, res) => {
    sequelize
      .query(
        `
    SELECT * FROM cc_users cu JOIN cc_clients cc ON cu.user_id = cc.user_id
    WHERE cu.user_id = ${userID};
`
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => console.log(err));
  },
  updateUserInfo : (req , res) => {
    let { firstName, lastName, phoneNumber, email, address, city, state, zipCode}= req.body;
    sequelize
      .query( 
        `UPDATE cc_users set first_name ='${firstName}' ,
        last_name = '${lastName}'
        email = '${email}',
        phone_number = ${phoneNumber}
        wWHERE user_id = ${userID}; 

        UPDATE cc_clients set address= '${address}', 
        city = '${city}',
        state = '${state}',
        zip_code = ${zipCode}
        WHERE client_id = ${clientID};
    
        `)
      .then(() => res.sendStatus(200)

    //   res.status(200).send(dbRes[0])
    ) .catch((err) => console.log(err));

  } , 

getUserAppt : (req , res)=> {
    sequelize.query(`
        select * from cc_appointments 
        WHERE  client_id = ${clientID}
        order by date desc
    `)
    .then(dbRes =>res.status(200).send(dbRes[0]))
    .catch(err => console.log(err))
},
requestAppointment : (req, res) => {
    const {date, service} = req.body;
    sequelize.query(`
    insert into cc_appointments(client_id,date,service_type,notes,approved,completed)
    values(${clientID},'${date}','${service}','picky customer',false,false)
    returning *


    `)
    .then(dbRes =>res.status(200).send(dbRes[0]))
    .catch(err => console.log(err))
}
}        
