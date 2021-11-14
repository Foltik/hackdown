console.log("HI HI HI HI HI ");
console.log("HI HI HI HI HI ");
console.log("HI HI HI HI HI ");
console.log("HI HI HI HI HI ");
console.log("HI HI HI HI HI ");
console.log("HI HI HI HI HI ");

const companies = ['Google', 'Amazon', 'Facebook', 'Microsoft', 'Apple'];

const rand_id = () => Math.floor(Math.random() * 1000000)
const rand_choice = a => a[Math.floor(Math.random() * a.length)]

const data = {
    companies: companies.map(name => ({id: rand_id(), name, logo: `static/${name}`})),
    reviews: companies.reduce((acc, name) => [
        ...acc,
        ...Array(20).fill().map(() => ({
            id: rand_id(),
            company: name,
            source: rand_choice(['glassdoor', 'reddit']),
            sentiment: Math.random(),
            body: 'It TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy.',
            date: '',
        })),
    ], []),
    people: companies.reduce((acc, name) => [
        ...acc,
        ...Array(5).fill().map(() => ({
            id: rand_id(),
            company: name,
            degrees: Array(Math.floor(Math.random() * 3)).fill().map(() => rand_choice(['MS', 'BS'])),
            skills: Array(Math.floor(Math.random() * 5)).fill().map(() => rand_choice([
                'C++',
                'C',
                'Java',
                'Internet',
                'Linux',
                'Git',
                'Ligma',
                'Python',
                'React',
                'Javascript',
                'PHP (bad)'
            ])),
        }))
    ], [])
}

dc.wordCloud = function(parent, chartGroup) {
    var WORD_CLASS = "dc-cloud-word",
        _chart = dc.colorChart(dc.baseChart({})),
        _size = [400, 400],
        _padding = 1,
        _timeInterval = 10,
        _duration = 500,
        _font = "Impact",
        _scale = d3.scaleLog().range([10, 20]),
        _spiral = 'archimedean',
        _selectedWords = null,
        // _fontSize = function(d) { return console.log(d.value) || _scale(+d.value); },
        // _fontSize = function(d) { return _scale(+d.value); },
        _fontSize = function(d) { return console.log(+d.value) || Math.sqrt(+d.value); },
        _text = function(d) { return d.key; },
        _rotate = function(d) { return 0; },
        _onClick = _chart.onClick,  //function(d) {_chart.filter(_text(d));},
        // Containers
        _g, _fg, _bg, _tags,
        // From Jonathan Feinberg's cue.language, see lib/cue.language/license.txt.
        _maxLength = 20,
        _maxWords = 200,
        //If you modify
        words = [],
        _stopWords = /^(i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall)$/,
        _punctuation = /[!"&()*+,-\.\/:;<=>?\[\\\]^`\{|\}~]+/g,
        //_wordSeparators can be modified with the splitAt() method.
        _wordSeparators = /[\s\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g,
        //if you allow commas internal to your "words", the default lumping by comma can be trouble. Use the lumper() method to change.
        _lumper = ",",
        _searchBreak = "("+_punctuation.source+"|"+_wordSeparators.source+")",
        discard = /^(@|https?:)/,
        htmlTags = /(<[^>]*?>|<script.*?<\/script>|<style.*?<\/style>|<head.*?><\/head>)/g,
        _normalize = function(d) { return d; };

    // Note - there's a bug (?) in the d3.layout.wordCloud engine that
    // will lose a word that is disproportionately large for the cloud.
    // It's possible to track when this occurs by checking the length of
    // tags pre-render and post-render
    var _preRenderTagLength = -1;

    _chart.width(_size[0]);
    _chart.height(_size[1]);

    // Accessors
    _chart.size = function(s) {
        if (!arguments.length) return _size;
        _size = s;
        _chart.width(_size[0]);
        _chart.height(_size[1]);
        return _chart;
    };

    _chart.splitAt = function(s) {
        if (!arguments.length) return _wordSeparators;
        _wordSeparators = s;
        return _chart;
    };

    _chart.stopWords = function(s) {
        if (!arguments.length) return _stopWords;
        _stopWords = s;
        return _chart;
    };

    _chart.punctuation = function(p) {
        if (!arguments.length) return _punctuation;
        _punctuation = p;
        return _chart;
    };

    _chart.lumper = function(p) {
        if (!arguments.length) return _lumper;
        _lumper = p;
        return _chart;
    };

    _chart.normalize = function(n) {
        if (!arguments.length) return _normalize;
        _normalize = n;
        return _chart;
    };

    _chart.maxWords = function(w) {
        if (!arguments.length) return _maxWords;
        _maxWords = w;
        return _chart;
    };

    _chart.maxLength = function(w) {
        if (!arguments.length) return _maxLength;
        _maxLength = w;
        return _chart;
    };

    _chart.onClick = function(h) {
        if (!arguments.length) return _onClick;
        _onClick = h;
        return _chart;
    };

    _chart.scale = function(s) {
        if (!arguments.length) return _scale;
        _scale = s;
        return _chart;
    };

    _chart.duration = function(d) {
        if (!arguments.length) return _duration;
        _duration = d;
        return _chart;
    };

    //Allow dump of internal tags, but not direct modification
    _chart.tags = function(d) {
        if (!arguments.length) return _tags;
        //no-op
        return _chart;
    };

    _chart.timeInterval = function(t) {
        if (!arguments.length) return _timeInterval;
        _timeInterval = t;
        return _chart;
    };

    _chart.font = function(f) {
        if (!arguments.length) return _font;
        _font = f;
        return _chart;
    };

    _chart.fontSize = function(f) {
        if (!arguments.length) return _fontSize;
        _fontSize = f;
        return _chart;
    };

    _chart.rotate = function(r) {
        if (!arguments.length) return _rotate;
        _rotate = r;
        return _chart;
    };

    _chart.padding = function(p) {
        if (!arguments.length) return _padding;
        _padding = p;
        return _chart;
    };

    _chart.text = function(t) {
        if (!arguments.length) return _text;
        _text = t;
        return _chart;
    };

    _chart.spiral = function(s) {
        // 'archimedean' or 'rectangular'
        if (!arguments.length) return _spiral;
        _spiral = s;
        return _spiral;
    };

    // Read only properties
    _chart.cx = function () {
        return _chart.width()>>1;
    };

    _chart.cy = function () {
        return _chart.height()>>1;
    };


    // Rendering & Drawing helpers
    function drawChart() {
        getCloudWords();

        _preRenderTagLength = _tags.length;

        var cloud = makeCloud();

        words = [];

        cloud.stop()
            .words(_tags.slice(0, _maxWords), function(d) {
                return d.text.toLowerCase();
            })
            .start();

    }

    function makeCloud() {
        return d3.layout.cloud()
            .size(_size)
            .on('end', drawWords)
            .timeInterval(_timeInterval)
            .text(_text)
            .font(_font)
            .fontSize(_fontSize)
            .rotate(_rotate)
            .padding(_padding)
            .spiral(_spiral);
    }

    function drawWords(data, bounds) {
        // Adapted from Jason Davies' demo app
        if(_g) {
            scale = bounds ? Math.min(
                _size[0] / Math.abs(bounds[1].x - _size[0] / 2),
                _size[0] / Math.abs(bounds[0].x - _size[0] / 2),
                _size[1] / Math.abs(bounds[1].y - _size[1] / 2),
                _size[1] / Math.abs(bounds[0].y - _size[1] / 2)) / 2 : 1;
            words = data;

            if(words.length!=_preRenderTagLength) {
                //console.log( "Tag cloud lost "+
                //    (_preRenderTagLength-words.length)
                //    +" words.");
            }

            var text = _fg.selectAll('text')
                .data(words, function(d) {
                    return d.text.toLowerCase();
                });

            _translator = function(d) {
                return 'translate('+ [d.x, d.y] +')rotate('+ d.rotate +')';
            };
            _sizer = function(d) {
                return _fontSize(d) +"px";
            };

            // New texts
            text.transition()
                .duration(_duration)
                .attr('transform', _translator)
                .style('font-size', _sizer);

            text.enter().append('text')
                    .attr('class', WORD_CLASS)
                    .style('font-size', _sizer)
                    .style('font-family', _font)
                    .style('fill', _chart.getColor)
                    //.style('opacity', 1e-6)
                    .style('cursor', 'pointer')
                    .text(_text)
                    .attr('text-anchor', 'middle')
                    .attr('transform', _translator)
                    .on('click', _onClick)
                .transition()
                    .duration(_duration);
                    //.style('opacity', 1);

            var exitGroup = _bg.append("g")
                .attr("transform", _fg.attr("transform"));

            var exitGroupNode = exitGroup.node();

            text.exit().each(function() {
                exitGroupNode.appendChild(this);
            });

            exitGroup.transition()
                .duration(_duration)
                .style("opacity", 1e-6)
                .remove();

            _fg.transition()
                .delay(_duration)
                .duration(.75*_duration)
                .attr("transform",
                        "translate("+ [_chart.cx(), _chart.cy()] +")"
                        +"scale("+scale+")");
        }
    }

    function getCloudWords() {
        var texts = _chart.dimension().top(Infinity),
            lump = '',
            _valueAccessor = _chart.valueAccessor();

        texts.forEach(function(text) {
            lump += _lumper + _valueAccessor(text);
        });

        parseText(lump);
    }

    function parseText(text) {
        // Thanks to Jason Davies. Stores word counts in `tags`
        _tags = {};
        var cases = {};

        text.split(_wordSeparators).forEach(function(word) {
            if (discard.test(word)) {
                return;
            }
            word = _normalize(word);

            word = word.replace(_punctuation, "");

            if (_stopWords.test(word.toLowerCase())) {
                return;
            }

            word = word.substr(0, _maxLength);

            if(!word.length) {
                return;
            }

            cases[word.toLowerCase()] = word;
            _tags[word = word.toLowerCase()] = (_tags[word] || 0) + 1;
        });

        _tags = d3.entries(_tags).sort(function(a, b) {
            return b.value - a.value;
        });

        _tags.forEach(function(d) { d.key = cases[d.key]; });
    }

    _chart.removeFilterHandler(function (filters, filter) {
        var _idx=filters.indexOf(filter);
        filters.splice(_idx, 1);
        return filters;
    });
    _chart.hasFilterHandler(function (filters, filter) {
        if (filter === null || typeof(filter) === 'undefined') {
            return filters.length > 0;
        }
        return (filters.indexOf(filter) > -1)
    });
    _chart.filterHandler(function(dimension, filters) {
        dimension.filter(null);
        _selectedWords = filters.join(", ");

        if (filters.length === 0) {
            dimension.filter(null);
        } else {
            var _fs = "(";
            for(var f = 0; f < filters.length; f++) {
                if(_fs.length>1) {
                    _fs+="|"
                }
                _fs += filters[f].replace(/\s+/, _searchBreak);
            }
            _fs+=")";

            var re = new RegExp(_fs, 'ig'),
                _f = function(r) {
                    return re.test(r);
                };

            dimension.filterFunction(_f);
        }

        return filters;
    });

    _chart.turnOnControls = function () {
        _chart.selectAll(".reset")
            .style("display", null);
        _chart.selectAll(".filter")
            .text(_selectedWords)
            .style("display", null);

        return _chart;
    };

    // Make rendering and drawing available to dc.js
    _chart._doRender = function() {
        _chart.resetSvg();

        _g = _chart.svg();
        _fg = _g.append('g')
                .attr('transform',
                        'translate('+ [_chart.cx(), _chart.cy()] +')');
        _bg = _g.append('g');

        drawChart();
        return _chart;
    };

    _chart._doRedraw = function() {
        drawChart();
        return _chart;
    };

    // Anchor the chart
    return _chart.anchor(parent, chartGroup);
};

let f = (a, b) => [].concat(...a.map(a => b.map(b => [].concat(a, b))));
let cartesian = (a, b, ...c) => b ? cartesian(f(a, b), ...c) : a;``

const rndx = crossfilter(data.reviews);
const pndx = crossfilter(data.people.reduce((acc, p) => [
    ...acc,
    ...cartesian(p.degrees, p.skills).map(([degree, skill]) => ({id: p.id, company: p.company, degree, skill}))
], []));

const company_dim_r = rndx.dimension(d => d.company);
const company_group_r = company_dim_r.group();
const company_dim_p = pndx.dimension(d => d.company);
const company_group_p = company_dim_p.group();

const skill_dim = pndx.dimension(d => d.skill);
const skill_group = skill_dim.group();

const sentiment_dim = rndx.dimension(d => d.sentiment > 0.5 ? 'Positive' : 'Negative');
const sentiment_group = sentiment_dim.group();

const body_dim = rndx.dimension(d => d.body);
const body_group = body_dim.group();

// const degree_dim = pndx.dim(d => d.degree);

// dc.pieChart('#wordchart')
//     .dimension(sentiment_dim)
//     .group(sentiment_group);

window.dostuff = () => {
    thing = dc.wordCloud('#a')
        .valueAccessor(d => d.body)
        .rotate(() => (Math.random() * 120) - 60)
        .dimension(body_dim)
        .group(body_group);

    // const body = dc.barChart('#wordchart')
    //     .x(d3.scaleBand())
    //     .xAxisLabel('company')
    //     .yAxisLabel('number')
    //     .dimension(company_dim)
    //     .group(company_dim.group());

    dc.renderAll();
}
