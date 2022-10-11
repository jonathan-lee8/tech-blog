const router = require('express').Router();
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');
const { post } = require('./homeRoutes');

router.get('/', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: {
        user_id: req.session.user_id
      },
      attributes: [
            'title',
            'user_id',
            'post_body',
            'created_at'
          ],
          include: [
            {
            model: Comment,
            attributes: ['id', 'user_id', 'post_id', 'comment_body', 'created_at'],
            include: {
              model: User,
              attributes: ['username']
            }
            },
            {
              model: User,
              attributes: ['username']
            }
          ],
});
      const post = postData.map(post => post.get({ plain: true }));
      res.render('dashboard', { post, loggedIn: true, username: req.session.username });
 } catch (err) {
  res.status(400).json(err);
}
});

router.get('/update/:id', withAuth, async (req, res) => {
  try {
  Post.findByPk(req.params.id, {
    attributes: [
      'title',
      'user_id',
      'post_body',
      'created_at'
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'user_id', 'post_id', 'comment_body', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  });
    const update = postData.get({ plain: true });
    res.render('post', {
      ...post,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
