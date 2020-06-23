const express = require('express');
const router = express.Router();
const UserModel = require('./UserModel');
const bcrypt = require('bcrypt');
const adminAuth = require('../middlewares/adminAuth');

router.get("/admin/users", adminAuth , (req, res) => {
    UserModel.findAll().then(users => {
        res.render("admin/users/showUsers", {users: users});
    });
});

router.get("/admin/users/create", adminAuth , (req, res) => {
    res.render("admin/users/createUsers");
});

router.post("/users/save", (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    UserModel.findOne({where: {email: email}}).then(user => {
        if (user == undefined) {        
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);
        
            UserModel.create({
                name: name, 
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/admin/users");
            }).catch(() => {
                res.redirect("/admin/users/create");
            });     
        }
        else{
            res.redirect("/admin/users/create");
        }
    });
});

router.post("/admin/users/delete", (req, res) => {
    let id = req.body.userId;

    if (id != undefined) {
        if (!isNaN(id)) {
            UserModel.destroy({
                where: { id: id }
            }).then(() => {
                res.redirect("/admin/users");
            })
        }
        else{
            res.redirect("/admin/users");
        }
    }
    else{
        res.redirect("/admin/users");
    }
});

router.get("/users/login", (req, res) => {
    res.render("admin/users/login");
});

router.post("/users/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    UserModel.findOne({ where: {email: email} }).then(user => {
        if (user != undefined) {
            let correctPWD = bcrypt.compareSync(password, user.password);
            if (correctPWD) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/")
            }   
            else{
                res.redirect("/users/login");
            }
        }
        else{
            res.redirect("/users/login");
        }
    });
});

router.get("/users/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

module.exports = router;