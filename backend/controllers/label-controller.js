const service = require('../services/label-service');

exports.readLabel = async (req, res, next) => {
  try {
    const { status, message, labelList } = await service.labelService(req);
    res.status(status).json({ message, labels: labelList });
  } catch(err) {
    next(err);
  }
};
