$(document).ready(function () {
    //Getting reference to the div where the articles are rendered
    var articleContainer = $(".article-container");
    //Adding event listens for the buttons
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleArticleDelete);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    //Starts everything when page is loaded
    initPage();

    function initPage() {
        //Empties the article container and runs AJAX request for any saved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function (data) {
            //If we headlines render
            if (data && data.length) {
                renderArticles(data);
            } else {
                //Otherwise message for no articles
                renderEmpty();
            }
        });
    };

    function renderArticles(articles) {

        var articlePanels = [];

        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        articleContainer.append(articlePanels);
    };

    function createPanel(article) {

        var panel =
            $(["<div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                aricle.headline,
                "<a class='btn btn-danger delete'>",
                "Delete From Saved",
                "</a>",
                "<a class='btn btn-info notes'>Article Notes</a>",
                "</h3>",
                "</div>",
                "<div class='panel-body'>",
                article.summary,
                "</div>",
                "</div>"
            ].join(""));

        panel.data("_id", article._id);
        return panel;
    };

    function renderEmpty(){

        var emptyAlert =
            $(["<div class='alert alert-warning text-center'>",
                "<h4>Uh Oh. Looks like we don't have any saved articles.</h4>",
                "</div>",
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h3>Would you like to browse available articles?</h3>",
                "</div>",
                "<div class='panel-body"])
    }

    function renderNotesList(data){

    }
});