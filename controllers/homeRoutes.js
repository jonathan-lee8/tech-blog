const router = require('express').Router();
const { post } = require('.');
const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
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
        },
      ],
    });

    const posts = postData.map ((post) => post.get({ plain: true }));

    res.render('homepage', {
      posts,
      logged_in: req.session.logged_in,
      username: req.session.username
    });
  } catch (err) {
    res.status(500).json(err)
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
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
        }
      ],
    });
      const post = postData.get({ plain: true });

      res.render('post', {
        ...post,
        logged_in: req.session.logged_in,
        username: req.session.username
      });
  }   catch (err) {
    res.status(500).json(err); 
  }
});

router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;