
let searchText = '';

$("#search_form").submit(function (e) {
    e.preventDefault();

    // get the value of text submitted and comparing with last searchText value
    // if (searchText != $('input').val()){
    //     $('#result').html('');
    // }
    searchText = $('input').val();

    if (searchText.length == 0) {
        alert("Search text can not be empty!");

    } else {
        
        let img;
        let title;
        let author;

        // get search data using google api
        $.get(`https://www.googleapis.com/books/v1/volumes?q=${searchText}&maxResults=40`, function (data) {

            // display important components of book from search data in 'result' div element
            for (i = 0; i < data.items.length; i++) {
                let bookInfo = data.items[i].volumeInfo;

                if (bookInfo.imageLinks) {                    
                    img = $('<img> <p><a href="/users/bookdetail/?title=' + bookInfo.title + '&authors=' + totalAuthors + '&thumbnail=' + bookInfo.imageLinks.thumbnail + '&more=' + bookInfo.infoLink + '&desc=' + bookInfo.description + '&search=' + searchText + '"><button id="sign-out-button">Read More</button></a></p>');
                    img.attr('src', bookInfo.imageLinks.thumbnail);                    
                } else {
                    img = $('<h2 class="color-red"> Image is not found in google book database </h2> <p><a href="/users/bookdetail/?title=' + bookInfo.title + '&authors=' + totalAuthors + '&thumbnail=no&more=' + bookInfo.infoLink + '&desc=' + bookInfo.description + '&search=' + searchText + '"><button id="sign-out-button">Read More</button></a></p>');
                }
                img.prependTo("#result");

                let totalAuthors = '';

                if (bookInfo.authors) {
                    for (let author of bookInfo.authors) {
                        totalAuthors += author + " ";
                        author = $('<h2 class="author-color">' + author + '</h2>');
                        author.prependTo("#result");
                    }                    
                } else {
                    author = $('<h2 class="author-color"> author is unknown </h2>');
                    author.prependTo("#result");
                }

                title = $('<h1 class="title-color">' + bookInfo.title + '</h1>');
                title.prependTo("#result");
                 
            }            

        // if google api do not work
        }).fail(function(){
            console.log('failing in get google api');
        });
    }
});
