var ONYX = "http://www.gsi.dit.upm.es/ontologies/onyx/ns#"
var RDF_TYPE =  "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
function replaceURLWithHTMLLinks(text) {
    console.log('Text: ' + text);
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp,'<a href="$1">$1</a>'); 
}

function encodeHTML(text) {
    return text.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

function hashchanged(){
    var hash = location.hash
          , hashPieces = hash.split('?');
    if( hashPieces[0].length > 0 ){
        activeTab = $('[href=' + hashPieces[0] + ']');
        activeTab && activeTab.tab('show');
    }
}

function getDictFrom(selector){
    dict = {};
    $(selector).children().each(function(el){
        var key = $(this).children().first();
        var value = $(key).next();
        if( key.val() != "" && value.val() != "" ){
            dict[key.val()] = value.val();
            console.log(key.val(), $(value).val());
        }
    });
    return dict;
}

function getResources(){
    console.log("Getting services");
    headers = getDictFrom("#headers-resources");
    headers["content-type"] = "application/json";
    console.log("Headers:", headers);
    parameters = getDictFrom("#parameters-resources");
    parameters.query = $("#query").val();
    url = $("input[name='endpoint-resources']").val();
    method = $("select[name='method']").val();
    payload = { "headers": headers,
                "method": method,
                "url": url
    }
    console.log("Sending data as json");
    console.log("Payload:", payload);
    payload.data = JSON.stringify(parameters);
    console.log("Payload:", payload);
    $("#content-resources").hide();
    $.ajax({
        type: "POST",
        url: "http://demos.gsi.dit.upm.es/eurosentiment-playground/proxy",
        data: JSON.stringify(payload),
        processData: false,
        contentType: "application/json",
        error: function(xhr, status, error){
            alert(status);
            var err = JSON.parse(xhr.responseText);
            alert(err);
        },
        success: function(json){
            try{
                json = JSON.parse(json);
            }catch(ex){
            }
            console.log("Received:", json);
            $("#visualisation-resources").html(replaceURLWithHTMLLinks(JSON.stringify(json, null, 2)));
            $("#content-resources").show();
        }
    });
    return false;
}

function getServices(){
    console.log("Getting services");
    headers = getDictFrom("#headers-services");
    headers["content-type"] = "application/x-www-form-urlencoded";
    console.log("Headers:", headers);
    parameters = getDictFrom("#parameters-services");
    console.log("Headers:", headers);
    url = $("input[name='endpoint-services']").val();
    method = $("select[name='method']").val();
    payload = { "headers": headers,
                "method": method,
                "url": url
    }
    if( $("#asjson").prop("checked") ){
        console.log("Sending as JSON");
        parameters = JSON.stringify(parameters);
    }
    if( method === "GET" ){
        payload.parameters = parameters;
    }else {
        payload.data = parameters;
    }
    console.log("Payload:", payload);
    $("#content-services").hide();
    $.ajax({
        type: "POST",
        url: "http://demos.gsi.dit.upm.es/eurosentiment-playground/proxy",
        data: JSON.stringify(payload),
        processData: false,
        contentType: "application/json",
        error: function(xhr, status, error){
            alert(status);
            var err = JSON.parse(xhr.responseText);
            alert(err);
        },
        success: function(json){
            try{
                json = JSON.parse(json);
            }catch(ex){
            }
            console.log("Received:", json);
            $("#visualisation-services").html(replaceURLWithHTMLLinks(JSON.stringify(json, null, 2)));
            $("#content-services").show();
        }
    });
    return false;
}

$(document).ready(function() {

    var InputsWrapper   = $("#InputsWrapper"); //Input boxes wrapper ID
    var AddButton       = $("#AddMoreFileBox"); //Add button ID

    var FieldID = 4;

    $("body").on("click",".last > input, .last > textarea", function(e){ //user click on remove text
        var par = $(this).parent('div');
        FieldCount = par.siblings().length + 2;
        par.removeClass('only');
        par.removeClass('last');
        par.after('<div class="valuerow last"><textarea class="key" name="mytext[]" id="key_'+ FieldID +'" placeholder="Key"></textarea><textarea class="value" type="text" name="mytext[]" id="value_'+ FieldID +'" placeholder="Value"></textarea><a href="#" tabindex="-1" class="removeclass">&times;</a></div>'); //remove text box
        FieldID++;
    });
    $("body").on("click",".removeclass", function(e){ //user click on remove text
        var par = $(this).parent('div');
        FieldCount = par.siblings().length;
        if( FieldCount > 0 ) {
            var par = $(this).parent('div');
            var thelast = par.siblings().last();
            thelast.addClass('last');
            par.remove(); //remove text box
            if( FieldCount == 1 ){
                console.log("Removing delete");
                thelast.addClass('only');
            }

        }
        return false;
    }) 
    $(window).on('hashchange', hashchanged);
    hashchanged();
    $('.tooltip-form').tooltip();
});
