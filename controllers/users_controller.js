
const Users = require("../models/users");

module.exports.home = function(req, res){

    // if user is already logged in, cannot go to home page for sign-in again
    if (req.isAuthenticated()) {
        return res.redirect('/users/searchPage');
    }
    return res.render('home_page');
}

module.exports.createSession = function(req, res){
    return res.redirect('/users/searchPage');
}

module.exports.searchPage = function(req, res){
    return res.render('index');
}

module.exports.destroySession = function(req, res){      
    req.logout();
    res.clearCookie('cookie-session');
    req.session.destroy();
    return res.redirect('/');
}

module.exports.bookdetail = function(req, res){
    if (req.isAuthenticated()){

        Users.findById(req.user.id, function(err, user){
            if (err) { console.log('err in finding user in bookdetail', err); return; }

            let isSearched = false;
            for (let entry of user.search_history){

                if (entry.text == req.query.search){
                    entry.frequency += 1;
                    isSearched = true;
                    break;
                }
            }
            if (!isSearched){
                user.search_history.push({text: req.query.search, frequency: 1});
            }            
            user.save();
        });

        // preparing image thumbnail link
        let imgSrc = req.query.thumbnail;
        if (imgSrc != 'no'){
            imgSrc += "&printsec=" + req.query.printsec + "&img=" + req.query.img + "&zoom=" + req.query.zoom + "&source=" + req.query.source;
        }

        // preparing book link of google books
        let bookLink = req.query.more + "&dq=" + req.query.dq + "&hl=" + req.query.hl;

        return res.render('detail_page', {
            title : req.query.title, 
            authors: req.query.authors,
            thumbnail: imgSrc,
            more: bookLink,
            description: req.query.desc, 
        });
    }

    // if user is not logged in, send back to sign-in page
    return res.redirect('/');
}