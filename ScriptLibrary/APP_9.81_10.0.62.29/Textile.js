/*
 * Convert textile format text into html/plan text
 *
 * textile website: https://textile-lang.com/
 *
 * usage:
 *
 * var textile = lib.Textile.require();
 *
 * // convert to html
 * var html = textile.convert(text, true);
 *
 * // convert to plain text
 * var text = textile.convert(text, false);
 */

var Textile = (new function() {

    // options
    const indentSize = 2;

    // to html or plain text
    var toHtml;

    // states

    // list level
    var inList;

    // ol(ordered list) or ul(unordered list)
    var listTypes;

    // table level
    var inTable;

    // pre content level
    var inPreformattedBlock;

    var inExistingBlock;

    // in pre content
    var inPreformattedContent;

    // transforms
    const quotes = {
        startDoubleQuote: '&#8220;',
        endDoubleQuote: '&#8221;',
        startSingleQuote: '&#8216;',
        endSingleQuote: '&#8217;'
    };

    const entities = {
        apostrophe: ["'", '&#8217;'],
        doubleHyphen: ['--', '&#8212;'],
        singleHyphen: ['-', '&#8211;'],
        ellipsis: ['\\.\\.\\.', '&#8230;']
    };


    return {
        /**
         * convert textile to html/plain text
         *
         * @param {String} text
         * @param {Boolean} convertToHtml
         *           true: convert to html (default)
         *           false: convert to plain text
         * @returns {String}
         */
        convert: function(text, convertToHtml) {
            if (!text) {
                return text;
            }

            toHtml = (convertToHtml !== false);

            // init
            inList = 0;
            listTypes = [];
            inTable = 0;
            inPreformattedBlock = 0;
            inExistingBlock = 0;
            inPreformattedContent = false;

            var lines = text.split(/\n|\r\n/);
            var line;
            var result = '';

            var i;
            for (i = 0; i < lines.length; i++) {
                line = lines[i] || '';

                // list end
                if (inList && !this.matchList(line)) {
                    if (toHtml) {
                        while (listTypes.length > 0) {
                            var listType = this.popListType();
                            result += '</li>\n</' + listType + '>\n';
                        }
                    }
                    inList--;
                }

                // table end
                if (inTable && !this.matchTable(line)) {
                    if (toHtml) {
                        result += '</table>\n';
                    }
                    inTable--;
                }

                // ignore last line feed
                if (!line && i == lines.length - 1) {
                    break;
                }

                this.preformattedBlockStart(line);

                // normal context
                if (!this.inPreformattedBlock) {
                    result += (
                        this.headers(line) ||
                        this.blockquotes(line) ||
                        this.lists(line) ||
                        this.tables(line) ||
                        this.paragraphs(line) ||
                        '');
                }
                // pre block content
                else {
                    this.preformattedBlockEnd(line);

                    if (inPreformattedContent) {
                        line = lib.StringUtil.stripHtmlTags(line) + '\n';
                    } else {
                        line += '\n';
                    }
                    result += line;
                    inPreformattedContent = true;
                }

            } //for

            return result;
        },

        indent: function(level) {
            return (new Array(level * indentSize)).join(' ');
        },

        preformattedBlockStart: function(text) {
            var blockStart = text.match(/<(code|pre)/);
            var blockEnd = text.match(/<\/(code|pre)/);

            if (blockStart && !blockEnd) {
                inPreformattedBlock++;
                inPreformattedContent = false;
            }
        },

        preformattedBlockEnd: function(text) {
            var blockEnd = text.match(/<\/(code|pre)/);

            if (inPreformattedBlock && blockEnd) {
                inPreformattedBlock--;
                inPreformattedContent = false;
            }
        },

        expandAttributeShorthand: function(a) {
            switch (a) {
                case '<':
                    return 'text-align:left';
                case '>':
                    return 'text-align:right';
                case '=':
                    return 'text-align:center';
                case '<>':
                    return 'text-align:justify';
                case '^':
                    return 'vertical-align:top';
                case '-':
                    return 'vertical-align:middle';
                case '~':
                    return 'vertical-align:bottom';
                default:
                    return false;
            }
        },

        styleAttribute: function(text, attr) {
            var styles = [];

            var match = text.match(/^[^{]*\{([^}]*)\}[^.]*/);
            if (match) {
                styles = match[1].split(';');
            }

            var expandedStyle = this.expandAttributeShorthand(attr);
            if (expandedStyle) {
                styles.push(expandedStyle);
            }

            var style = '';
            if (styles.length > 0) {
                style = ' style="' + styles.join(';') + '"';
            }

            return style;
        },

        classAttribute: function(text) {
            var match = text.match(/^[^(]*\(([^)]*)\)[^.]*/);
            if (match) {
                var values = match[1].split('#');
                var classNames = values[0];
                if (values[1]) {
                    var id = ' id="' + values[1] + '"';
                }
                return ' class="' + classNames + '"' + id;
            }
            return '';
        },

        langAttribute: function(text) {
            var match = text.match(/^[^\[]*\[([^\]]*)\][^.]*/);
            if (match) {
                return ' lang="' + match[1] + '"';
            }
            return '';
        },

        blockAttributes: function(text, attr) {
            return this.classAttribute(text) +
                this.styleAttribute(text, attr) +
                this.langAttribute(text);
        },

        pushListType: function(match) {
            // # -> ordered list, * -> unordered list
            var listType = match[1].match(/#/) ? 'ol' : 'ul';
            listTypes.push(listType);
            return listType;
        },

        popListType: function() {
            return listTypes.pop();
        },

        matchList: function(text) {
            return text.match(/^(#+|\*+)(\{[^}]*\})?\s+(.*)/);
        },

        /*
         * # numbered 1
         * ## numbered 2
         * * bulleted 1
         * ** bulleted 2
         */
        lists: function(text) {
            var match = this.matchList(text);
            if (!match) {
                return;
            }

            var listContent = this.inline(match[3]);

            if (!toHtml) {
                return listContent + '\n';
            }

            var attr = this.blockAttributes(text);

            // ol or ul
            var listType;

            if (inList) {
                if (match[1].length > inList) {
                    inList = match[1].length;
                    listType = this.pushListType(match);
                    return '\n<' + listType + '>\n<li' + attr + '>' + listContent;
                } else if (match[1].length < inList) {
                    inList--;
                    listType = this.popListType();
                    return '</li>\n</' + listType + '><li' + attr + '>' + listContent;
                } else if (match[1].length == inList) {
                    return '</li>\n<li' + attr + '>' + listContent;
                }
            } else {
                inList++;
                listType = this.pushListType(match);
                return '<' + listType + '>\n<li' + attr + '>' + listContent;
            }
        },

        matchTable: function(text) {
            return text.match(/^(<>|<|>|=|\^|-|~)*[^|]*\|(.*)\|\s*$/);
        },

        /* 
         * |_. head1 |_. head2 |
         * |   col1  |   col2  |
         */
        tables: function(text) {
            var match = this.matchTable(text);
            var result = '';
            var attr = '';

            if (match) {
                // table start
                if (!inTable) {
                    inTable++;
                    if (toHtml) {
                        result += '<table>\n';
                    }
                }

                attr = this.blockAttributes(text);

                if (toHtml) {
                    result += '<tr' + attr + '>\n';
                }

                var cells = match[2].split('|');

                const r = /^((<>|<|>|=|\^|\/\d+|-|~|\\\d+)*(\{([^}]*)\})?(\[([^]]*)\])?(\(([^)]*)\))?\.\s?)/;

                var i;
                for (i = 0; i < cells.length; i++) {
                    var cell = cells[i].trim();

                    // header(th) or data(td)
                    var cellType = 'td';
                    if (cell.match(/^_\./)) {
                        cell = cell.replace(/^_\.\s+/, '');
                        if (cell) {
                            cellType = 'th';
                        }
                    }

                    if (toHtml) {
                        match = cell.match(r);
                        attr = '';
                        if (match) {
                            cell = cell.replace(r, '');
                            attr += this.blockAttributes(cells[i], match[1][0]);
                            if (match[1]) {
                                if (match[1][0] === '\\') {
                                    attr += ' colspan="' + match[1].match(/\d+/)[0] + '"';
                                }
                                if (match[1][0] === '/') {
                                    attr += ' rowspan="' + match[1].match(/\d+/)[0] + '"';
                                }
                            }
                        }
                    }

                    var cellText = this.inline(cell);
                    if (toHtml) {
                        result += '<' + cellType + attr + '>' + cellText + '</' + cellType + '>';
                    } else {
                        result += cellText;
                        if (i < cells.length - 1) {
                            result += ',';
                        }
                    }
                } //for

                if (toHtml) {
                    result += '\n</tr>\n';
                } else {
                    result += '\n';
                }

                return result;
            } else {
                match = text.match(/^table([^.]*)?\./);
                if (match) {
                    inTable++;
                    if (toHtml) {
                        attr = this.blockAttributes(text);
                        return '<table' + attr + '>\n';
                    }
                }
            }
        },

        // h1. text
        headers: function(text) {
            var headerType = text.match(/^(h[1-6])([^.]*)?\.\s+/);
            if (headerType && headerType[1]) {
                return this.block(headerType[1], headerType[1], text);
            }
        },

        // bq. text
        blockquotes: function(text) {
            var quoteType = text.match(/^(bq)\.(:\S+)?\s+/);
            if (quoteType && quoteType[1]) {
                return this.block(quoteType[1], 'blockquote', text);
            }

            //TODO consider bq..
        },

        paragraphs: function(text) {
            // keep line feed
            if (!text || text.length === 0) {
                return '\n';
            }

            // More block-level tags required?
            var m = text.match(/<(blockquote|p|h[1-6]|pre|div|ul|ol|dir|menu|center|form|table|tr|td|tbody|th|thead|address|section|footer|title|meta|body|script|style|header|hgroup|br|dd|dl|dt|figure|fieldset|embed|col)>/i);
            if (m) {
                if (!text.match('</' + m[1])) {
                    inExistingBlock++;
                }
                return text + '\n';
            } else if (text.trim().match(/^<\//)) {
                inExistingBlock--;
                return text + '\n';
            } else if (inExistingBlock > 0) {
                return text + '\n';
            }
            var para = this.block('p', 'p', text);
            if (para) {
                return para;
            }

            text = this.inline(text);

            if (toHtml) {
                return '<p>' + text + '</p>\n';
            } else {
                return text + '\n';
            }
        },

        block: function(shorthand, tag, text) {
            var r = '^' + shorthand + '(<>|<|>|=|\\^|\\/\\d+|-|~|\\\\\\d+)*([^.]*)?\\.\\s+(.*)';
            var match = text.match(r);

            if (match) {
                text = this.inline(match[3]);

                if (toHtml) {
                    var attr = this.blockAttributes(text, match[1]);
                    return '<' + tag + attr + '>' + text + '</' + tag + '>\n';
                } else {
                    return text + '\n';
                }
            }
        },

        inline: function(text) {
            text = this.links(text);

            text = text.replace(/!(([a-zA-Z0-9]|\/|\?)[^!\s]+)\((.*)\)!?(?![^<]*<\/(code|pre))/g, toHtml ? '<img src="$1" alt="$3" />' : '$3');
            text = text.replace(/!(([a-zA-Z0-9]|\/|\?)[^!\s]+)!(?![^<]*<\/(code|pre))/g, toHtml ? '<img src="$1" alt="" />' : '');
            text = text.replace(/\*([^*]*)\*(?![^<]*>)/g, toHtml ? '<strong>$1</strong>' : '$1');
            text = text.replace(/_([^_]*)_(?![^<]*>)/g, toHtml ? '<em>$1</em>' : '$1');
            text = text.replace(/\+([^+]*)\+(?![^<]*>)/g, toHtml ? '<ins>$1</ins>' : '$1');
            text = text.replace(/-([^+]*)-(?![^<]*>)/g, toHtml ? '<del>$1</del>' : '$1');
            text = text.replace(/\^([^+]*)\^(?![^<]*>)/g, toHtml ? '<sup>$1</sup>' : '$1');
            text = text.replace(/~([^+]*)~(?![^<]*>)/g, toHtml ? '<sub>$1</sub>' : '$1');
            text = text.replace(/%([^+]*)%(?![^<]*>)/g, toHtml ? '<span>$1</span>' : '$1');
            text = text.replace(/@([^+]*)@(?![^<]*>)/g, toHtml ? '<code>$1</code>' : '$1');
            text = text.replace(/\?\?([^+]*)\?\?(?![^<]*>)/g, toHtml ? '<cite>$1</cite>' : '$1');

            text = this.replaceEntities(text);

            return text;
        },

        replaceEntities: function(text) {
            inPreformattedBlock = false;

            var words = text.split(' ');
            var result = [];
            var inTag = false;
            var doubleQuotes = 0;
            var singleQuotes = 0;

            var i;
            for (i = 0; i < words.length; i++) {
                var w = words[i];

                if (!inTag && w.match(/<./)) {
                    inTag = true;
                }

                if (!inPreformattedBlock && !inTag) {
                    if (!doubleQuotes && w.match(/"/)) {
                        doubleQuotes++;
                        w = w.replace(/"/, quotes.startDoubleQuote);
                    }

                    if (doubleQuotes && w.match(/"/)) {
                        w = w.replace(/"/, quotes.endDoubleQuote);
                        doubleQuotes--;
                    }

                    if (!singleQuotes && w.match(/^'/)) {
                        singleQuotes++;
                        w = w.replace(/'/, quotes.startSingleQuote);
                    }

                    if (singleQuotes && w.match(/'/)) {
                        w = w.replace(/'/, quotes.endSingleQuote);
                        singleQuotes--;
                    }

                    Object.keys(entities).forEach(function(entity) {
                        w = w.replace(new RegExp(entities[entity][0], 'g'),
                            entities[entity][1]);
                    });

                }
                result.push(w);

                if (!inPreformattedBlock && w.match(/<(code|pre)/)) {
                    inPreformattedBlock = true;
                } else if (inPreformattedBlock && w.match(/<\/(code|pre)/)) {
                    inPreformattedBlock = false;
                }

                if (inTag && w.match(/>/) && !w.match(/<[^\/]/)) {
                    inTag = false;
                }
            }

            return result.join(' ');
        },

        replaceStrAtIndex: function(text, index, to, r) {
            return text.substr(0, index) + r + text.substr(to);
        },

        links: function(text) {
            const re = /"([^"(]*)(\s+\(([^)]*)\))?":([^ ]*)/g;

            var m = re.exec(text);

            while (m != null) {
                // Ignore things in preformatted tags
                if (m[0].match(/(pre|code)[^>]*>/)) {
                    continue;
                }

                // Replace punctuation
                var p = m[4].match(/[.,]$/);
                if (p) {
                    m[4] = m[4].replace(/[,.]$/, '');
                } else {
                    p = '';
                }

                var link;
                if (m[3]) {
                    link = '<a title="' + m[3] + '" href="' + m[4] + '">' + m[1] + '</a>' + p;
                } else {
                    link = '<a href="' + m[4] + '">' + m[1] + '</a>' + p;
                }
                text = this.replaceStrAtIndex(text, m.index, m.index + m[0].length, link);

                m = re.exec(text);
            }

            return text;
        }

    };

}());

function require() {
    return Textile;
}