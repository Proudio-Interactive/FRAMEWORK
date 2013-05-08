(function($) {
    
    // Molokoloco 2013 - Copyleft
    // Live fiddle : http://jsfiddle.net/molokoloco/Ra288/
    // Github : https://github.com/molokoloco/FRAMEWORK/blob/master/jquery.plugins/jquery.colonize.js
    
    $.fn.colonize = function(options) { // Wrapping P between H2
        options = $.extend(true, {}, $.fn.colonize.defaults, typeof options == 'object' &&  options); 
        return this.each(function() {
            var $container     = $(this),
                cWidth         = $container.width(),
                colWidth       = cWidth,
                colHeightRatio = 1,
                intentNextP    = 0,
                lineHeight     = 0;
            
            var $p = $('<p>A</p>').appendTo($container);
            lineHeight = $p.outerHeight();
            $p.remove();
            
            if (options.colWidth) options.colCount = Math.max(1, Math.floor(cWidth / options.colWidth));
            colWidth = (cWidth - ((options.marge * 2) * options.colCount)) / options.colCount;
            colHeightRatio = cWidth / colWidth;
            
            var colsExtractor = function () { // wrapAll || nextAll // :-(
                
                var $this       = $(this),
                    $next       = $this.next(),
                    $collection = [],
                    jumpNext    = false,
                    totalHeight = 0;
                
                while ($next) {
                    if (!$next.is(options.take)) {
                        if (!$next.is(options.chapters)) jumpNext = true;
                        $next = null; // Break
                    }
                    else {
                        $collection.push($next);
                        $next = $next.next();
                    }
                }
                
                if ($collection.length > 1 || ( $collection.length && $collection[0].outerHeight() > lineHeight) ) {
                    var $wrapper = $(options.wrapper);
                    for (var i = 0, len = $collection.length; i < len; i++) {
                        totalHeight += ($collection[i].height() * colHeightRatio); // Futur P height
                        $wrapper.append($collection[i].detach()); // Extract P
                        if (totalHeight >= options.maxHeight) { // Breaking Cols if > screen height
                            $wrapper.insertAfter($this);
                            $this = $wrapper;
                            totalHeight = 0;
                            $wrapper = $(options.wrapper);
                        }
                    }
                    $wrapper.insertAfter($this); // Append new COL div container
                    if (jumpNext) $.proxy(colsExtractor, $wrapper.next())();
                }
                else if (jumpNext) {
                    intentNextP++; // Max, trois tags vides après un titre
                    if (intentNextP < 3) $.proxy(colsExtractor, $this.next())();
                }
            };
            
            $container
                .find(options.chapters)
                .each(colsExtractor);
        });
    };
    
    $.fn.colonize.defaults = {
        marge:       10,   // Left/right margin
        colWidth:    null, // As in the CSS, chose between COUNT or WIDTH for cols
        colCount:    null, // colWidth OR colCount
        chapters:    'h1,h2,h3,h4,h5,h6',                   // Between the
        take:        'p',                                   // Take all the
        wrapper:     '<div class="multiplecolumns"/>',      // And wrap them with
        maxHeight:   Math.max(100, $(window).height() - 60) // Max col height will be..
    };
    
})(window.jQuery);


$('#colonize').click(function() {
    
    /*
    // in your styles.css...
    
    .multiplecolumns {
        -webkit-column-width:180px;
           -moz-column-width:180px;
                column-width:180px;
        -webkit-column-gap: 1px;
           -moz-column-gap: 1px;
                column-gap: 1px;
        -webkit-column-rule: 1px dashed rgba(0,0,0,.4);
           -moz-column-rule: 1px dashed rgba(0,0,0,.4);
                column-rule: 1px dashed rgba(0,0,0,.4);
        -webkit-column-fill: auto;
           -moz-column-fill: auto;
                column-fill: auto;
        
        background:rgba(255, 192, 203, 0.4);
        padding:10px 0;
    }
    
    .multiplecolumns p {
        margin:0 10px;
        text-align: justify;
    }
    */

    $('#container').colonize({ // Use it...
        marge:      10,
        colWidth:   180, // Report CSS "column-width"
        take:        'p,ul', // Adding UL to the stream...
        wrapper:    '<div class="multiplecolumns"/>'
    });

});

