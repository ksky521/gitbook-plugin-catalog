var cheerio = require('cheerio');
var _ = require('underscore');

// insert anchor link into section
var insertAnchors = function(section) {

    var $ = cheerio.load(section.content, {
        decodeEntities: false
    });

    var indexIds = [];
    var ids = {},
        map = {};
    $(':header').each(function(i, elem) {
        var header = $(elem);
        var title = header.html().trim();
        var id = encodeURIComponent(title);
        id = id ? id : header.attr('id');
        id = id.replace(/\%/g, '_').replace(/^\_/, '') + i;


        //开始生成快速导航
        var curLevel = elem.tagName.replace(/h/i, '');
        curLevel |= 0;
        curLevel = 10 - curLevel;
        ids[id] = {
            level: curLevel,
            title: title
        };

        var p, parentId;
        p = findParentId(curLevel, indexIds);
        map[p.id] = map[p.id] ? map[p.id] : [];
        map[p.id].push(id);
        parentId = p.id;
        header.attr('id', id);
        header.prepend('<a name="' + id + '" class="plugin-anchor" ' + 'href="#' + id + '">' + '<span class="fa fa-link"></span>' + '</a>');
        var obj = {
            id: id,
            pid: parentId,
            level: curLevel,
            title: title
        };
        ids[id] = obj;
        indexIds.push(obj);
    });
    var html = [];
    var navhtml = getListHtml(map.main, html);
    navhtml = '<div id="theo-nav"><div class="theo-content" id="theo-content">' + navhtml.join('\n') + '</div>' +
        '<a title="展开/关闭本页目录" href="####" id="theo-nav-btn" class="fa fa-list-ul" > </a>' +
        '<a title="返回顶部" href="####" id="theo-top-btn" class="fa fa-arrow-up"> </a>' +
        '</div>';

    section.content = navhtml + $.html();


    function getListHtml(items, html) {
        html.push('<ul>');
        items.forEach(function(v) {
            var list = ids[v];
            html.push('<li data-level="' + (10 - list.level) + '">');
            html.push('<a href="#' + list.id + '" data-id="' + list.id + '">' + list.title + '</a>');
            if (map[list.id] && map[list.id].length > 0) {
                html = getListHtml(map[list.id], html);
            }
            html.push('</li>');
        });
        html.push('</ul>');
        return html;
    }
};

module.exports = {
    book: {
        assets: ".",
        css: ["plugin.css"],
        js: ["plugin.js"]
    },
    hooks: {
        "page": function(page) { // before html generation

            sections = _.select(page.sections, function(section) {
                return section.type == 'normal';
            }); // pluck all normal sections -- as opposed to exercises?

            _.forEach(sections, insertAnchors);

            return page;
        }
    }
};

function findParentId(curLevel, ids) {
    var len = ids.length;
    while (len--) {
        var id = ids[len];
        if (id.level > curLevel) {
            return id;
        }
    }
    return {
        id: 'main',
        level: 9
    }
}
