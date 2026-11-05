/**
 * beautify xml string
 *
 * @param {String} xml
 * @returns {String}
 */
function beautify(xml) {
    if (!xml) {
        return xml;
    }

    xml = xml.trim();

    // Remove all the newlines and then remove all the spaces between tags
    xml = xml.replace(/(\r\n|\n|\r)/gm, " ").replace(/>\s+</g, '><');

    const reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');

    const PADDING = ' '.repeat(4); // set desired indent size here
    let pad = 0;

    return xml.split('\r\n').map((node) => {
        // Remove any value between ""
        let nodeMod = node.replace(/"[^"]*"/g, "\"\"");

        let indent = 0;

        // contain end node, <xml>value</xml>
        if (nodeMod.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        }
        // end node only, </xml> 
        else if (nodeMod.match(/^<\/\w/) && pad > 0) {
            pad -= 1;
        }
        // contain start node, <xml>
        else if (nodeMod.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        }
        // self close node, <xml/>
        else {
            indent = 0;
        }

        pad += indent;

        return PADDING.repeat(pad - indent) + node;
    }).join('\n');
}