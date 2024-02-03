const router = require('express').Router();
const {BlogPost, Comment, User} = require('../../models');

// {
// 	"title": "first post",
// 	"body": "bloggin in style"
// }

router.get('/', async (req, res)=> {
    try{
        const posts = await BlogPost.findAll({
            include: {
                model: User,
                attributes: ['username'],
            },
            attributes: { exclude: ['user_id'] },
        });
        res.status(200).json(posts);
    }catch(err) {
        console.log(err);
        res.status(500).json({ message: `Internal server error: ${err}` });
    }
});

router.post('/', async (req, res)=> {
    try{

        const userId = req.session.userId;

        if(!userId) {
            return res.status(400).json({ message: `Please login` })
        }

        const title = req.body.title;
        const body = req.body.body;
        const newPost = await BlogPost.create({
            title, 
            body,
            user_id: userId,
        });

        res.status(200).json(newPost);
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: `Internal server error: ${err}` });
    }
});

router.get('/:blogpost_id', async (req, res) => {
    try{
        const post = await BlogPost.findByPk(req.params.blogpost_id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
                {
                    model: Comment,
                    attributes: ['content'],
                    include: [
                        {
                            model: User,
                            attributes: ['username'],
                        },
                    ],
                },
            ],
        });

        if (!post) {
            res.status(400).json({ message:`No blog post found with id: ${req.params.blogpost_id}\n ${err}` });
        }

        res.status(200).json(post);
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: `Internal server error: ${err}` });
    } 
});

router.post('/:blogpost_id/comments', (req, res) => {
    try {

        // console.log(`req.session`, req.session);
        if (!req.session.loggedIn) {
            res.status(400).json({ message: `Please login/signup to comment` });
            return
        }

        const newComment = Comment.create({
            content: req.body.content,
            user_id: req.session.userId,
            blogpost_id: req.params.blogpost_id,
        });
        res.status(200).json(newComment)
    }catch(err) {
        console.log(err);
        res.status(500).json({  message: `Internal server error: ${err}` });
    }
});

router.put('/:blogpost_id', async (req, res) => {
    try{

        if (!req.session.loggedIn) {
            res.status(400).json({ message: `Please login to edit blog posts` });
            return
        }

        const postData = await BlogPost.findByPk(req.params.blogpost_id);

        if (!postData || postData.user_id !== req.session.userId){
            res.status(400).json({ message: `You may not edit this post!` });
            return
        };


        const updatedBlog = await BlogPost.update(
           {
                title: req.body.title,
                body: req.body.body,
           },
           {
                where:{
                    id: req.params.blogpost_id,
                },
           },
        );
        res.status(200).json(updatedBlog)
    }catch(err) {
        console.log(err);
        res.status(500).json(`Internal server error: ${err}`);
    }
});


module.exports = router;