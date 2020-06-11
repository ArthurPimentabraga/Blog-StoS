const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/connection");
//Controllers
const articlesController = require("./src/articles/ArticlesController");
const categoriesController = require("./src/categories/CategoriesController");
//Models
const ArticleModel = require("./src/articles/ArticleModel");
const CategoryModel = require("./src/categories/CategoryModel");

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
app.get("/", (req, res) => {
    ArticleModel.findAll().then(articles => {
        res.render('index', {articles: articles});
    });
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

app.use("/" , articlesController);
app.use("/" , categoriesController);

//Server
app.listen(8080, (error) => {
    if (error) {
        console.log("Error when starding the server! :(");
    }
    else{
        console.log("Server started successfully! :)");
    }
});