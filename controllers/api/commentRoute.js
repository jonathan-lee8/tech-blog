const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.findAll({
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

    res.status(200).json(commentData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.comment('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      user_id: req.session.user_id,
      post_id: req.session.post_id,
      comment_body: req.session.comment_body
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;