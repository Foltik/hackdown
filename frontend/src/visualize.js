const object = {
    companies: [{id: 1281288213, name: 'Google', logo: 'static/google.png'}],
    reviews: [
        {id: 12385815, company: 'Google', source: 'glassdoor', sentiment: 0.6, body: 'blah blooh blaah bleh', date: '101120059100'},
        {id: 89123812, company: 'Google', source: 'reddit', sentiment: 0.2, body: 'blee blasd blerg blorg', date: '10112006818283'}
    ],
    people: [
        {id: 12385857, company: 'Google', degrees: ['BS Computer Science', 'MS Computer Science'], skills: ['Python', 'C++']}
    ]
}

const data = object.reviews.reduce((acc, p) => {
    acc.push({
        company: p.company,
        sentiment: p.sentiment,
        body: p.body
    });
    return acc;
}, []);

const ndx = crossfilter(data);

const body_dim = ndx.dimension(d => d.body);
const body = dc.barChart('#wordchart')
.x(d3.scaleBand().range([0, 400]))
.xAxisLabel('words')
.yAxisLabel('numbers')
.dimension(body_dim)
.group(body_dim.group());

dc.renderAll();
