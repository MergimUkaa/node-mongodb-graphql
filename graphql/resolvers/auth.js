const bcrypt = require('bcrypt');

const User = require('../../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
    createUser: async (args,req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error('User exists already.');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });

            const result = await user.save();

            return { ...result._doc, password: null, _id: result.id };
        } catch (err) {
            throw err;
        }
    },
    users: async ()=> {
        try {
            const users = await User.find();
            return users.map(user => {
                return {...user._doc, _id: user.id, email: user.email, password: null}
            })
        } catch (e) {
           throw e;
        }
    },
    login: async ({email,password}) => {
        const user = await User.findOne({email: email});
        if (!user) {
            throw new  Error('User does not exist.');
        }
        const isEqual = await bcrypt.compare(password,user.password);
        if (!isEqual){
            throw new Error('Password is incorrect!');
        }

        const token = jwt.sign({userId: user.id, email:user.email},'somesupersecretkey',{expiresIn: '1h'});
        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        }
    }
};