const {
  EmailValidator,
  passwordMatcher,
  PasswordValidator,
  Authcontroller,
} = require("./controllers/Auth.controller");
var app = require("./app");

//import { expect } from "@jest/globals";
//const  superest = require("supertest");
const router = require("./routes/auth.routes");

const request = require("supertest");

describe("Validation tests", () => {
  test("should check for email is valid or not", () => {
    expect(EmailValidator("abc@xyz.in")).toBe(true);
  });

  test("should check for password is valid or not ", () => {
    expect(PasswordValidator("Abcxyz123@")).toBe(true);
  });

  test("should check for passwords are same", () => {
    expect(passwordMatcher("Abcxyz123@", "Abcxyz123@")).toBe(true);
  });
});

describe("/auth/login POST ", () => {
  describe("when email & password is missing", () => {
    // test('shoudl response with status code 200', async()=>{
    //     const response= await request(app).post('/auth/login').send({
    //         email: 'abc@xyz.com',
    //         password: 'Abcxyz123@'
    //     })

    //     expect(response.statusCode).toBe(200);
    // })

    //var Authcontroller=require('./controllers/Auth.controller');

  });


    


  
});


