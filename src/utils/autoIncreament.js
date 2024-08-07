import mongoose from 'mongoose';

const sequenceSchema = new mongoose.Schema({
    name: String,
    value: Number
});

const Sequence = mongoose.model('Sequence', sequenceSchema);

async function getNextSequenceValue(sequenceName) {
    const sequence = await Sequence.findOneAndUpdate(
        { name: sequenceName },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
    );
    return sequence.value;
}

export function addAutoIncrementId(schema, modelName) {
    schema.add({
        _id: { type: Number, default: 1 }
    });

    schema.pre('save', async function(next) {
        if (this.isNew) {
            this._id = await getNextSequenceValue(`${modelName}Id`);
        }
        next();
    });
}