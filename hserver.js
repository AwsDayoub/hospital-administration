// // var http = require('http');
// // var server = http.createServer(function(req, res) {
// //     res.writeHead(200, {'Content-Type': 'text/plain'});
// //     var message = 'It works!\n',
// //         version = 'NodeJS ' + process.versions.node + '\n',
// //         response = [message, version].join('\n');
// //     res.end(response);
// // });

const multer = require ('multer');
const express = require ('express');
const joi = require ('joi');
const path = require ('path');
const request = require ('request');
const bodyparser = require ('body-parser');
const mysql = require ('mysql');
const cors = require ('cors');
const faker = require ('faker');
const Seeder = require ('mysql-db-seed').Seeder;
app = express ();
app.use (bodyparser.urlencoded ({extended: true}));
app.use (express.json ());
app.use (express.static (__dirname));
app.use (cors ());

const port = 3000;

// sql Connection

var con = mysql.createConnection ({
  host: 'localhost',
  user: 'timeengc_hospital',
  password: 'hospital123',
  database: 'timeengc_hospital',
  timezone: 'uct+02:00',
  multipleStatements: true,
});

const seed = new Seeder (
  10,
  'localhost',
  'timeengc_hospital',
  'hospital123',
  'timeengc_hospital'
);

// (async () => {
//     await seed.seed(
//         10,
//         "Patient",
//         {
//             patient_id:faker.random.number,
//             FN:  faker.name.firstName,
//             LN:  faker.name.lastName,
//             cardID: faker.random.number,
//             entryTimes: seed.nativeTimestamp(),
//             insuranceCard: faker.random.number,
//             address:faker.name.firstName,
//         }
//     )
//     seed.exit();
//     process.exit();
// })();

con.connect (err => {
  app.get ('/hospital3', (request, response) => {
    response.json ('welcome to our HospitalApp!');
  });

  app.get ('/hospital3/doc', function (req, res) {
    res.sendFile (path.join (__dirname + '/doc/index.html'));
  });
  app.get ('/hospital3/maincss', (req, res) => {
    res.sendFile (__dirname + '/doc/assets/main.css');
  });
  app.get ('/hospital3/prismcss', (req, res) => {
    res.sendFile (__dirname + '/doc/assets/prism.css');
  });

  app.get ('/hospital3/bootmincss', (req, res) => {
    res.sendFile (__dirname + '/doc/assets/bootstrap.min.css');
  });

  app.get ('/hospital3/bundlejs', (req, res) => {
    res.sendFile (__dirname + '/doc/assets/main.bundle.js');
  });
  app.get ('/hospital3/photofavicon16', (req, res) => {
    res.sendFile (__dirname + '/doc/assets/favicon-16x16.png');
  });
  app.get ('/hospital3/photofavicon32', (req, res) => {
    res.sendFile (__dirname + '/doc/assets/favicon-16x16.png');
  });
  app.get ('/hospital3/applephoto', (req, res) => {
    res.sendFile (__dirname + '/doc/assets/apple-touch-icon.png');
  });

  app.get ('/hospital3/managers', (req, res, next) => {
    let sql =
      'SELECT m.first_name,m.last_name,m.gender,m.birth_date,m.card_id,m.job_title,m.starting_date,m.salary,m.address,m.email,m.password,m.starting_time,m.finishing_time,managers.first_name,managers.last_name,name FROM managers m join managers using(manager_id) join manager_department using(manager_id) join departments using(department_id)';
    con.query (sql, (err, result) => {
      if (err) {
        res.status (500).json ({err});
      } else {
        res.status (200).json (result);
      }
    });
  });

  //retrive my boss maanger
  app.get ('/hospital3/mymanager/:id', (req, res, next) => {
    var id = req.params.id;
    let sql = 'SELECT * FROM managers where mgr_id=?';
    con.query (sql, [id], (err, result) => {
      if (err) {
        res.status (500).json ({err});
      } else {
        res.status (200).json (result);
      }
    });
  });

  // add new doctors
  app.post ('/hospital3/doctor/store', (req, res, next) => {
    let workTime = req.body.workTime;
    let startingWorkTime = '';
    let finishingWorkTime = '';
    if (workTime === 'morning') {
      let startingWorkTime = '9:00 am';
      let finishingWorkTime = '9:00 pm';
    } else {
      let startingWorkTime = '9:00 pm';
      let finishingWorkTime = '9:00 am';
    }
    let {firstNname} = req.body;
    let {lastName} = req.body;
    let {gender} = req.body;
    let {birthDate} = req.body;
    let {cardId} = req.body;
    let {starting_date} = req.body;
    let {certificate} = req.body;
    let {specialize} = req.body;
    let {salary} = req.body;
    let {roomId} = req.body;
    let sql =
      'INSERT INTO doctors (first_name, last_name, gender, birth_date, card_id, specialize, salary, starting_date, starting_time, finishing_time, room_id) VALUES ?';
    var values = [
      [
        firstNname,
        lastName,
        gender,
        birthDate,
        cardId,
        specialize,
        salary,
        starting_date,
        startingWorkTime,
        finishingWorkTime,
        roomId,
      ],
    ];
    con.query (sql, [values], (err, result) => {
      if (err) {
        res.status (500).json ({err});
      } else {
        res.status (200).json ({
          status: 'true',
          message: 'doctor added successfully'
        });
      }
    });
  });
  // select all doctors (t)
  app.get ('/hospital3/doctors', (req, res, next) => {
    let sql = 'SELECT * FROM doctors';
    con.query (sql, (err, result) => {
      if (err) {
        res.status (500).json ({err});
      } else {
        res.status (200).json (result);
      }
    });
  });

  // select all patients (t)

  app.get ('/hospital3/patients', (req, res, next) => {
    let sql =
      'SELECT patient_id, first_name ,last_name ,card_id ,insurance_card ,address ,phone ,exit_date from patients JOIN dates USING (patient_id) ';
    con.query (sql, (err, result) => {
      if (err) {
        res.status (500).json ({status: 'false', message: err});
      } else {
        res.status (200).json ({status: 'true', data: result});
      }
    });
  });

  // select all rooms(t)
  app.get ('/hospital3/rooms', (req, res, next) => {
    let sql =
      'SELECT  room_id, d.name, d.floor, beds_number, type, level, cost, (SELECT COUNT(*) FROM dates JOIN rooms USING(room_id) where exit_date is null GROUP BY room_id) AS num_of_patient from rooms JOIN departments d USING (department_id) ';
    con.query (sql, (err, result) => {
      if (err) {
        res.status (500).json ({status: 'false', message: err});
      } else {
        res
          .status (200)
          .json ({status: 'true', message: 'operation success', data: result});
      }
    });
  });
  // add new date
  app.post ('/hospital3/date/store', (req, res) => {
    let {currentDate} = '2020-02-01 09:43:33';
    let {date} = req.body;
    let {emp_id} = req.body;
    let {card_id} = req.body;
    let {room_id} = req.body;
    let {bill_id} = req.body;
    let sql1 = 'SELECT patient_id FROM patients WHERE card_id = ?';
    con.query (sql1, [card_id], (err, result) => {
      if (result === null) {
        res.status (500).json ({
          status: 'false',
          message: 'this patient is new in our system!',
        });
      } else {
        let sql2 = `INSERT INTO dates (current_date, date, employee_id, patient_id, room_id, bill_id) values ?`;
        let values = [currentDate, date, emp_id, 34314, room_id, bill_id];
        con.query (sql2, values, (err, res) => {
          if (err) {
            res.status (500).json ({status: 'false', message: err});
          } else {
            res.status (200).json ({
              status: 'true',
              message: 'date added successfully',
              data: res.id,
            });
          }
        });
      }
    });
  });

  ////////////////adding a patient (t)
  ////////////////////////////////
  app.post ('/hospital3/paients/store', function (req, res) {
    let body = req.body;
    let {firstname} = body;
    let {last_name} = body;
    let {cardId} = body;
    let {insuranceCard} = body;
    let {address} = body;
    let {phone} = body;
    let sql =
      'INSERT INTO patients (first_name ,last_name ,card_id ,insurance_card ,address ,phone) VALUES (?,?,?,?,?,?)';
    let values = [firstname, last_name, cardId, insuranceCard, address, phone];
    con.query (sql, values, function (err, result) {
      if (err) {
        res.status (500).json ({err});
      } else {
        res
          .status (200)
          .json ({status: 'success', massege: 'patient added successfully'});
      }
    });
  });

  // // //sum the costs for a bill of a specific patient

  app.get ('/hospital3/bills/sum/:id', (req, res) => {
    let id = req.params.patient_id;
    let sql =
      'SELECT sum(cost) FROM bills join dates using(bill_id) where patient_id=? and exit_date is null group by patient_id';
    con.query (sql, id, (err, result) => {
      if (err) {
        res.status (500).json ({err});
      } else {
        res.status (200).json (result);
      }
    });
  });

  // // //number of rooms in department (t)

  app.get ('/hospital3/number-of-rooms', (req, res) => {
    let n = req.body.name;
    let sql = 'SELECT * FROM departments where name=?';
    con.query (sql, n, (err, result) => {
      if (err) {
        res.status (500).json ({err});
      } else {
        res.status (200).json (result);
      }
    });
  });

  //returns the number of the rooms in a specefic department that we can have place in it
  ///////////////////////////////////////////////
  ///////////////////////////////////////////////

  app.get ('/hospital3/rooms/empty', (req, res) => {
    let id = req.body.id;
    let sql = `SELECT room_id, num_of_pat, num_of_future_dates
                    FROM rooms 
                    JOIN departments 
                    USING (department_id) 
                    WHERE department_id= ?
                    	  AND ((SELECT COUNT(*) AS num_of_pat
                               FROM dates 
                               JOIN rooms
                               USING(room_id)
                               where exit_date is null
                               GROUP BY room_id
                               HAVING (num_of_pat < beds_number)) 
                                    OR ((SELECT COUNT(*) AS num_of_dates
                                           FROM dates
                                           where exit_date is null
                                           GROUP BY room_id) - (SELECT COUNT(*) AS num_of_future_dates
                                                                   FROM dates
                                                                   JOIN rooms
                                                                   USING (room_id)
                                                                   where (exit_date is null) and (date > CURRENT_DATE())
                                                                   GROUP BY room_id)) < rooms.beds_number )`;
    con.query (sql, id, (err, result) => {
      if (err) {
        res.status (500).json ({err});
      } else {
        res.status (200).json (result);
      }
    });
  });
  // select all appointments for doctor (t)
  app.get ('/hospital3/appointments/:id', (req, res) => {
    let id = req.params.id;
    let sql = `SELECT  CONCAT(first_name," " , last_name) AS "full name", dates.room_id ,dates.date FROM doctors d JOIN operation_doctor od USING (doctor_id) JOIN operations o USING (operation_id) JOIN dates USING (doctor_id) WHERE d.doctor_id = ? and exit_date= null`;
    con.query (sql, id, (err, result) => {
      if (err) {
        res.status (500).json ({err});
      } else {
        res.status (200).json (result);
      }
    });
  });

  //show doctors name by specialize (t)
  app.get ('/hospital3/doctors/specialize', (req, res) => {
    let sp = req.body.specialize;
    let sql = `SELECT doctor_id ,CONCAT(first_name," " , last_name) AS "full name",room_id FROM doctors where specialize=? `;
    con.query (sql, sp, (err, result) => {
      if (err) {
        res.status (500).json ({err});
      } else {
        res.status (200).json (result);
      }
    });
  });

  // get all operations with extra info  (t)

  app.get ('/hospital3/operations', (req, res) => {
    let sql = `SELECT operation_id,title,	finished,comment, d.room_id,date ,CONCAT(p.first_name,p.last_name) AS "patient full name", CONCAT(do.first_name,do.last_name) AS "doctor's full name" FROM operations JOIN dates d USING (date_id) JOIN patients p USING (patient_id )JOIN doctors do USING (doctor_id) `;
    con.query (sql, (err, result) => {
      if (err) {
        res.status (500).json ({err});
      } else {
        res
          .status (200)
          .json ({status: 'true', message: 'operation succes ', data: result});
      }
    });
  });
  // get all consultations with extra info (t)

  app.get ('/hospital3/consultations', (req, res) => {
    let sql = `SELECT consultation_id,title,	finished,comment, d.room_id,date ,CONCAT(p.first_name,p.last_name) AS "patient full name", CONCAT(do.first_name,do.last_name) AS "doctor's full name" FROM consultations LEFT JOIN dates d USING (date_id) JOIN patients p USING (patient_id )JOIN doctors do USING (doctor_id) `;
    con.query (sql, (err, result) => {
      if (err) {
        res.status (500).json ({err});
      } else {
        res
          .status (200)
          .json ({status: 'true', message: 'operation succes ', data: result});
      }
    });
  });

  // login (t)
  app.get ('/hospital3/login', (req, res) => {
    var body = req.body;
    var email = body.email;
    var password = body.password;
    var state = body.state;

    if (state === 'Doctor') {
      var id = 0;
      var fn = '';
      var ln = '';
      var gender = '';
      var birth_date = '';
      var card_id = '';
      var specialize = '';
      var salary = '';
      var starting_date = '';
      var starting_time = '';
      var finishing_time = '';
      var room_id = '';

      con.query (
        'select * from doctors where email=?',
        [email],
        (err, result) => {
          if (!(result.length === 0)) {
            if (password === result[0].password) {
              id = result[0].id;
              fn = result[0].first_name;
              ln = result[0].last_name;
              gender = result[0].gender;
              birth_date = result[0].birth_date;
              card_id = result[0].card_id;
              specialize = result[0].specialize;
              salary = result[0].salary;
              starting_date = result[0].starting_date;
              starting_time = result[0].starting_time;
              finishing_time = result[0].finishing_time;
              room_id = result[0].room_id;
              res.status (200).json ({
                id: id,
                fn: fn,
                ln: ln,
                email: email,
                password: password,
                gender: gender,
                birth_date: birth_date,
                card_id: card_id,
                specialize: specialize,
                salary: salary,
                starting_date: starting_date,
                starting_time: starting_time,
                finishing_time: finishing_time,
                room_id: room_id,
                result: 0,
              });
            } else {
              // 1 for wrong password
              res.status (200).json ({result: 1});
            }
          } else {
            // 2 for wrong email
            res.status (200).json ({result: 2});
          }
        }
      );
    } else if (state === 'Employee') {
      var emp_id = 0;
      var fn = '';
      var ln = '';
      var gender = '';
      var birth_date = '';
      var card_id = '';
      var salary = 0;
      var starting_date = '';
      var starting_work_time = '';
      var finishing_work_time = '';
      var job_title = '';
      var phone = '';

      con.query (
        'select * from employees where email=?',
        [email],
        (err, result) => {
          if (!(result.length === 0)) {
            if (password === result[0].password) {
              emp_id = result[0].emp_id;
              fn = result[0].first_name;
              ln = result[0].last_name;
              gender = result[0].gender;
              birth_date = result[0].birth_date;
              card_id = result[0].card_id;
              salary = result[0].salary;
              starting_date = result[0].starting_date;
              starting_work_time = result[0].starting_work_time;
              finishing_work_time = result[0].finishing_work_time;
              job_title = result[0].job_title;
              phone = result[0].phone;

              res.status (200).json ({
                emp_id: emp_id,
                fn: fn,
                ln: ln,
                email: email,
                password: password,
                gender: gender,
                birth_date: birth_date,
                card_id: card_id,
                salary: salary,
                starting_date: starting_date,
                starting_work_time: starting_work_time,
                finishing_work_time: finishing_work_time,
                job_title: job_title,
                phone: phone,
                result: 0,
              });
            } else {
              // 1 for wrong password
              res.status (200).json ({result: 1});
            }
          } else {
            // 2 for wrong email
            res.status (200).json ({result: 2});
          }
        }
      );
    } else if (state === 'Manager') {
      var mgr_id = 0;
      var fn = '';
      var ln = '';
      var gender = '';
      var birth_date = '';
      var card_id = '';
      var salary = 0;
      var starting_date = '';
      var starting_time = '';
      var finishing_time = '';
      var job_title = '';
      var phone = '';
      var address = '';
      var manager_id = 0;

      con.query (
        'select * from managers where email=?',
        [email],
        (err, result) => {
          if (!(result.length === 0)) {
            if (password === result[0].password) {
              mgr_id = result[0].mgr_id;
              fn = result[0].first_name;
              ln = result[0].last_name;
              gender = result[0].gender;
              birth_date = result[0].birth_date;
              card_id = result[0].card_id;
              salary = result[0].salary;
              starting_date = result[0].starting_date;
              starting_time = result[0].starting_time;
              finishing_time = result[0].finishing_time;
              job_title = result[0].job_title;
              phone = result[0].phone;
              address = result[0].address;
              manager_id = result[0].manager_id;

              res.status (200).json ({
                mgr_id: mgr_id,
                fn: fn,
                ln: ln,
                email: email,
                password: password,
                gender: gender,
                birth_date: birth_date,
                card_id: card_id,
                salary: salary,
                starting_date: starting_date,
                starting_time: starting_time,
                finishing_time: finishing_time,
                job_title: job_title,
                phone: phone,
                address: address,
                manager_id: manager_id,
                result: 0,
              });
            } else {
              // 1 for wrong password
              res.status (200).json ({result: 1});
            }
          } else {
            // 2 for wrong email
            res.status (200).json ({result: 2});
          }
        }
      );
    }
  });

  // add room
  app.post ('/hospital3/room/store', function (req, res) {
    let body = req.body;
    let {type} = body;
    let {level} = body;
    let {cost} = body;
    let {beds_number} = body;
    let {department_id} = body;
    let sql =
      'INSERT INTO rooms (type ,level ,cost ,beds_number ,department_id) VALUES (?,?,?,?,?)';
    let values = [type, level, cost, beds_number, department_id];
    con.query (sql, values, function (err, result) {
      if (err) {
        res.status (500).json ({err});
      } else {
        res
          .status (200)
          .json ({status: 'success', massege: 'room added successfully'});
      }
    });
  });
  // select all departments (t)
  app.get ('/hospital3/departments', (req, res, next) => {
    let sql = 'SELECT * FROM departments';
    con.query (sql, (err, result) => {
      if (err) {
        res.status (500).json ({err});
      } else {
        res.status (200).json (result);
      }
    });
  });
  
////////// get all dates
  app.get ('/hospital3/dates', (req, res) => {
    let sql = `SELECT  dates.date_id ,patient_id ,doctor_id ,dates.date , dates.room_id ,CONCAT(p.first_name ,p.last_name) AS patient ,CONCAT(d.first_name ,d.last_name) AS doctor FROM dates JOIN patients p USING(patient_id) JOIN doctors d USING (doctor_id) WHERE exit_date= null `;
    con.query (sql, (err, result) => {
      if (err) {
        res.status (500).json ({err});
      } else {
        res.status (200).json ({status: "success", data: result});
      }
    });
  });

  // Update Doctor Record (t)
  app.post ('/hospital3/doctors/update/:id', (req, res) => {
    con.query (
      'UPDATE doctors SET ? WHERE doctor_id=?',
      [req.body, req.params.id],
      (err, result) => {
        if (err) {
          res.send ('Server Error');
        } else {
          res.status (200).json (result);
        }
      }
    );
  });

  // Update Manager Record (t)
  app.post ('/hospital3/managers/update/:id', (req, res) => {
    con.query (
      'UPDATE managers SET ? WHERE mgr_id=?',
      [req.body, req.params.id],
      (err, result) => {
        if (err) {
          res.send ('Server Error');
        } else {
          res.status (200).json (result);
        }
      }
    );
  });

  // Update Employee Record (t)
  app.post ('/hospital3/employees/update/:id', (req, res) => {
    con.query (
      'UPDATE employees SET ? WHERE emp_id=?',
      [req.body, req.params.id],
      (err, result) => {
        if (err) {
          res.send ('Server Error');
        } else {
          res.status (200).json (result);
        }
      }
    );
  });
  ////////// get all bills
  app.get ('/hospital3/bills', (req, res) => {
    let sql = `SELECT * FROM bills  `;
    con.query (sql, (err, result) => {
      if (err) {
        res.status (500).json ({err});
      } else {
        res.status (200).json ({status: "success", data: result});
      }
    });
  });
  
  ///get selection bill
    app.get ('/hospital3/bills/:id', (req, res) => {
       let id = req.params.id;
       let sql = `SELECT * FROM bills where bill_id=? `;
    con.query (sql,id, (err, result) => {
      if (err) {
        res.status (500).json ({err});
      } else {
        res.status (200).json ({status: "success", data: result});
      }
    });
  });
  
    ////////// get all employees (t)
  app.get ('/hospital3/employees', (req, res) => {
    let sql = `SELECT * FROM employees  `;
    con.query (sql, (err, result) => {
      if (err) {
        res.status (500).json ({err});
      } else {
        res.status (200).json ({status: "success", data: result});
      }
    });
  });
  
   ////////// get selection employees
  app.get ('/hospital3/employees/:id', (req, res) => {
      let id = req.params.id;
    let sql = `SELECT * FROM employees whrere employee_id=?`;
    con.query (sql,id, (err, result) => {
      if (err) {
        res.status (500).json ({err});
      } else {
        res.status (200).json ({status: "success", data: result});
      }
    });
  });
  
  
  // Update Patient Record (t)
  app.post ('/hospital3/patients/update/:id', (req, res) => {
    con.query (
      'UPDATE patients SET ? WHERE patient_id=?',
      [req.body, req.params.id],
      (err, result) => {
        if (err) {
          res.send ('Server Error');
        } else {
          res.status (200).json (result);
        }
      }
    );
  });
});




app.get('/hospital3/room/:id', (req, res, next) => {
    let sql = "SELECT * FROM rooms where room_id = ?"
    con.query(sql, req.params.id, (err, result) => {
        if (err) {
            res.status(500).json({err});
        }else {
            res.status(200).json({status: "success", data: result});
        }
    });
}); 
app.get('/hospital3/doctor/:id', (req, res, next) => {
    let sql = "SELECT * FROM doctors where doctor_id = ?"
    con.query(sql, req.params.id, (err, result) => {
        if (err) {
            res.status(500).json({err});
        }else {
            res.status(200).json({status: "success", data: result});
        }
    });
}); 
app.get('/hospital3/patient/:id', (req, res, next) => {
    let sql = "SELECT * FROM patient where patient_id = ?"
    con.query(sql, req.params.id, (err, result) => {
        if (err) {
            res.status(500).json({err});
        }else {
            res.status(200).json({status: "success", data: result});
        }
    });
}); 
app.get('/hospital3/operation/:id', (req, res, next) => {
    let sql2 = "SELECT concat(p.first_name ,p.last_name) as patient, dates.date_id, p.patient_id,dates.date ,o.finished ,dates.room_id  FROM operations o JOIN dates USING (date_id) JOIN patients p USING (patient_id) where operation_id = ?";
    let sql1 = "select concat(d.first_name ,d.last_name) as doctor from doctors d join operation_doctor using (doctor_id) where  operation_id = ?"  ;
    con.query(sql1, req.params.id, (err, result1) => {
        if (err) {
            res.status(500).json({err});
        }else {
             con.query(sql2, req.params.id, (err, result2) => {
                if (err) {
                    res.status(500).json({err});
                }else {
                    res.status(200).json({status: "success", data: result2 ,doctors: result1});
                }
            });
        }
    });
}); 
app.get('/hospital3/consultation/:id', (req, res, next) => {
    let sql = "SELECT concat(p.first_name ,p.last_name) as patient, concat(d.first_name ,d.last_name) as doctor, dates.date_id, p.patient_id,dates.date ,c.finished ,dates.room_id  FROM consultations c JOIN dates USING (date_id) JOIN patients p USING (patient_id) join doctors d using (doctor_id) where consultation_id = ?"
    con.query(sql, req.params.id, (err, result) => {
        if (err) {
            res.status(500).json({err});
        }else {
            res.status(200).json({status: "success", data: result});
        }
    });
}); 

app.listen ('3030', function () {
  console.log ('server work on port:3000');
});

// // server.listen();
