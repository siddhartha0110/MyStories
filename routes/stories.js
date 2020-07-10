const express = require('express')
const router = express.Router();
const { checkAuth } = require('../middleware/auth')
const Story = require('../models/Story');

//@desc ADD STORY PAGE
//@route GET /stories/add
router.get('/add', checkAuth, (req, res) => {
    res.render('stories/add')
})

//@desc ADD STORY 
//@route POST /stories
router.post('/', checkAuth, async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.render('error/500');
    }
})

//@desc Show all  Stories
//@route GET /stories
router.get('/', checkAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' }).populate('user')
            .sort({ createdAt: 'desc' }).lean()

        res.render('stories/index', { stories });
    } catch (error) {
        console.error(error);
        res.render('error/500');
    }
})

//@desc Show Single  Stories
//@route GET /stories/:id
router.get('/:id', checkAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).populate('user').lean();
        if (!story) {
            return res.render('error/404');
        }
        res.render('stories/show', { story });
    } catch (error) {
        console.error(error);
        res.render('error/404');
    }
})


//@desc Edit STORY 
//@route GET /stories/edit/:storyId
router.get('/edit/:id', checkAuth, async (req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()

        if (!story) {
            return res.render('error/404');
        }
        if (story.user != req.user.id) {
            res.redirect('/stories');
        }
        else {
            res.render('stories/edit', { story });
        }
    } catch (error) {
        console.error(error);
        return res.render('error/500');
    }

})

//@desc Update Story
//@route PUT /stories/:storyId
router.put('/:id', checkAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id);

        if (!story) {
            return res.render('error/404');
        }
        if (story.user != req.user.id) {
            res.redirect('/stories');
        }
        else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            })
            res.redirect('/dashboard')
        }

    } catch (error) {
        console.error(error);
        return res.render('error/500');
    }

})

//@desc Delete Story
//@route DELETE /stories/:id
router.delete('/:id', checkAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean()

        if (!story) {
            return res.render('error/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            await Story.remove({ _id: req.params.id })
            req.flash('success', 'Successfully Deleted');
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

//@desc Get User Details
//@route GET /stories/user/:userId
router.get('/user/:userId', checkAuth, async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        }).populate('user').lean()

        res.render('stories/index', { stories });

    } catch (error) {
        console.error(error);
        res.render('error/404');
    }
})



module.exports = router;