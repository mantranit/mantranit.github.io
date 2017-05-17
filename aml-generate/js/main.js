/**
 * Created by MinhMan.Tran on 5/3/2017.
 */

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

$(function(){
    var siteData;

    $('.summernote').summernote({
        minHeight: 200,
        toolbar: [
            ['para', ['style', 'ul', 'ol', 'paragraph']],
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['superscript', 'subscript']],
            ['insert', ['picture', 'link']],
            ['misc', ['undo', 'redo', 'fullscreen', 'codeview']]
        ],
        cleaner:{
            notTime: 2400, // Time to display Notifications.
            action: 'both', // both|button|paste 'button' only cleans via toolbar button, 'paste' only clean when pasting content, both does both options.
            newline: '<br>', // Summernote's default is to use '<p><br></p>'
            notStyle: 'position:absolute;top:0;left:0;right:0', // Position of Notification
            icon: '<i class="note-icon">[Your Button]</i>',
            keepHtml: false, // Remove all Html formats
            keepClasses: false, // Remove Classes
            badTags: ['style', 'script', 'applet', 'embed', 'noframes', 'noscript', 'html'], // Remove full tags with contents
            badAttributes: ['style', 'start'] // Remove attributes from remaining tags
        }
    });

    var urlVars = getUrlVars();

    if(urlVars.length > 0 && urlVars['data']){

        $.getJSON('data/' + urlVars['data'], function (response) {

            $('#section-html').empty();

            fillData(response);
        });
    }

    $('#fill').on('click', function(){
        var url = $('#selectData').val();
        if(url) {
            window.location.href = '/aml-generate/?data=' + url;
        } else {
            alert('Please select data.');
        }
    });

    function fillData(response){

        $('#formMain [name="fileName"]').val(response.fileName);
        $('#formMain [name="title"]').val(response.title);
        $('#formMain [name="defaultImage"]').val(response.defaultImage);

        $('#formMain [name="gaKey"]').val(response.gaKey);
        $('#formMain [name="toTop"]').val(response.toTop);
        $('#formMain [name="fileJs"]').val(response.fileJs);

        $('#formMain [name="facebookImage"]').val(response.facebookImage);
        $('#formMain [name="weiboImage"]').val(response.weiboImage);
        $('#formMain [name="wechatImage"]').val(response.wechatImage);

        $('#formMain [name="logo"]').val(response.logo);
        $('#formMain [name="logoUrl"]').val(response.logoUrl);
        $('#formMain [name="logoAlt"]').val(response.logoAlt);

        $('#formMain [name="urlEN"]').val(response.urlEN);
        $('#formMain [name="urlTC"]').val(response.urlTC);
        $('#formMain [name="urlSC"]').val(response.urlSC);

        $('#formMain [name="ogTitle"]').val(response.ogTitle);
        $('#formMain [name="ogImage"]').val(response.ogImage);
        $('#formMain [name="ogDescription"]').val(response.ogDescription);

        $('#formMain [name="od"]').val(response.od);
        $('#formMain [name="odAlt"]').val(response.odAlt);
        $('#formMain [name="defaultPage"]').val(response.defaultPage);

        $('#formMain [name="kvDesktop"]').val(response.pages[response.defaultPage].kvDesktop);
        $('#formMain [name="kvMobile"]').val(response.pages[response.defaultPage].kvMobile);
        $('#formMain [name="kvAlt"]').val(response.pages[response.defaultPage].kvAlt);
        $('#formMain [name="intro"]').val(response.pages[response.defaultPage].intro);

        $('#formMain [name="beforeQr"]').val(response.pages[response.defaultPage].beforeQr);
        $('#formMain [name="qrCode"]').val(response.pages[response.defaultPage].qrCode);
        $('#formMain [name="afterQr"]').val(response.pages[response.defaultPage].afterQr);

        var sectionHtml = $('#section-html');
        $.each(response.pages[response.defaultPage].sections, function(idxSection, objSection){
            var tplSection = $($('#section').html());
            tplSection.find('[name="name"]').val(objSection.name);
            tplSection.find('[name="prefix"]').val(objSection.prefix);
            tplSection.find('[name="id"]').val(objSection.id);
            tplSection.find('[name="hash"]').val(objSection.hash);

            $.each(objSection.rows, function(idxRow, objRow){

                var tplRow = $($('#row-1').html());
                if(objRow.template === 'moduleContentTwo'){
                    tplRow = $($('#row-2').html());
                }
                tplRow.find('.col-md-6:first-child .note, .col-md-12 .note').html(objRow.data[0].note);
                tplRow.find('.col-md-6:first-child .data-item, .col-md-12 .data-item').val(JSON.stringify(objRow.data[0]));
                if(objRow.data[1]) {
                    tplRow.find('.col-md-6:last-child .note').html(objRow.data[1].note);
                    tplRow.find('.col-md-6:last-child .data-item').val(JSON.stringify(objRow.data[1]));
                }

                tplSection.find('.panel-body--section').append(tplRow);

            });

            sectionHtml.append(tplSection);
        });

        initSortable();
    }

    $('#modalContent select[name="template"]').on('change', function(){
        if($(this).val() !== 'contentNoExpansion'){
            $('#modalContent .show-expansion').show();
            $('#modalContent .show-no-expansion').hide();
        } else {
            $('#modalContent .show-expansion').hide();
            $('#modalContent .show-no-expansion').show();
        }
    });

    $('#design').on('click', '.edit-item-general', function(){
        var dataStore = $(this).siblings('.data-item');

        $('#design .data-item').removeClass('current');
        dataStore.addClass('current');

        var modal = $('#modalContentGeneral');

        if(dataStore.val()) {
            var itemObject = JSON.parse(dataStore.val());

            modal.find('[name="template"]').val(itemObject.template).trigger('change');
            modal.find('[name="note"]').val(itemObject.note);
            modal.find('[name="brandName"]').val(itemObject.brandName);
            modal.find('[name="headline"]').val(itemObject.headline);
            modal.find('[name="imageDesktop"]').val(itemObject.imageDesktop);
            modal.find('[name="imageMobile"]').val(itemObject.imageMobile);
            modal.find('[name="leadIn"]').val(itemObject.leadIn);
            modal.find('[name="tip"]').val(itemObject.tip);
            modal.find('[name="externalLink"]').val(itemObject.externalLink);

            modal.find('[name="cta"]').val(itemObject.cta);
            modal.find('[name="ctaUrl"]').val(itemObject.ctaUrl);

            if (itemObject.gallery[0]) {
                modal.find('[name="galleryImage0"]').val(itemObject.gallery[0].src);
                modal.find('[name="galleryAlt0"]').val(itemObject.gallery[0].alt);
            }
            if (itemObject.gallery[1]) {
                modal.find('[name="galleryImage1"]').val(itemObject.gallery[1].src);
                modal.find('[name="galleryAlt1"]').val(itemObject.gallery[1].alt);
            }
            if (itemObject.gallery[2]) {
                modal.find('[name="galleryImage2"]').val(itemObject.gallery[2].src);
                modal.find('[name="galleryAlt2"]').val(itemObject.gallery[2].alt);
            }

            modal.find('[name="logo"]').val(itemObject.logo);
            modal.find('[name="logoUrl"]').val(itemObject.logoUrl);
        }

        modal.modal('show');
    });

    $('#input-json-general').on('click', function(){

        var itemObject = toJSONString(document.getElementById('form-item-general'));

        var curHtml = $('#design .data-item.current');

        var currentObject = JSON.parse(curHtml.val());

        curHtml.siblings('.note').html(itemObject.note);

        curHtml.val(JSON.stringify($.extend(currentObject, itemObject))).removeClass('current');

        $('#modalContentGeneral').modal('hide');
    });




    $('#design').on('click', '.edit-item-logo', function(){
        var dataStore = $(this).siblings('.data-item');

        $('#design .data-item').removeClass('current');
        dataStore.addClass('current');

        var modal = $('#modalContentLogo');

        if(dataStore.val()) {
            var itemObject = JSON.parse(dataStore.val());

            if (itemObject.gallery[0]) {
                modal.find('[name="galleryImage0"]').val(itemObject.gallery[0].src);
                modal.find('[name="galleryAlt0"]').val(itemObject.gallery[0].alt);
            }
            if (itemObject.gallery[1]) {
                modal.find('[name="galleryImage1"]').val(itemObject.gallery[1].src);
                modal.find('[name="galleryAlt1"]').val(itemObject.gallery[1].alt);
            }
            if (itemObject.gallery[2]) {
                modal.find('[name="galleryImage2"]').val(itemObject.gallery[2].src);
                modal.find('[name="galleryAlt2"]').val(itemObject.gallery[2].alt);
            }

            modal.find('[name="logo"]').val(itemObject.logo);
            modal.find('[name="logoUrl"]').val(itemObject.logoUrl);
        }

        modal.modal('show');
    });

    $('#input-json-logo').on('click', function(){

        var itemObject = toJSONString(document.getElementById('form-item-logo'));
        itemObject.period = $('#period').summernote('code');

        var curHtml = $('#design .data-item.current');

        var currentObject = JSON.parse(curHtml.val());

        curHtml.siblings('.note').html(itemObject.note);

        curHtml.val(JSON.stringify($.extend(currentObject, itemObject))).removeClass('current');

        $('#modalContentLogo').modal('hide');
    });



    $('#design').on('click', '.edit-item-offer', function(){
        var dataStore = $(this).siblings('.data-item');

        $('#design .data-item').removeClass('current');
        dataStore.addClass('current');

        var modal = $('#modalContentOffer');

        $('#offerBody').summernote('code', "");

        if(dataStore.val()) {
            var itemObject = JSON.parse(dataStore.val());

            $('#offerBody').summernote('code', itemObject.offerBody);
        }

        modal.modal('show');
    });

    $('#input-json-offer').on('click', function(){

        var curHtml = $('#design .data-item.current');

        var currentObject = JSON.parse(curHtml.val());

        curHtml.val(JSON.stringify($.extend(currentObject, {
            offerBody: $('#offerBody').summernote('code')
        }))).removeClass('current');

        $('#modalContentOffer').modal('hide');
    });



    $('#design').on('click', '.edit-item-tandc', function(){
        var dataStore = $(this).siblings('.data-item');

        $('#design .data-item').removeClass('current');
        dataStore.addClass('current');

        var modal = $('#modalContentTandc');

        $('#tandcUrl').val('');
        $('#tandcBody').summernote('code', "");

        if(dataStore.val()) {
            var itemObject = JSON.parse(dataStore.val());

            $('#tandcUrl').val(itemObject.tandcUrl);
            $('#tandcBody').summernote('code', itemObject.tandcBody);
        }

        modal.modal('show');
    });

    $('#input-json-tandc').on('click', function(){

        var curHtml = $('#design .data-item.current');

        var currentObject = JSON.parse(curHtml.val());

        curHtml.val(JSON.stringify($.extend(currentObject, {
            tandcUrl: $('#tandcUrl').val(),
            tandcBody: $('#tandcBody').summernote('code')
        }))).removeClass('current');

        $('#modalContentTandc').modal('hide');
    });




    $('#design').on('click', '.edit-item-other', function(){
        var dataStore = $(this).siblings('.data-item');

        $('#design .data-item').removeClass('current');
        dataStore.addClass('current');

        var modal = $('#modalContentOther');

        $('#extraBody').summernote('code', "");
        $('#hotelHighlight').summernote('code', "");

        if(dataStore.val()) {
            var itemObject = JSON.parse(dataStore.val());

            $('#extraBody').summernote('code', itemObject.extraBody);
            $('#hotelHighlight').summernote('code', itemObject.hotelHighlight);
        }

        modal.modal('show');
    });

    $('#input-json-other').on('click', function(){

        var curHtml = $('#design .data-item.current');

        var currentObject = JSON.parse(curHtml.val());

        curHtml.val(JSON.stringify($.extend(currentObject, {
            extraBody: $('#extraBody').summernote('code'),
            hotelHighlight: $('#hotelHighlight').summernote('code')
        }))).removeClass('current');

        $('#modalContentOther').modal('hide');
    });


    /*$('#design').on('click', '.edit-item', function(){
        var dataStore = $(this).siblings('.data-item');

        $('#design .data-item').removeClass('current');
        dataStore.addClass('current');

        var modal = $('#modalContent');

        document.getElementById('form-item').reset();
        $('#period').summernote('code', "");
        $('#offerBody').summernote('code', "");
        $('#extraBody').summernote('code', "");
        $('#hotelHighlight').summernote('code', "");
        $('#tandcBody').summernote('code', "");

        if(dataStore.val()) {

            var itemObject = JSON.parse(dataStore.val());

            modal.find('[name="template"]').val(itemObject.template).trigger('change');
            modal.find('[name="note"]').val(itemObject.note);
            modal.find('[name="brandName"]').val(itemObject.brandName);
            modal.find('[name="headline"]').val(itemObject.headline);
            modal.find('[name="imageDesktop"]').val(itemObject.imageDesktop);
            modal.find('[name="imageMobile"]').val(itemObject.imageMobile);
            modal.find('[name="leadIn"]').val(itemObject.leadIn);
            modal.find('[name="tip"]').val(itemObject.tip);
            modal.find('[name="externalLink"]').val(itemObject.externalLink);

            if (itemObject.template === 'contentExpansion') {

                if (itemObject.gallery[0]) {
                    modal.find('[name="galleryImage0"]').val(itemObject.gallery[0].src);
                    modal.find('[name="galleryAlt0"]').val(itemObject.gallery[0].alt);
                }
                if (itemObject.gallery[1]) {
                    modal.find('[name="galleryImage1"]').val(itemObject.gallery[1].src);
                    modal.find('[name="galleryAlt1"]').val(itemObject.gallery[1].alt);
                }
                if (itemObject.gallery[2]) {
                    modal.find('[name="galleryImage2"]').val(itemObject.gallery[2].src);
                    modal.find('[name="galleryAlt2"]').val(itemObject.gallery[2].alt);
                }

                modal.find('[name="logo"]').val(itemObject.logo);
                modal.find('[name="logoUrl"]').val(itemObject.logoUrl);

                modal.find('[name="cta"]').val(itemObject.cta);
                modal.find('[name="ctaUrl"]').val(itemObject.ctaUrl);

                modal.find('[name="tandcUrl"]').val(itemObject.tandcUrl);

                $('#period').summernote('code', itemObject.period);
                $('#offerBody').summernote('code', itemObject.offerBody);
                $('#extraBody').summernote('code', itemObject.extraBody);
                $('#hotelHighlight').summernote('code', itemObject.hotelHighlight);
                $('#tandcBody').summernote('code', itemObject.tandcBody);
            }
        }

        modal.modal('show');
    });

    $('#ok-item').on('click', function(){
        var itemObject = toJSONString(document.getElementById('form-item'));

        itemObject.period = $('#period').summernote('code');
        itemObject.offerBody = $('#offerBody').summernote('code');
        itemObject.extraBody = $('#extraBody').summernote('code');
        itemObject.hotelHighlight = $('#hotelHighlight').summernote('code');
        itemObject.tandcBody = $('#tandcBody').summernote('code');

        $('#design .data-item.current').siblings('.note').html(itemObject.note);
        $('#design .data-item.current').val(JSON.stringify(itemObject)).removeClass('current');

        $('#modalContent').modal('hide');
    });*/

    $('#add-section').on('click', function(){

        var sectionHtml = $('#section-html');

        var tplSection = $($('#section').html());

        sectionHtml.append(tplSection);

        initSortable();
    });

    $('#design').on('click', '.delete-section', function(){
        if(confirm('Are you sure you want to delete this section?') == true) {
            $(this).parents('.type-section').remove();
        }
    });

    $('#design').on('click', '.delete-row', function(){
        if(confirm('Are you sure you want to delete this row?') == true) {
            $(this).parents('.type-row').remove();
        }
    });

    $('#design').on('click', '.add-row-2', function(){
        var tplRow = $($('#row-2').html());

        $(this).parents('.type-section').find('.panel-body--section').append(tplRow);

        initSortable();
    });

    $('#design').on('click', '.add-row-1', function(){
        var tplRow = $($('#row-1').html());

        $(this).parents('.type-section').find('.panel-body--section').append(tplRow);

        initSortable();
    });

    $('#ok').on('click', function(){

        var siteData = toJSONString(document.getElementById('formMain'));

        siteData.pages[siteData.defaultPage]['sections'] = [];

        $('#section-html .formSection').each(function(iS, eS){

            var sectionData = toJSONString(eS);

            $(eS).find('.type-row').each(function(iR, eR){

                var itemHtml = $(eR).find('.data-item');
                var rowObject = {
                    template: 'moduleContentOne'
                };
                if(itemHtml.length == 2){
                    rowObject.template = 'moduleContentTwo';
                }
                itemHtml.each(function(iA, eA){
                    if(!rowObject.data){
                        rowObject.data = [];
                    }

                    rowObject.data[rowObject.data.length] = JSON.parse($(eA).val());
                });

                if(!sectionData.rows){
                    sectionData.rows = [];
                }
                sectionData.rows[sectionData.rows.length] = rowObject;
            });

            siteData.pages[siteData.defaultPage]['sections'][siteData.pages[siteData.defaultPage]['sections'].length] = sectionData;
        });

        // Send the request
        $.post('save.php', {"data": JSON.stringify(siteData)}, function(response) {
            if(response.data) {
                window.location.href = '/aml-generate/?data=' + response.data;
            } else {
                alert('No data');
            }
        }, 'json');

    });

    var main = $('#previewMain'),
        other = $('#previewOther');
    $('#preview').on('click', function(){

        if(main.val() && other.val()) {
            window.open('od_' + $('#previewLang').val() + '.php?main=' + main.val() + '&other=' + other.val(), '_blank');
            $('#modalPreview').modal('hide');
        } else {
            alert('Please select data.');
        }
    });

    main.on('change', function(){
        var value = $(this).val();
        if(value){
            var page = value.substr(0, 2);
            other.find('option').each(function(i,e){
                if($(this).html().indexOf(page) === 0){
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });
            other.removeAttr('disabled');
        } else {
            other.val('').attr('disabled', 'disabled');
        }
    });

    function initSortable() {
        $('.panel-body--section').sortable();
    }


    $(document).bind('keydown', 'ctrl+s', function(event){

        if(confirm('SAVE and RELOAD?') === true) {
            $('#ok').trigger('click');
        }

        event.preventDefault();
        return false;
    });

    $('body *').bind('keydown', 'ctrl+s', function(event){

        if(confirm('SAVE and RELOAD?') === true) {
            $('#ok').trigger('click');
        }

        event.preventDefault();
        return false;
    });

});


function toJSONString( form ) {
    var obj = {};
    var elements = form.querySelectorAll( "input, select, textarea" );
    for( var i = 0; i < elements.length; ++i ) {
        var element = elements[i];
        var name = element.name;
        var value = element.value;

        if(name && name !== 'files') {
            if(element.type === 'checkbox') {
                obj[name] = element.checked;
            } else {
                var od = ['kvDesktop', 'kvMobile', 'kvAlt', 'intro', 'beforeQr', 'qrCode', 'afterQr'];
                if(od.indexOf(name) >= 0){
                    if(!obj.pages){
                        obj.pages = {};
                    }
                    if(!obj.pages[obj.defaultPage]){
                        obj.pages[obj.defaultPage] = {};
                    }
                    obj.pages[obj.defaultPage][name] = value;
                } else {
                    if (name.indexOf('galleryImage') >= 0) {

                        if (!obj.gallery) {
                            obj['gallery'] = [];
                        }
                        if (value) {
                            if (typeof obj['gallery'][parseInt(name[name.length - 1], 10)] !== 'object') {
                                obj['gallery'][parseInt(name[name.length - 1], 10)] = {};
                            }
                            obj['gallery'][parseInt(name[name.length - 1], 10)]['src'] = value;
                            obj['gallery'][parseInt(name[name.length - 1], 10)]['alt'] = '';
                        }
                    } else {
                        if (name.indexOf('galleryAlt') >= 0) {
                            if (!obj.gallery) {
                                obj['gallery'] = [];
                            }
                            if (value) {
                                if (typeof obj['gallery'][parseInt(name[name.length - 1], 10)] !== 'object') {
                                    obj['gallery'][parseInt(name[name.length - 1], 10)] = {};
                                }
                                obj['gallery'][parseInt(name[name.length - 1], 10)]['alt'] = value;
                            }
                        }
                        else {
                            obj[name] = value;
                            if (value && !isNaN(value)) {
                                obj[name] = parseInt(value, 10);
                            }
                            if (value && value === 'false') {
                                obj[name] = false;
                            }
                        }
                    }

                }
            }
        }
    }

    return obj;
}
