/* =====================================================================
   EDIT ONLY THIS FILE. The whole site is built from it.
   Photos go in /images. Use paths like "images/p1.jpg".
   Leave a cover as "" and a generated colour panel is shown instead.
   ===================================================================== */
window.SITE = {
  name: "Your Name",
  role: "Your role, City",
  tagline: "One line about what you make and how it feels.",
  description: "One sentence about your work, used for search results and link previews.",

  about: {
    title: "About",
    text: [
      "Write two or three short paragraphs about how you work and what you care about.",
      "A second paragraph can cover your background and who you like to work with."
    ],
    skills: ["Skill one", "Skill two", "Skill three", "Skill four"],
    recognition: ["Award or feature, 2026", "Award or feature, 2025"]
  },

  contact: {
    lead: "Have a project in mind? I’d love to hear about it.",
    email: "hello@example.com",
    socials: [
      { label: "Instagram", url: "https://www.instagram.com/" },
      { label: "LinkedIn",  url: "https://www.linkedin.com/" }
    ]
  },

  /* One entry per project. They fly past in this order.
     cover: image shown on the floating panel (any size, about 3:2 works best).
     images: extra images in the project window. url: optional live link. */
  projects: [
    { id: "one",   title: "Project One",   client: "Client", year: 2026, tags: ["Tag", "Tag"], cover: "", images: ["", ""], url: "",
      text: "A short description of the brief, your role and the result." },
    { id: "two",   title: "Project Two",   client: "Client", year: 2026, tags: ["Tag"],        cover: "", images: ["", ""], url: "",
      text: "A short description of the brief, your role and the result." },
    { id: "three", title: "Project Three", client: "Client", year: 2025, tags: ["Tag", "Tag"], cover: "", images: ["", ""], url: "",
      text: "A short description of the brief, your role and the result." },
    { id: "four",  title: "Project Four",  client: "Client", year: 2025, tags: ["Tag"],        cover: "", images: ["", ""], url: "",
      text: "A short description of the brief, your role and the result." }
  ]
};
