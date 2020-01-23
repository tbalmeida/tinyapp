const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const getUserID = function (email) {
  for (const user of Object.values(users)) {
    if (user.email === email) {
      return user;
    }
  }
  return;
}


users["vava"] = {id: "vava", email: "meuemail@gmail.com", password: " 1234"};

console.log("Dados do 2nd", users["user2RandomID"].email)
//console.log(users)