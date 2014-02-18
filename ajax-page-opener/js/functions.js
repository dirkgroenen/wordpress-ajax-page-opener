jQuery(document).ready(function($){

    if($("#overlaycontent .contentwrap").length < 1){
        $("body").append("<div id='overlaycontent'><div class='contentwrap'></div> <div class='closeoverlay'></div></div>");
    }
    if($("#pageoverlay").length < 1){
        $("body").append("<div id='pageoverlay'></div>");
    }

    // Replace \n to line breaks
    function nl2br(str, is_xhtml) {
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }

    function openPageOverlay(url){
        // get part after site url
        var path = url.replace(siteurl,'');
        
        // Place the path as a hash in the url
        location.hash = path;
        
        // Fade in the page content and the overlay div
        $("#overlaycontent,#pageoverlay").fadeIn();
        
        // Setup the ajax data
        var data = {
            action: 'getpage',
            slug: path
        };
        
        // Make request
        $.post(ajaxurl,data,function(response){
            console.log(response);
            // Place content in site overlay
            var page = JSON.parse(response);

            $("#overlaycontent .contentwrap").html('');
            
            if(page == null){
                $("#overlaycontent .contentwrap").append("<h1>Pagina niet gevonden</h1>");
                $("#overlaycontent .contentwrap").append("<p>De pagina die je zocht bestaat niet (meer).<br/><a href='#' class='closeoverlay'>Sluiten</a></p>");
            }
            else{
                $("#overlaycontent .contentwrap").append("<h1>"+page.post_title+"</h1>");
                $("#overlaycontent .contentwrap").append(nl2br(page.post_content));
            }
            
            $(".closeoverlay").click(function(e){
                $("#pageoverlay, #overlaycontent").fadeOut(300,function(){
                    // Remove the hash from the url
                    location.hash = '';
                    
                    // Remove page content
                    $("#overlaycontent .contentwrap").html('');
                });
                
                e.preventDefault();
            });
            
        });
    }


    // On menu link click we prevent the default action; load the page content via ajax and place it in the overlay
    $("a.openpage").click(function(e){
        openPageOverlay($(this).attr('href'));

        // Prevent default link action
        e.preventDefault();
    });

    // Check if we have an hash
    if(location.hash){
        openPageOverlay(location.hash.substr(1));
    }

});