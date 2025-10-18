const Concert = require('../models/concertModels');

const checkDuplicateConcertName = async (name, idToExclude) => {
  if (!name) return null;
  const existing = await Concert.findOne({ name, _id: { $ne: idToExclude } });
  if (existing) {
    return { name: { message: 'Concert name already exists' } };
  }
  return null;
};

module.exports = { checkDuplicateConcertName };
