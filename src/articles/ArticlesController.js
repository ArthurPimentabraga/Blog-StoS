const express = require('express');
const router = express.Router();
const ArticleModel = require('./ArticleModel');
const CategoryModel = require('../categories/CategoryModel');
const slugify = require('slugify');

router.get("/admin/articles", (req, res) => {
    ArticleModel.findAll({
        order: [['id', 'DESC']],
        include: [{ model: CategoryModel }],
    }).then(articles => {
        res.render('admin/articles/showArticles', {articles: articles})
    })
});

router.get("/admin/articles/create", (req, res) => {
    CategoryModel.findAll().then(categories => {
        res.render('admin/articles/createArticle', {categories: categories})
    })
});

router.post("/admin/articles/save", (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    ArticleModel.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect('/admin/articles');
    });
});

router.post("/admin/articles/delete", (req, res) => {
    let id = req.body.id;

    if (id != undefined) {
        if (!isNaN(id)) {
            ArticleModel.destroy({
                where: { id: id }
            }).then(() => {
                res.redirect("/admin/articles");
            })
        }
        else{
            res.redirect("/admin/articles");
        }
    }
    else{
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id", (req, res) => {
    let id = req.params.id;

    if (isNaN(id)) {
        res.redirect('/admin/articles');
    }

    ArticleModel.findByPk(id,{
        include: [{model: CategoryModel}]
    }).then(article => {
        if (id != undefined) {
            CategoryModel.findAll().then(categories => {
                res.render('admin/articles/updateArticle', {article: article, categories: categories})
            })
        }
        else{
            res.redirect('/admin/articles');
        }
    }).catch(erro => {
        res.redirect('/admin/articles');
    })
});

router.post("/admin/articles/update", (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    ArticleModel.update({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }, {where: {id: id}
    }).then(() => {
        res.redirect('/admin/articles');
    })
});

module.exports = router;