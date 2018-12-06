// ****************************************
// Define variable global
// ****************************************
var __PDF_DOC,
      __CURRENT_PAGE,
      __TOTAL_PAGES,
      __PAGE_RENDERING_IN_PROGRESS = 0,
      signaturePad_1,
      signaturePad_2;


// ****************************************
// Run script when document ready
// ****************************************
$(document).ready(function(){
    showPDF("./assest/pdffile/test.pdf", "#pdf-canvas-1");
    showPDF("./assest/pdffile/test.pdf", "#pdf-canvas-2");
    initDraw(signaturePad_1, "#pdf-canvas-1");
    initDraw(signaturePad_2, "#pdf-canvas-2");
    eventSavePDFFile();
})


// ****************************************
// pdf js function declare
// ****************************************
function showPage(page_no, __CANVAS) {
    __PAGE_RENDERING_IN_PROGRESS = 1;
    __CURRENT_PAGE = page_no;
    __CANVAS_CTX = __CANVAS.getContext('2d');
    // Fetch the page
    __PDF_DOC.getPage(page_no).then(function (page) {
        __CANVAS.width = 768;
        // As the canvas is of a fixed width we need to set the scale of the viewport accordingly
        var scale_required = __CANVAS.width / page.getViewport(1).width;
        // Get viewport of the page at required scale
        var viewport = page.getViewport(scale_required);
        // Set canvas height
        __CANVAS.height = viewport.height;
        var renderContext = {
            canvasContext: __CANVAS_CTX,
            viewport: viewport
        };
        // Render the page contents in the canvas
        page.render(renderContext).then(function () {
            __PAGE_RENDERING_IN_PROGRESS = 0;
        });
    });
}

function showPDF(pdf_url, containerId) {
    pdfjsLib.getDocument({
        url: pdf_url
    }).then(function (pdf_doc) {
        __PDF_DOC = pdf_doc;
        __TOTAL_PAGES = __PDF_DOC.numPages;
        __CANVAS = $(containerId).get(0),
        // Show the first page
        showPage(1, __CANVAS);
    }).catch(function (error) {
        alert(error.message);
    });;
}

// ****************************************
// draw on canvas
// ****************************************
function initDraw(signaturePad, containerId){
    var __CANVAS = $(containerId).get(0),
    signaturePad = new SignaturePad(__CANVAS, {
        // It's Necessary to use an opaque color when saving image as JPEG;
        // this option can be omitted if only saving as PNG or SVG
        backgroundColor: 'rgb(255, 255, 255)'
    });
}


// ****************************************
// Event Save PDF
// ****************************************
function eventSavePDFFile(){
    $('#save-pdf-canvas-1').on("click", function(){
        const __CANVAS =  $('#pdf-canvas-1').get(0);
        const dataURL = __CANVAS.toDataURL("image/jpg",.7);
        var doc = new jsPDF();
        console.log(doc);
        doc.addImage(dataURL, 'JPG', 15, 40, 180, 180);

        doc.save('OKKKKKKKKKKKKKKKK.pdf');
    });
}
