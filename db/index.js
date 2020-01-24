// data and related functions used on TinyURL

// used to save passwords
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
  },
  "user1": {
    id: "user1", 
    email: "user1@gmail.com", 
    password: "123"
  }
}

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", user_id: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", user_id: "user2RandomID" },
  hahaha: { longURL: "https://www.msn.ca", user_id: "uid200" }

};


module.exports = 
  { urlDatabase, 
    users
  }