const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const documentSchema = mongoose.Schema({
    filename:{
        type:String,
        required:[true, "please provide  a name"]
    },
    status: {
        type: String,
        default: 'Draft'
    },
    
    purpose: {
        type: String,
        required:[true, "please provide  a name"]
    },
    schoolName: {
        type:String,
        required:[true, "please provide  a school name"]
    },
    course: {
        type : String,
        required:[true, "please provide  a course"]
    },
    major:{
        type:String
    },
    lastAttended :{
        type: String,
        required: [true, 'Please provide a date']
    },
    copies : {
        type: String,
        default:'1'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    trackingNumber: {
        type: Number,
        default: 0
      },
      files: [{ 
        originalName: String,
        mimeType: String,
        size: Number,
        filePath: String
    }],
    statusHistory: [{
        status: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]

},
{
    timestamps:true
}
)

documentSchema.plugin(AutoIncrement, { inc_field: 'trackingNumber' });

module.exports = mongoose.model("Document",documentSchema)