$(document).ready(function () {
    var retrieveAndPrint = function (){
        var doc_def = sessionStorage.getItem('doc_def');
        doc_def = JSON.parse(doc_def)
        pdfMake.createPdf(doc_def).open();
    }

    $("#print-again-button").click(retrieveAndPrint);
    $("#home-button").click(function(){
        sessionStorage.clear();
        window.location.replace("choose_form.html")
    });
    retrieveAndPrint();
});
