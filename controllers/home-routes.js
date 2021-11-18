const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    console.log(req.session);
    //.handlebars extension is implied
    //handlebars will feed the content from homepage to the main.handlebars template
    //a second argument, an object, which includes all of the data you want to pass to your template
        Post.findAll({
          attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
          ],
          include: [
            {
              model: Comment,
              attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
        })
          .then(dbPostData => {
            const posts = dbPostData.map(post => post.get({ plain: true }));
            // pass a single post object into the homepage template
            res.render('homepage', { posts });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      });

      //renders login
      router.get('/login', (req, res) => {
        if (req.session.loggedIn) {
          res.redirect('/');
          return;
        }
      
        res.render('login');
      });

      //render single post
      router.get('/post/:id', (req, res) => {
        Post.findOne({
          where: {
            id: req.params.id
          },
          attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
          ],
          include: [
            {
              model: Comment,
              attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
        })
          .then(dbPostData => {
            if (!dbPostData) {
              res.status(404).json({ message: 'No post found with this id' });
              return;
            }
      
            // serialize the data
            const post = dbPostData.get({ plain: true });
      
            // pass data to template
            res.render('single-post', { post });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      });
module.exports = router;