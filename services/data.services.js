// import jsonwebtoken

const { use } = require('express/lib/application')
const jwt= require('jsonwebtoken')

const db = require('./db')

users = {
  1000: { acno: 1000, uname: "Neer", password: "1000", balance: 5000, transaction: [] },
  1001: { acno: 1001, uname: "Laisha", password: "1001", balance: 5000, transaction: [] },
  1002: { acno: 1002, uname: "Vyom", password: "1002", balance: 5000, transaction: [] }

}

//   Register definition

const register = (acno, password, uname) => {
// ASYNCHRONOUS
return  db.User.findOne({acno}).then(user=>{
    console.log(user)
    if(user){
     return{
        statusCode: 401,
        status: false,
        message: "Account already exist.....Please Login!!!"
      }

    }

    else{
      const newUser= new db.User({
        acno,
        uname,
        password,
        balance: 0,
        transaction: []
      })
      newUser.save()
      return {
              statusCode: 200,
              status: true,
              message: "Account Created Successfully!!!"
      }
    }
  })



//   if (acno in users) {
//     return {
//       statusCode: 401,
//       status: false,
//       message: "Account already exist.....Please Login!!!"
//     }

//   }
//   else {
//     users[acno] = {
//       acno,
//       uname,
//       password,
//       balance: 0,
//       transaction: []
//     }
//     //   console.log(db);

//     //   this.saveDetails()
//     return {
//       statusCode: 200,
//       status: true,
//       message: "Account Created Successfully!!!"

//     }
//   }


}

// login definition

const login=(acno, password)=> {

  // asynchronous call
  return db.User.findOne({
    acno,
    password
  }).then(user=>{
    if(user){
      currentAcno=acno
      currentUserName=user.uname

      // token generation
      const token = jwt.sign({
        currentAcc: acno
      }, 'supersecretkey123')

      return{
        statusCode: 200,
        status: true,
        message: "Successfully logged In!!!!",
        currentAcno,
        currentUserName,
        token
      }
      
    }
    return{
      statusCode: 401,
      status: false,
      message: "Invalid Account Number"
    }
  })
}

  // let database = users

  // if (acno in database) {




  //   if (password == database[acno]["password"]) {

  //     currentAcno = acno


  //     currentUserName = database[acno]["uname"]

      // // token generation
      // const token = jwt.sign({
      //   currentAcc: acno
      // }, 'supersecretkey123')

      // this.saveDetails()
//       return {
//         statusCode: 200,
//         status: true,
//         message: "Successfully logged In!!!!",
//         currentAcno,
//         currentUserName,
//         token
//       }

//     }

//     else {
//       // alert("incorrect password")
//       return {
//         statusCode: 401,
//         status: false,
//         message: "incorrect password",
//       }
//     }

//   }
//   else {
//     // alert("Invalid Account Number")
//     return {
//       statusCode: 401,
//       status: false,
//       message: "Invalid Account Number"
//     }
//   }


// }




// deposit definition


const deposit = (acno, password, amt) => {

  var amount = parseInt(amt)

  return db.User.findOne({
    acno,
    password
  }).then(user=>{
    if(user){
      user.balance=user.balance+amount
      user.transaction.push({
        amount: amount,
        type: "CREDIT"
      })
      user.save()
      return{
        statusCode: 200,
        status: true,
        message: amount + "credited.New balance is : " + user.balance
      }
    }
    return {
      statusCode: 401,
      status: false,
      message: "invalid Credentials"
    }

  })
}


  // let db = users

  // if (acno in db) {

    // if (password == db[acno]["password"]) {

    //   db[acno]["balance"] = db[acno]["balance"] + amount
    //   db[acno].transaction.push({
    //     amount: amount,
    //     type: "CREDIT"
    //   })

      // this.saveDetails()

    //   return {
    //     statusCode: 200,
    //     status: true,
    //     message: amount + "credited.New balance is : " + db[acno]["balance"]
    //   }
    // }

  //   else {
  //     // alert("incorrect password")
  //     return {
  //       statusCode: 401,
  //       status: false,
  //       message: "incorrect password"
  //     }
  //   }


  // }
  // else {
  //   // alert("Account Doesnot exist")
  //   return {
  //     statusCode: 401,
  //     status: false,
  //     message: "Account Doesnot exist"
  //   }

  // }

// }

// withdraw definition

const withdraw = (req,acno,password,amt) => {

  var amount = parseInt(amt)

  return db.User.findOne({
    acno,
    password
  }).then(user=>{
    if(req.currentAcc !=acno){
      return {
        statusCode: 401,
        status: false,
        message: "Access denied!!!!"
      }
    }
    if(user){
      if(user.balance>amount){
        user.balance=user.balance-amount
        user.transaction.push({
          amount: amount,
          type: "DEBIT"
        })
        user.save()
        return{
          statusCode: 200,
          status: true,
          message: amount + "debited.New balance is : " + user.balance
        }
      }
      else{
        return{
          statusCode: 401,
          status: false,
          message: "insufficient Balance"
        }
      }
    }
    else{
      return {
        statusCode: 401,
        status: false,
        message: "invalid Credentials"
      }
    }
  })
}


//   let db = users

//   if (acno in db) {

//     if(req.currentAcc !=acno){
//       return {
//         statusCode: 401,
//         status: false,
//         message: "Access denied!!!!"
//       }


//     }

//     if (password == db[acno]["password"]) {


//       if (db[acno]["balance"] > amount) {

        

//         db[acno]["balance"] = db[acno]["balance"] - amount

//         db[acno].transaction.push({
//           amount: amount,
//           type: "DEBIT"
//         })

//         // this.saveDetails()

//         return {
//           statusCode: 200,
//           status: true,
//           message: amount + "debited.New balance is : " + db[acno]["balance"]
//         }

//       }
//       else {
//         // alert("insufficient Balance")
//         return {
//           statusCode: 401,
//           status: false,
//           message: "insufficient Balance"
//         }

//       }

//     }
//     else {
//       // alert("incorrect password")
//       return {
//         statusCode: 401,
//         status: false,
//         message: "incorrect password"
//       }
//     }


//   }
//   else {
//     // alert("Account Doesnot exist")
//     return {
//       statusCode: 401,
//       status: false,
//       message: "Account Doesnot exist"
//     }

//   }

// }


// transaction definition

const getTransaction=(acno)=> {
  // acno=req.currentAcc
  console.log(acno)

  return db.User.findOne({
    acno
  }).then(user=>{
    if(user){
    return {
      statusCode: 200,
      status: true,
      transaction:user.transaction
    }
  }
  else{
    return {
      statusCode: 401,
      status: false,
      message: "Account Doesnot exist"
    }
  }
  })
}

  // if (acno in users){
  //   return {
  //     statusCode: 200,
  //     status: true,
  //     transaction:users[acno].transaction
  //   }

  // }
  // else{
  //   return {
  //     statusCode: 401,
  //     status: false,
  //     message: "Account Doesnot exist"
  //   }

  // }
  
//  }


// deleteAcc

const deleteAcc =(acno)=>{
  return db.User.deleteOne({
    acno
  }).then(user=>{
    if(user){
      return {
        statusCode: 200,
        status: true,
        message:"Account deleted successfully"
      }
    }
    else{
      return {
        statusCode: 401,
        status: false,
        message: "Operation Denied"
      }
    }
  })

}



// export

module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  deleteAcc
}
