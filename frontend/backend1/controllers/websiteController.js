
const { Website } = require('../models');
const { Op } = require('sequelize');

exports.getWebsites = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const { rows, count } = await Website.findAndCountAll({
      where: {
        isActive: true,
        ...(search && { name: { [Op.iLike]: `%${search}%` } })
      },
      limit: Number(limit),
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });

    res.json({ 
      success: true,
      data: {
        data: rows,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWebsiteById = async (req, res) => {
  const website = await Website.findByPk(req.params.id);
  if (!website) {
    return res.status(404).json({ message: 'Website not found' });
  }
  res.json(website);
};

exports.createWebsite = async (req, res) => {
  try {
    const website = await Website.create(req.body);
    res.status(201).json(website);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateWebsite = async (req, res) => {
  try {
    const website = await Website.findByPk(req.params.id);
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }
    await website.update(req.body);
    res.json(website);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteWebsite = async (req, res) => {
  const website = await Website.findByPk(req.params.id);
  if (!website) {
    return res.status(404).json({ message: 'Website not found' });
  }
  await Website.update(
    { isActive: false },
    { where: { id: req.params.id } }
  );
  res.json({ message: 'Website deactivated' });
};
