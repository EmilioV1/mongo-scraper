$(document).ready(function () {
    //Getting reference to the div where the articles are rendered
    var articleContainer = $(".article-container");
    //Adding event listens for the buttons
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    //Starts everything when page is loaded
    initPage();

    function initPage() {
        //Empties the article container and runs AJAX request for any saved headlines
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function (data) {
            //If we headlines render
            if (data && data.length) {
                console.log(data);
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
        //Creates article panels
        var panel =
            $(["<div class='panel panel-default'>",
                "<div class='panel-heading'>",
                "<h3>",
                article.headline,
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
        //Attaches article's id to the jQuery element
        panel.data("_id", article._id);
        //Returns constructed panel
        return panel;
    };

    function renderEmpty() {
        //Renders no article message
        var emptyAlert =
            $(["<div class='alert alert-warning text-center'>",
                "<h4>Uh Oh. Looks like we don't have any saved articles.</h4>",
                "</div>",
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h3>Would you like to browse available articles?</h3>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a href='/'>Browse Articles</a></h4>",
                "</div>",
                "</div>"
            ].join(""));
        //Appending data 
        articleContainer.append(emptyAlert);
    };

    function renderNotesList(data) {
        //Initializing array and var to store notes
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            //If no notes say so
            currentNote = [
                "<li class='list-group-item'>",
                "No notes for this article yet.",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
        else {
            //If there are notes go through each one
            for (var i = 0; i < data.notes.length; i++) {
                //Constructs an li element with the notes and delete button
                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>x</button>",
                    "</li>"
                ].join(""));
                //Stores note id to the delete button
                currentNote.children("button").data("_id", data.notes[i]._id);
                //Adds current note to notesToRender array
                notesToRender.push(currentNote);
            }
        }
        //Appends all the notes
        $(".note-container").append(notesToRender);
    };

    function handleArticleDelete() {
        //Grabs id of the article to delete from the panel
        var articleToDelete = $(this).parents(".panel").data();

        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function (data) {
            //If this works, initPage again to render saved articles
            if (data.ok) {
                initPage();
            }
        });
    };

    function handleArticleNotes() {
        //Grabs article id to get the notes from the panel
        var currentArticle = $(this).parents(".panel").data();
        //Get any notes with this headline/article id
        $.get("/api/notes/" + currentArticle._id).then(function (data) {
            //Building HTML to add to the notes modal
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes For Article: ",
                "<span style='display:none'>"+currentArticle._id+"</span>",
                "</h4>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class='btn btn-success save'> Save Note</button>",
                "</div>"
            ].join("");
            //Adding the formatted HTML to the note modal
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            // Adds some information about the article and notes to the save button
            $(".btn.save").data("article", noteData);
            //Renders HTML to modal
            renderNotesList(noteData);
        });
    };

    function handleNoteSave() {

        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();

        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function () {
                bootbox.hideAll();
            });
        };
    };

    function handleNoteDelete() {

        var noteToDelete = $(this).data("_id");
        console.log(noteToDelete);
        $.ajax({
            url: "/api/notes/"+noteToDelete,
            method: "DELETE"
        }).then(function () {
            bootbox.hideAll();
        });
    };
});