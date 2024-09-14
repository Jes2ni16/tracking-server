const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    student_id:{
        type: String,
        required:[true, "please provide an Id Number"]
    },
    first_name:{
        type:String,
        required:[true, "please provide  a first name"]
    },
    middle_name:{
        type:String,
        required:[true, "please provide  a middle name"]
    },
    last_name:{
        type:String,
        required:[true, "please provide  a last name"]
    },
    birth_date: {
        type: Date, // Define the field type as Date
        required: [true, 'Please provide a birth date']
    },
    birth_place: {
        type: String,
        required: [true, 'Please provide a birth place']
    },
    sex: {
        type: String,
        required: [true, 'Please provide a sex']
    },
    civil_status: {
        type: String,
        required: [true, 'please provide civil status']
    },
    citizenship: {
        type: String,
        required: [true, 'please provide citizenship']
    },
    religion: {
        type: String,
        required: [true, 'please provide religion']
    },
    address: {
        type: String,
        required: [true, 'please provide address']
    },
    contact: {
        type: String,
        required: [true, 'please provide contact number']
    },
    email:{
        type:String,
        required:[true, "please provide  a name"]
    },
    password:{
        type:String,
        required:[true, "please provide  a name"]
    },
    role: {
        type:String,
        default: 'student' 
    }
},
{
    timestamps:true
}
)

module.exports = mongoose.model("User",userSchema)