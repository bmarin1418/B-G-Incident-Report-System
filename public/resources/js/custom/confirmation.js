var doc_def = sessionStorage.getItem('doc_def');
doc_def = JSON.parse(doc_def)
pdfMake.createPdf(doc_def).open();
sessionStorage.clear();