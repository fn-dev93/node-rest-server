import { Schema, model} from 'mongoose';

const RoleSchema = Schema({
    name:{
        type: String,
        required: [true, 'Role name is required']
    }
});

export default model('Role', RoleSchema);