dc.wordCloud = function(parent, chartGroup) {
    var WORD_CLASS = "dc-cloud-word",
        _chart = dc.colorChart(dc.baseChart({})),
        _size = [400, 400],
        _padding = 1,
        _timeInterval = 10,
        _duration = 500,
        _font = "Impact",
        _scale = d3.scaleLog().range([20, 40]),
        _spiral = 'archimedean',
        _selectedWords = null,
        // _fontSize = function(d) { return console.log(d.value) || _scale(+d.value); },
        _fontSize = function(d) { return _scale(+d.value); },
        // _fontSize = function(d) { Math.sqrt(d.value); },
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

const data = {
    "reviews": [
      {
        "company": "netflix",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great company",
        "date": 1633233600
      },
      {
        "company": "netflix",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Fast paced, niche, performance based culture",
        "date": 1631937600
      },
      {
        "company": "netflix",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great",
        "date": 1633060800
      },
      {
        "company": "netflix",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Candid, intentional, empowering",
        "date": 1631678400
      },
      {
        "company": "netflix",
        "source": "glassdoor",
        "sentiment": 0.5859,
        "body": "Amazing company all around",
        "date": 1631592000
      },
      {
        "company": "netflix",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Netflix is a great company",
        "date": 1631592000
      },
      {
        "company": "netflix",
        "source": "glassdoor",
        "sentiment": 0.3716,
        "body": "Great company and people, but don't expect career development",
        "date": 1631073600
      },
      {
        "company": "netflix",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Experience",
        "date": 1631160000
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "good  company",
        "date": 1636606800
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": -0.296,
        "body": "Open, fast, no bs",
        "date": 1395028800
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.8121,
        "body": "Fast paced company with high expectations, but incredibly fair. You won't a place that cares more about it's people.",
        "date": 1487221200
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.6124,
        "body": "Pleasantly Surprised",
        "date": 1455598800
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.3818,
        "body": "People Focused",
        "date": 1590292800
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Lives up to the hype",
        "date": 1632196800
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.7096,
        "body": "Work with the smart, driven and caring people - pave your path",
        "date": 1633320000
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.6369,
        "body": "Best employer so far",
        "date": 1636434000
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": -0.743,
        "body": "Good pay, horrible environment and dead end path",
        "date": 1635566400
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.5106,
        "body": "Careful what you wish for...",
        "date": 1633838400
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "good  company",
        "date": 1636606800
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": -0.296,
        "body": "Open, fast, no bs",
        "date": 1395028800
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.8121,
        "body": "Fast paced company with high expectations, but incredibly fair. You won't a place that cares more about it's people.",
        "date": 1487221200
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.6124,
        "body": "Pleasantly Surprised",
        "date": 1455598800
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.3818,
        "body": "People Focused",
        "date": 1590292800
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Lives up to the hype",
        "date": 1632196800
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.7096,
        "body": "Work with the smart, driven and caring people - pave your path",
        "date": 1633320000
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.6369,
        "body": "Best employer so far",
        "date": 1636434000
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": -0.743,
        "body": "Good pay, horrible environment and dead end path",
        "date": 1635566400
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.5106,
        "body": "Careful what you wish for...",
        "date": 1633838400
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.9062,
        "body": "Smart People, Great Benefits, Good Balance",
        "date": 1636520400
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.2708,
        "body": "Great place to work overall, but it can be a little aggressive at times",
        "date": 1634616000
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.6754,
        "body": "Not horrible, not great, just kinda of meh-ta",
        "date": 1636779600
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Sometimes you laugh sometimes you cry, but you couldn't ask for a better place to learn",
        "date": 1632369600
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.6369,
        "body": "Best company in my career so far, at least in 2017",
        "date": 1635998400
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.6588,
        "body": "3+ Awesome Years at FB!",
        "date": 1625025600
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "great company",
        "date": 1636171200
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Technical Recruiter",
        "date": 1636257600
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Inclusive Culture & Never-ending Learning",
        "date": 1635652800
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.7906,
        "body": "Great place to work as long as you have good managers/teammates",
        "date": 1631592000
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.4927,
        "body": "Generally very good",
        "date": 1635480000
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great company",
        "date": 1635134400
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.6908,
        "body": "Best place to work, but only if you can devote your life to it",
        "date": 1636693200
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "Good company",
        "date": 1635393600
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "EH",
        "date": 1636606800
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Metastasizing",
        "date": 1636520400
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.4215,
        "body": "Nice",
        "date": 1636606800
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great engineering culture",
        "date": 1636434000
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.8807,
        "body": "A great place to work that takes good care of people",
        "date": 1634875200
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "good boss",
        "date": 1634875200
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.3818,
        "body": "Professional growth on fast track",
        "date": 1633320000
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Your experience depends on your manager",
        "date": 1634961600
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.5719,
        "body": "Great pay for walking on eggshells",
        "date": 1632110400
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "The future of work is here",
        "date": 1635393600
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great company",
        "date": 1635134400
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great Place to work",
        "date": 1635739200
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": -0.296,
        "body": "Company Ethics Questionable",
        "date": 1636606800
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.2846,
        "body": "Fun but work",
        "date": 1635825600
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0.4939,
        "body": "Exciting work place",
        "date": 1632456000
      },
      {
        "company": "facebook",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "EH",
        "date": 1636606800
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great company to work",
        "date": 1636693200
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Moving at the speed of light, burn out is inevitable",
        "date": 1371787200
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.8689,
        "body": "Great balance between big-company security and fun, fast-moving projects",
        "date": 1399694400
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.5859,
        "body": "Amazing company",
        "date": 1636606800
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Can't imagine myself leaving",
        "date": 1636693200
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "great place to work",
        "date": 1636693200
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Many pros but some cons",
        "date": 1636693200
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great Company",
        "date": 1636693200
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great company",
        "date": 1636347600
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "Good for starting a career",
        "date": 1636347600
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great company to work",
        "date": 1636693200
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Moving at the speed of light, burn out is inevitable",
        "date": 1371787200
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.8689,
        "body": "Great balance between big-company security and fun, fast-moving projects",
        "date": 1399694400
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.5859,
        "body": "Amazing company",
        "date": 1636606800
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Can't imagine myself leaving",
        "date": 1636693200
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "great place to work",
        "date": 1636693200
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Many pros but some cons",
        "date": 1636693200
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great Company",
        "date": 1636693200
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great company",
        "date": 1636347600
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "Good for starting a career",
        "date": 1636347600
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Engineer",
        "date": 1636606800
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Google",
        "date": 1636606800
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Go for it!",
        "date": 1636606800
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great",
        "date": 1636606800
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "Good company culture",
        "date": 1636606800
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.6369,
        "body": "Tha Best",
        "date": 1636606800
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "Good Environment",
        "date": 1636693200
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "Good",
        "date": 1636520400
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "It was good",
        "date": 1636520400
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Google",
        "date": 1636520400
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "Good",
        "date": 1636520400
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.4215,
        "body": "Nice",
        "date": 1636606800
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.4215,
        "body": "Nice working conditions",
        "date": 1636606800
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.6369,
        "body": "Best company to work for",
        "date": 1636434000
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.5859,
        "body": "Amazing",
        "date": 1636434000
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.2023,
        "body": "Fine place to work",
        "date": 1636434000
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.5719,
        "body": "Perfect",
        "date": 1636434000
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great place to start your career.",
        "date": 1636434000
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "Good",
        "date": 1636084800
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "great company",
        "date": 1636347600
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.6369,
        "body": "Best company to work for",
        "date": 1636434000
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "Good",
        "date": 1636520400
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.6369,
        "body": "I love my company",
        "date": 1636257600
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.7684,
        "body": "Amazing if not for a fatal flaw.",
        "date": 1630641600
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "Good for starting a career",
        "date": 1636347600
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great Job",
        "date": 1636084800
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.5859,
        "body": "Amazing",
        "date": 1636434000
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.5719,
        "body": "Perfect",
        "date": 1636434000
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": -0.5993,
        "body": "Prestigious, fascinating, great benefits but EXHAUSTING and poor work/life balance",
        "date": 1626580800
      },
      {
        "company": "google",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "gUP is a great team",
        "date": 1636347600
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Mostly depends on management",
        "date": 1633147200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "You Get What You Put In",
        "date": 1452402000
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": -0.25,
        "body": "Exciting Work, Abusive Culture",
        "date": 1455944400
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.8428,
        "body": "Amazing company and the most driven and smartest of the people",
        "date": 1543813200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Overall a Great Company with High Standards",
        "date": 1598760000
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.5859,
        "body": "An Amazing Place to Work",
        "date": 1519362000
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.0772,
        "body": "Can be amazing for some people, horrible for others",
        "date": 1387256400
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": -0.128,
        "body": "We are now in a world where we are condescended to by our inferiors",
        "date": 1490241600
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "Good employer",
        "date": 1636693200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.1779,
        "body": "Amazon new hire (< 3 months)",
        "date": 1636606800
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Mostly depends on management",
        "date": 1633147200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "You Get What You Put In",
        "date": 1452402000
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": -0.25,
        "body": "Exciting Work, Abusive Culture",
        "date": 1455944400
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.8428,
        "body": "Amazing company and the most driven and smartest of the people",
        "date": 1543813200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Overall a Great Company with High Standards",
        "date": 1598760000
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.5859,
        "body": "An Amazing Place to Work",
        "date": 1519362000
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.0772,
        "body": "Can be amazing for some people, horrible for others",
        "date": 1387256400
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": -0.128,
        "body": "We are now in a world where we are condescended to by our inferiors",
        "date": 1490241600
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "Good employer",
        "date": 1636693200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.1779,
        "body": "Amazon new hire (< 3 months)",
        "date": 1636606800
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great place to learn, churn n burn culture in finance",
        "date": 1490760000
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great team, I've grown professionally, you get what you give",
        "date": 1636347600
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.5267,
        "body": "IT Support Associate II @ Amazon",
        "date": 1635393600
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.4215,
        "body": "Plenty of learning opportunity in a massively scaled environment",
        "date": 1636779600
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.7096,
        "body": "Innovative and driven company, with respectful and world-class colleagues",
        "date": 1635480000
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.6903,
        "body": "So big..., but they really seem to care",
        "date": 1636084800
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.6369,
        "body": "The absolute greatest part time job ever",
        "date": 1633492800
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.6696,
        "body": "Best job I've had!",
        "date": 1634356800
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.2846,
        "body": "Hard, but sometimes worth it",
        "date": 1635739200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Different Organizations, Different Pros/Cons",
        "date": 1634097600
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.34,
        "body": "Job security is key",
        "date": 1636779600
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.1779,
        "body": "Amazon",
        "date": 1636779600
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": -0.1027,
        "body": "Hard work",
        "date": 1636779600
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.1779,
        "body": "Amazon driver",
        "date": 1636779600
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Internship",
        "date": 1636779600
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "Easy work",
        "date": 1636779600
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "New hire review",
        "date": 1636693200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.4404,
        "body": "Good",
        "date": 1636693200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": -0.6808,
        "body": "Forget the negative media press... this company operates with transparency and accountability",
        "date": 1636693200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great company",
        "date": 1636693200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.1779,
        "body": "Amazon",
        "date": 1636693200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great Place to work if you really need a job to start somewhere",
        "date": 1636693200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Goal Getting",
        "date": 1636779600
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Decent pay/Decent work",
        "date": 1636693200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Flex job",
        "date": 1636693200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "not ad",
        "date": 1636693200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Amazonians Rock",
        "date": 1636693200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0.6249,
        "body": "Great place to develops skills on large scale projects",
        "date": 1636693200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": 0,
        "body": "Customer Service Rep",
        "date": 1636693200
      },
      {
        "company": "amazon",
        "source": "glassdoor",
        "sentiment": -0.2475,
        "body": "Easy, flexible, but very boring",
        "date": 1636693200
      }
    ],
    "people": [
        {
        "name": "Faris Ibrahim",
        "company": "google",
        "years_of_experience": 0,
        "skills": [
            "Leadership",
            "JavaScript",
            "Python",
            "Research",
            "Android Development",
            "C++",
            "Java"
        ],
        "schools_attended": [
            "Stevens Institute of Technology"
        ],
        "degrees": [
            "Bachelor's of Engineering"
        ]
        },
        {
        "name": "Jenny Sheng",
        "company": "google",
        "years_of_experience": 1,
        "skills": [
            "GitHub",
            "Google App Engine",
            "Google Cloud Platform (GCP)",
            "Chinese",
            "Flask",
            "RxJS",
            "Java",
            "Spring Framework",
            "PyTorch",
            "Spring Data",
            "Maven",
            "Thymeleaf",
            "Spring Boot",
            "Mockito",
            "Leadership",
            "Python",
            "English",
            "R",
            "Jasmine Framework",
            "Angular",
            "French",
            "Teamwork",
            "C",
            "JUnit",
            "SQL",
            "HTML/CSS",
            "Huggingface",
            "TypeScript",
            "Git"
        ],
        "schools_attended": [
            "Princeton Univerisity",
            "East Brunswick High School"
        ],
        "degrees": [
            "Bachelor of Science and Engineering - BSE"
        ]
        },
        {
        "name": "Jason Tung",
        "company": "google",
        "years_of_experience": 2,
        "skills": [
            "C (Programming Language)",
            "JavaScript",
            "MongoDB",
            "SQL",
            "React.js",
            "Firebase",
            "Python (Programming Language)",
            "OCaml",
            "Express.js",
            "Java"
        ],
        "schools_attended": [
            "Cornell University",
            "Stuyvesant High School"
        ],
        "degrees": [
            "Bachelor of Science - BS",
            "Advanced Regents Diploma with Honors"
        ]
        },
        {
        "name": "Xingjian Wu",
        "company": "google",
        "years_of_experience": 2,
        "skills": [
            "TensorFlow",
            "Python",
            "C",
            "LaTeX",
            "Linux",
            "SQL",
            "Chinese",
            "Golang",
            "Android Studio",
            "C++",
            "Japanese",
            "Amazon Web Services (AWS)",
            "Spanish",
            "Java"
        ],
        "schools_attended": [
            "Columbia University in the City of New York",
            "Columbia University in the City of New York",
            "Franklin & Marshall College"
        ],
        "degrees": [
            "Master's degree",
            "Bachelor of Science - BS",
            "Bachelor of Arts - BA"
        ]
        },
        {
        "name": "Lian Bourret",
        "company": "google",
        "years_of_experience": 0,
        "skills": [
            "Communication",
            "Microsoft Office",
            "Python (Programming Language)",
            "Calculus",
            "Programming Languages",
            "Customer Service",
            "Mandarin",
            "Java"
        ],
        "schools_attended": [
            "Wellesley College",
            "St. Andrew's School"
        ],
        "degrees": [
            "Bachelor's degree",
            "High School Diploma"
        ]
        },
        {
          "name": "Farad Ibrahim",
          "company": "salesforce",
          "years_of_experience": 5,
          "skills": [
              "Python",
              "Research",
              "C++",
              "Java"
          ],
          "schools_attended": [
              "Columbia University"
          ],
          "degrees": [
              "Bachelor's of Engineering"
          ]
          },
          {
          "name": "Jenny Sheng",
          "company": "salesforce",
          "years_of_experience": 1,
          "skills": [
              "Maven",
              "Thymeleaf",
              "Spring Boot",
              "Mockito",
              "Leadership",
              "Python",
              "English",
              "R",
              "C",
              "JUnit",
              "SQL",

          ],
          "schools_attended": [
              "Princeton Univerisity",
              "East Brunswick High School"
          ],
          "degrees": [
              "Bachelor of Science and Engineering - BSE"
          ]
          },
          {
          "name": "Jason Tung",
          "company": "salesforce",
          "years_of_experience": 9,
          "skills": [
              "Firebase",
              "Python (Programming Language)",
              "OCaml",
              "Express.js",
              "Java"
          ],
          "schools_attended": [
              "Cornell University",
              "Stuyvesant High School"
          ],
          "degrees": [
              "Bachelor of Science - BS",
              "Advanced Regents Diploma with Honors"
          ]
          },
          {
         "name": "Xingjian Wu",
          "company": "salesforce",
          "years_of_experience": 2,
          "skills": [
              "TensorFlow",
              "Python",
              "C",
              "LaTeX",
              "Linux",
              "SQL",
              "Chinese",
              "Java"
          ],
          "schools_attended": [
              "Columbia University in the City of New York",
              "Columbia University in the City of New York",
              "Franklin & Marshall College"
          ],
          "degrees": [
              "Master's degree",
              "Bachelor of Science - BS",
              "Bachelor of Arts - BA"
          ]
          },
          {
          "name": "Lian Bourret",
          "company": "salesforce",
          "years_of_experience": 0,
          "skills": [
              "Programming Languages",
              "Customer Service",
              "Mandarin",
              "Java"
          ],
          "schools_attended": [
              "Wellesley College",
              "St. Andrew's School"
          ],
          "degrees": [
              "Bachelor's degree",
              "High School Diploma"
          ]
          },
          {
            "name": "Farad Ibrahim",
            "company": "netflix",
            "years_of_experience": 3,
            "skills": [
                "Javascript",
                "Research",
                "C++",
                "Java"
            ],
            "schools_attended": [
                "Columbia University"
            ],
            "degrees": [
                "Bachelor's of Engineering"
            ]
            },
            {
            "name": "Jenny Sheng",
            "company": "netflix",
            "years_of_experience": 9,
            "skills": [
                "Maven",
                "Thymeleaf",
                "Spring Boot",
                "Mockito",
                "Leadership",
                "Python",
                "English",
                "R",
                "C",
                "JUnit",
                "SQL",
  
            ],
            "schools_attended": [
                "Princeton Univerisity",
                "East Brunswick High School"
            ],
            "degrees": [
                "Bachelor of Science and Engineering - BSE"
            ]
            },
            {
            "name": "Jason Tung",
            "company": "salesforce",
            "years_of_experience": 9,
            "skills": [
                "Firebase",
                "Python (Programming Language)",
                "OCaml",
                "Express.js",
                "Java"
            ],
            "schools_attended": [
                "Cornell University",
                "Stuyvesant High School"
            ],
            "degrees": [
                "Bachelor of Science - BS",
                "Advanced Regents Diploma with Honors"
            ]
            },
            {
           "name": "Xingjian Wu",
            "company": "salesforce",
            "years_of_experience": 2,
            "skills": [
                "TensorFlow",
                "Python",
                "C",
                "LaTeX",
                "Linux",
                "SQL",
                "Chinese",
                "Java"
            ],
            "schools_attended": [
                "Columbia University in the City of New York",
                "Columbia University in the City of New York",
                "Franklin & Marshall College"
            ],
            "degrees": [
                "Master's degree",
                "Bachelor of Science - BS",
                "Bachelor of Arts - BA"
            ]
            },
            {
            "name": "Lian Bourret",
            "company": "salesforce",
            "years_of_experience": 0,
            "skills": [
                "Programming Languages",
                "Customer Service",
                "Mandarin",
                "Java"
            ],
            "schools_attended": [
                "Wellesley College",
                "St. Andrew's School"
            ],
            "degrees": [
                "Bachelor's degree",
                "High School Diploma"
            ]
}]};

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

const sentiment_dim = rndx.dimension(d => d.sentiment > 0.5 ? 'Positive' : 'Negative');
const sentiment_group = sentiment_dim.group();

const body_dim = rndx.dimension(d => d.body);
const body_group = body_dim.group();

const degree_dim = pndx.dimension(d => d.degree);
const degree_group = degree_dim.group();

const skill_dim = pndx.dimension(d => d.skill);
const skill_group = skill_dim.group();

const school_dim = pndx.dimension(d => d.schools_attended?.length ? d.schools_attended[0] : 'None');
const school_group = skill_dim.group();

window.dostuff = () => {
    dc.wordCloud('#a')
        .valueAccessor(d => d.body)
        .rotate(() => [-30, -15, 0, 15, 30][Math.floor(Math.random() * 5)])
        .dimension(body_dim)
        .group(body_group);

    // dc.barChart('#b');

    dc.barChart('#c')
        .width(480)
        .height(350)
        .legend(dc.legend())

    dc.pieChart('#d')
        .width(480)
        .height(350)
        .legend(dc.legend())
        .slicesCap(10)
        .dimension(degree_dim)
        .group(degree_group);

    dc.pieChart('#e')
        .width(480)
        .height(350)
        .legend(dc.legend())
        .slicesCap(10)
        .dimension(skill_dim)
        .group(skill_group);

    dc.pieChart('#f')
        .width(480)
        .height(350)
        .legend(dc.legend())
        .slicesCap(10)
        .dimension(school_dim)
        .group(school_group);

    dc.renderAll();
};

window.companystuff = c => {
    c = c.toLowerCase();
    company_dim_p.filter(c);
    company_dim_r.filter(c);

    dc.renderAll();
}