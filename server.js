const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require('express-session');
const connection = require("./database/connection");
//Controllers
const articlesController = require("./src/articles/ArticlesController");
const categoriesController = require("./src/categories/CategoriesController");
const usersController = require("./src/users/UsersController");
//Models
const ArticleModel = require("./src/articles/ArticleModel");
const CategoryModel = require("./src/categories/CategoryModel");
const UsersModel = require("./src/users/UserModel");

//Session
app.use(session({
    secret: "afdklnvoweinvoiclkxzcm", cookie: { maxAge: 7200000 }
}));

//View engine
app.set("view engine", "ejs");

//Static
app.use(express.static('public'));

//Body-Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Connection
connection
    .authenticate()
    .then(() => {
        console.log("Connection stared successfully!");
    })
    .catch((error) => {
        console.log(error);
    })

//Routes
app.get("/:num?", (req, res) => {
    let page = req.params.num;
    let offset = 0;
    let verifySession = req.session.user;

    if (!page) {
        page = 1;
    }

    if (isNaN(page) || page == 1) {
        offset = 0;
    }
    else{
        offset = (parseInt(page) - 1) * 4;
    }

    ArticleModel.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [['id', 'DESC']],
    }).then(articles => {

        let next;
        if (offset + 4 >= articles.count) {
            next = false;
        }
        else{
            next = true;
        }

        let result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        CategoryModel.findAll().then(categories => {
            res.render('index', {result: result, categories: categories, verifySession: verifySession});
        });
    })
});

app.get("/:slug", (req, res) => {
    let slug = req.params.slug;

    ArticleModel.findOne({
        where: {slug: slug}
    }).then(article => {
        if (article != undefined) {
            res.render('article', {article: article});
        }
        else{
            res.redirect('/');
        }
    }).catch(() => {
        res.redirect('/');
    });
});

app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug;

    CategoryModel.findOne({
        where: {slug: slug},
        include: [{model: ArticleModel}]
    }).then(category => {
        CategoryModel.findAll().then(categories => {
            res.render('articlesForCategory', {articles: category.articles, categories: categories});
        });
    }).catch(() => {
        res.redirect('/');
    });
});

app.use("/" , articlesController);
app.use("/" , categoriesController);
app.use("/" , usersController);

//Server
app.listen(8080, (error) => {
    if (error) {
        console.log("Error when starding the server! :(");
    }
    else{
        console.log("Server started successfully! :)");
    }
});