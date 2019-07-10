const Event = require('../../models/event');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const user = userId => {
    return User.findById(userId).then(user => {
        return {...user._doc, _id: user.id, createdEvents: events.bind(this, user.createdEvents)}
    }).catch(err => {
        throw err;
    })
};

const events = eventIds => {
    return Event.find({_id: {$in: eventIds}}).then(events => {
        return events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                creator: user.bind(this, event.creator),
                date: new Date(event.date)
            }
        })
    }).catch(err => {
        throw err;
    });
};

module.exports = {
    events: () => {
        return Event.find()
            .then(events => {
                return events.map(event => {
                    return {
                        ...event._doc,
                        _id: event.id,
                        creator: user.bind(this,event._doc.creator),
                        date: new Date(event._doc.date).toISOString()
                    };
                });
            })
            .catch(err => {
                throw err;
            });
    },
        users: ()=> {
    return User.find().populate('createdEvents').then(users => {
        return users.map(user => {
            return {...user._doc, _id: user.id, createdEvents: events.bind(this,user._doc.createdEvents)};
        })
    }).catch(err => {
        throw  err;
    });
},
    createEvent: args => {
    const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '5d206fa12621577a84e8ae8a'
    });
    let createdEvent;
    return event.save()
        .then(result => {
            createdEvent = { ...result._doc, _id: result._doc._id.toString() };
            return User.findById('5d206fa12621577a84e8ae8a');
        }).then(user => {
            if (!user){
                throw new Error("User not found");
            }
            user.createdEvents.push(event);
            return user.save();
        }).then(result => {
            return createdEvent;
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
},
    createUser: args => {
    return User.findOne({email: args.userInput.email}).then(user => {
        if (user){
            throw new Error('User already exist in system!');
        }
        return bcrypt.hash(args.userInput.password, 12);
    }).then(hashedPassword => {
        const user = new User({
            email: args.userInput.email,
            password: hashedPassword
        });
        return user.save();
    }).then(result => {
        return {...result._doc, password: null, _id: result.id}
    }).catch(err => {
        throw err;
    })
}
}