const request = require('supertest')
const {app} = require("../src/index.js")
const user = require('../src/models/User');
const {createUser, searchUser,followUser, unfollowUser} = require("../src/services/UserService");

afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve));
});

describe('User Endpoints', () => {

    it('/register should throw error if not unique username', async () => {
        user.findOne = jest.fn().mockImplementation((obj) => {
            if(obj.username=== "Amy123"){
                return {
                    username: "Amy123",
                    email: "amy123@gmail.com"
                }
            }else{
                return null;
            }
        })
        user.create = jest.fn().mockImplementation(()=>{})
        await expect(createUser({username:"Amy123",password:"amy123",email:"amy123@gmail.com"})).rejects.toThrowError()
    })

    it('/register should resolve if valid values', async () => {
        user.findOne = jest.fn().mockImplementation((obj) => {
            if(obj.username=== "Amy123"){
                return {
                    username: "Amy123",
                    email: "amy123@gmail.com"
                }
            }else{
                return null;
            }
        })
        user.create = jest.fn().mockImplementation(obj=>{
            return {...obj}
        })
        await expect(createUser({username:"Amy12",password:"amy12",email:"amy12@gmail.com"})).resolves.not.toThrow()
    })

    it('/search should return unauthorized if no token', async () => {
        const res = await request(app)
            .get('/user/search')
            .send()
        expect(res.statusCode).toEqual(401)
    })

    it('/search should return array of users that username starts with given string', async () => {
        user.find = jest.fn().mockImplementation((username) => {
            let users = [
                {username:"Tom",_id:1},
                {username:"Amy",_id:2},
                {username:"Jeff",_id:3},
                {username:"Jack",_id:4},
            ]
            return users.filter((el)=>el.username.startsWith('J'))
        })
        await expect(searchUser('J')).resolves.toHaveLength(2)
    })

    it('/follow should throw error if already followed', async () => {
        user.findById = jest.fn().mockImplementation((userId) => {
            return {
                username:'Jeff',
                userId,
                followers:[
                    2,3,4
                ]
            }
        })
        user.findOne= jest.fn().mockImplementation((obj) => {
            return {
                username:'Tom',
                _id:2,
            }
        })
        await expect(followUser(1,'Tom')).rejects.toThrow('Already following')
    })

    it('/unfollow should throw error if already not following', async () => {
        user.findById = jest.fn().mockImplementation((userId) => {
            return {
                username:'Jeff',
                userId,
                followers:[
                    3,4
                ]
            }
        })
        user.findOne= jest.fn().mockImplementation((obj) => {
            return {
                username:'Tom',
                _id:2,
            }
        })
        await expect(unfollowUser(1,'Tom')).rejects.toThrow('Not following')
    })
})

