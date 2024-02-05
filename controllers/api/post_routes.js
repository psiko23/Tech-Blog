const router = require('express').Router();
const {BlogPost, Comment, User} = require('../../models');
const withAuth = require('../../utils/auth')

// {
// 	"title": "first post",
// 	"body": "bloggin in style"
// }

router.get('/', withAuth, async(req, res)=> {
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

router.post('/', withAuth, async (req, res)=> {
    try{

        const title = req.body.title;
        const body = req.body.body;
        const newPost = await BlogPost.create({
            title, 
            body,
            user_id: user_id,
        });

        res.status(200).json(newPost);
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: `Internal server error: ${err}` });
    }
});

router.get('/:blogpost_id', withAuth, async (req, res) => {
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

router.post('/:blogpost_id/comments', withAuth, async (req, res) => {
    try {

        const newComment = await Comment.create({
            content: req.body.content,
            user_id: req.session.user_id,
            blogpost_id: req.params.blogpost_id,
        });
        res.status(200).json(newComment)
    }catch(err) {
        console.log(err);
        res.status(500).json({  message: `Internal server error: ${err}` });
    }
});

router.put('/:blogpost_id', withAuth, async (req, res) => {
    try{

        const postData = await BlogPost.findByPk(req.params.blogpost_id);

        if (!postData || postData.user_id !== req.session.user_id){
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