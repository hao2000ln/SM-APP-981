
/*
This method is used to strip the invalid tags contained in the html content
*   @param {String} html - The html content that user input 
*   @returns The html conetnt witht the invalid html tag striped
*   @type String

*/
 function strip_tags(html) {

        var allowTag = ['a', 'img', 'br', 'strong', 'b', 'code', 'pre', 'p', 'div', 'em', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'ul', 'ol', 'tr', 'th', 'td', 'hr', 'li', 'u','strike'];
        var allowTags = "<" + allowTag.join("><") + ">";
        var allow = allowTags.toLowerCase();
        if (html!=null){
          return html.replace(/<[\/\!\?]?([\w_-]*)[^>]*>/igm, function($0, $1) {
            return allow.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
          });
         }
  }

	

