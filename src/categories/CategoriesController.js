const express = require('express');
const router = express.Router();
const CategoryModel = require('./CategoryModel');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

router.get("/admin/categories", adminAuth , (req, res) => {
    CategoryModel.findAll().then(categories => {
        res.render('admin/categories/showCategories', {categories: categories})
    });
});

router.get("/admin/categories/create", adminAuth , (req, res) => {
    res.render('admin/categories/createCategories');
});

router.post("/categories/save", (req, res) => {
    let title = req.body.title;

    if (title != undefined) {
        CategoryModel.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories");
        });
    }
    else{
        alert("Undefined title!");
        res.redirect("/admin/categories/create");
    }
});

router.post("/admin/categories/delete", (req, res) => {
    let id = req.body.id;

    if (id != undefined) {
        if (!isNaN(id)) {
            CategoryModel.destroy({
                where: { id: id }
            }).then(() => {
                res.redirect("/admin/categories");
            })
        }
        else{
            res.redirect("/admin/categories");
        }
    }
    else{
        res.redirect("/admin/categories");
    }
});

router.get("/admin/categories/edit/:id", adminAuth , (req, res) => {
    let id = req.params.id;

    if (isNaN(id)) {
        res.redirect('/admin/categories');
    }

    CategoryModel.findByPk(id).then(category => {
        if (id != undefined) {
            res.render('admin/categories/updateCategory', {category: category})
        }
        else{
            res.redirect('/admin/categories');
        }
    }).catch(erro => {
        res.redirect('/admin/categories');
    })
});

router.post("/admin/categories/update", adminAuth , (req, res) => {
    let id = req.body.id;
    let title = req.body.title;

    CategoryModel.update({title: title, slug: slugify(title)}, {
        where: {id: id}
    }).then(() => {
        res.redirect('/admin/categories');
    })
});

module.exports = router;