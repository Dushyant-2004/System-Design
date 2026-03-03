const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Design = require('../models/Design');
const { generateSystemDesign } = require('../services/groqService');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      status: 'fail',
      message: 'Validation error',
      details: errors.array().map((e) => e.msg),
    });
  }
  next();
};

// POST /api/designs - Generate a new system design
router.post(
  '/',
  [
    body('prompt')
      .trim()
      .notEmpty()
      .withMessage('Design prompt is required')
      .isLength({ min: 5, max: 1000 })
      .withMessage('Prompt must be between 5 and 1000 characters'),
    body('title')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { prompt, title } = req.body;

      const designTitle =
        title || prompt.length > 100 ? prompt.substring(0, 100) + '...' : prompt;

      // Create initial record
      const design = await Design.create({
        title: designTitle,
        prompt,
        status: 'generating',
        structuredAIResponse: {
          microservices: [],
          databaseSchema: [],
          apiEndpoints: [],
          cachingStrategy: { approach: '', tools: [], layers: [] },
          loadBalancing: { approach: '', algorithm: '', tools: [], details: '' },
          scalingStrategy: {
            horizontal: { description: '', services: [], autoScalingRules: [] },
            vertical: { description: '', services: [] },
          },
          infrastructure: { cloudProvider: '', services: [], regions: [], estimatedCost: '' },
          systemFlow: { description: '', steps: [] },
        },
      });

      // Generate AI response
      const { data, generationTimeMs } = await generateSystemDesign(prompt);

      // Update with actual response
      design.structuredAIResponse = data;
      design.status = 'completed';
      design.generationTimeMs = generationTimeMs;
      await design.save();

      res.status(201).json({
        success: true,
        data: design,
        meta: { generationTimeMs },
      });
    } catch (error) {
      // If we created a design record, mark it as failed
      next(error);
    }
  }
);

// GET /api/designs - List all designs
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
    query('search').optional().trim(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;
      const search = req.query.search;

      let filter = {};
      if (search) {
        filter = { $text: { $search: search } };
      }

      const [designs, total] = await Promise.all([
        Design.find(filter)
          .select('title prompt status createdAt generationTimeMs')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Design.countDocuments(filter),
      ]);

      res.json({
        success: true,
        data: designs,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/designs/:id - Get a single design
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid design ID format')],
  validate,
  async (req, res, next) => {
    try {
      const design = await Design.findById(req.params.id).lean();

      if (!design) {
        throw new AppError('Design not found', 404);
      }

      res.json({
        success: true,
        data: design,
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/designs/:id - Delete a design
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid design ID format')],
  validate,
  async (req, res, next) => {
    try {
      const design = await Design.findByIdAndDelete(req.params.id);

      if (!design) {
        throw new AppError('Design not found', 404);
      }

      res.json({
        success: true,
        message: 'Design deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
