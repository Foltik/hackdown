const fakeSkillMatchResponse = {
  data: {
    companies: [
      {
        companyName: "Facebook",
        companyKey: "facebook",
        matchPercentage: 83,
        skills: {
          Python: 67,
          Java: 55,
          Git: 43,
          MongoDB: 40,
          "C++": 31,
        },
      },
      {
        companyName: "Google",
        companyKey: "google",
        matchPercentage: 69,
        skills: {
          "Google Cloud": 55,
          Java: 52,
          SQL: 31,
          Go: 25,
          "C++": 20,
        },
      },
      {
        companyName: "Salesforce",
        companyKey: "salesforce",
        matchPercentage: 65,
        skills: {
          Javascript: 79,
          Java: 58,
          iOS: 35,
          Haskell: 25,
          OCaml: 15,
        },
      },
      {
        companyName: "Netflix",
        companyKey: "netflix",
        matchPercentage: 60,
        skills: {
          Typescript: 79,
          Java: 52,
          Android: 41,
          "Distributed Systems": 31,
          C: 17,
        },
      },
    ],
  },
};

export default fakeSkillMatchResponse;
