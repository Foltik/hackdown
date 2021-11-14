const fakeFullSummaryResponse = {
  data: {
    companies: [
      { id: 1281288213, name: "Google", logo: "static/google.png" },
      { id: 1281288213, name: "Facebook", logo: "static/google.png" },
      { id: 1281288213, name: "Netflix", logo: "static/google.png" },
      { id: 1281288213, name: "Salesforce", logo: "static/google.png" },
      { id: 1281288213, name: "Amazon", logo: "static/google.png" },
    ],
    reviews: [
      {
        id: 12385815,
        company: "Google",
        source: "glassdoor",
        sentiment: 0.6,
        body: "blah blah blah blah",
        date: "101120059100",
      },
      {
        id: 89123812,
        company: "Google",
        source: "reddit",
        sentiment: 0.2,
        body: "blah blah blah blah",
        date: "10112006818283",
      },
    ],
    people: [
      {
        id: 12385857,
        company: "Google",
        degrees: ["BS CS", "MS CS"],
        skills: ["Python", "C++"],
      },
    ],
  },
};

export default fakeFullSummaryResponse;
