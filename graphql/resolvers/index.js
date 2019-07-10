const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const bcrypt = require('bcrypt');


const user = userId => {
    return User.findById(userId).then(user => {
        return {...user._doc, _id: user.id, createdEvents: events.bind(this, user.createdEvents)}
    }).catch(err => {
        throw err;
    })
};

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id: event._id,
            title: event.title,
            description: event.description,
            creator: user.bind(this, event._doc.creator)
        }
    } catch (e) {
        throw e;
    }
};

const events = async eventIds => {
    const events = await Event.find({_id: {$in: eventIds}});
       try {
           return events.map(event => {
               return {
                   ...event._doc,
                   _id: event.id,
                   creator: user.bind(this, event.creator),
                   date: new Date(event.date).toISOString()
               }
           })
       }catch (e) {
           throw  e;
       }

};

module.exports = {
    events: async () => {
        const events = await Event.find();

               try {
                   return events.map(event => {
                       return {
                           ...event._doc,
                           _id: event.id,
                           creator: user.bind(this,event._doc.creator),
                           date: new Date(event._doc.date).toISOString()
                       };
                   });
               } catch (e) {
                   throw  e;
               }

    },
        users: async () => {
    const users = await User.find();
        try {
            return users.map(user => {
                return {...user._doc, _id: user.id, createdEvents: events.bind(this,user._doc.createdEvents)};
            })
        } catch (e) {
            throw e;
        }

},
    bookings: async () => {
       try {
           const bookings = await Booking.find();
           return bookings.map(booking => {
               return {
                   ...booking._doc,
                   id: booking._id,
                   user: user.bind(this, booking._doc.user),
                   event: singleEvent.bind(this, booking._doc.event),
                   createdAt: new Date(booking.createdAt).toISOString(),
                   updatedAt: new Date(booking.updatedAt).toISOString()
               }
           })
       } catch (e) {
           throw e;
       }
    },
    createEvent: async args => {
    const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '5d206fa12621577a84e8ae8a'
    });
    let createdEvent;
     try {
         const result = await event.save();

         createdEvent = { ...result._doc, _id: result._doc._id.toString() };
         const user = await User.findById('5d206fa12621577a84e8ae8a');
         if (!user){
             throw new Error("User not found");
         }
         user.createdEvents.push(event);
         await user.save();
         return createdEvent;
     } catch (e) {
         throw e;
     }
},
    createUser: async args => {
    try {
        const existingUser = await User.findOne({email: args.userInput.email});
        if (existingUser){
            throw new Error('User already exist in system!');
        }
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

        const user = new User({
            email: args.userInput.email,
            password: hashedPassword
        });
        const result = await user.save();
        return {...result._doc, password: null, _id: result.id}
    } catch (e) {
        throw e;
    }
},
    bookEvent: async args => {
        try {
            const fetchedEvent = await Event.findById({_id: args.eventId});
            const booking = new Booking({
                user: '5d2098a10ca81d8313540017',
                event: fetchedEvent
            });
            const result =  await booking.save();
            return {
                ...result._doc,
                _id: result.id,
                event: singleEvent.bind(this, booking._doc.event),
                createdAt: new Date(booking.createdAt).toISOString(),
                updatedAt: new Date(booking.updatedAt).toISOString()
            }
        } catch (e) {
            throw  e;
        }
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = {
                ...booking.event._doc,
                _id: booking.event.id,
                creator: user.bind(this, booking.event._doc.creator)
            };
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch (err) {
            throw err;
        }
    }
    };
