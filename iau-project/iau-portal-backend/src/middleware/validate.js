const { body, validationResult } = require('express-validator');

const rules = [
  body('submissionType').isIn(['Named','Anonymous']),
  body('reporterCategory').notEmpty().isLength({ max: 60 }),
  body('fullName').if(body('submissionType').equals('Named')).notEmpty().isLength({ max: 120 }),
  body('contactEmail').optional({ checkFalsy: true }).isEmail().isLength({ max: 200 }),
  body('category').notEmpty().isLength({ max: 80 }),
  body('dateFrom').notEmpty().isDate().custom(v => { if (new Date(v) > new Date()) throw new Error('dateFrom cannot be future'); return true; }),
  body('dateTo').optional({ checkFalsy: true }).isDate(),
  body('location').notEmpty().isLength({ max: 255 }),
  body('frequency').notEmpty(),
  body('description').notEmpty().isLength({ min: 50 }),
  body('awarenessMethod').notEmpty(),
  body('previouslyReported').isIn(['Yes','No']),
  body('seniorManagement').isIn(['Yes','No','Unsure']),
  body('hasEvidence').isIn(['Yes','No']),
];

function validateComplaint(req, res, next) {
  Promise.all(rules.map(r => r.run(req))).then(() => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false, message: 'Validation failed',
        errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
      });
    }
    next();
  });
}

module.exports = { validateComplaint };
