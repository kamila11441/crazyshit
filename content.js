/* =====================================================================
   Photos go in /images ("images/p1.jpg").
   Leave a cover as "" and a generated colour panel is shown instead.
   kind: "Website" or "Web app". Placeholder text below
   videos (optional, shown above the images): a file ("videos/demo.mp4"), a YouTube or Vimeo link,
   or { src: "videos/loop.mp4", poster: "images/p1.jpg", loop: true } for a silent autoplay loop.
   ===================================================================== */
window.SITE = {
  name: "Your Name",
  role: "Website and web app designer, City",
  tagline: "I design websites that make people stay and web apps that people don’t have to think about.",
  description: "Portfolio of website and web app design: product interfaces, marketing sites and design systems.",

  about: {
    title: "About",
    text: [
      "I design the whole path from first visit to daily use: the marketing site that explains a product and the app people open every morning.",
      "I work best with small teams who want to ship early, test with real users and keep the interface simple as it grows."
    ],
    skills: ["Website design", "Web app and dashboard UX", "Design systems", "Prototyping", "Front-end handoff"],
    recognition: ["Award or feature, 2026", "Award or feature, 2025"]
  },

  contact: {
    lead: "Have a site or app in mind? I’d love to hear about it.",
    email: "hello@example.com",
    socials: [
      { label: "Instagram", url: "https://www.instagram.com/kamila11441/" },
      { label: "LinkedIn", url: "https://www.linkedin.com/" },
      { label: "Read.cv",  url: "https://read.cv/" }
    ]
  },

  projects: [
    { id: "one",   kind: "Website", title: "Portfolio Website",   client: "@jakyb11", year: 2026, tags: ["Portfolio site", "Photography"],        cover: "images/Image 21-11-2026 at 02.33.PNG", images: ["images/Image 21-11-2026 at 02.31.PNG", "images/Image 21-11-2026 at 02.33.PNG"], videos: ["videos/Screen Recording 2026-11-21 at 03.09.37.mp4"], url: "",
      text: "placeholder." },
    { id: "two",   kind: "Web app", title: "Project Two",   client: "Client", year: 2026, tags: ["Dashboard", "Design system"],   cover: "", images: ["", ""], url: "",
      text: "A short description of the brief, your role and the result, such as onboarding cut from nine steps to four." },
    { id: "three", kind: "Website", title: "Project Three", client: "Client", year: 2025, tags: ["E-commerce"],                   cover: "", images: ["", ""], url: "",
      text: "A short description of the brief, your role and the result." },
    { id: "four",  kind: "Web app", title: "Project Four",  client: "Client", year: 2025, tags: ["SaaS", "Mobile web"],           cover: "", images: ["", ""], url: "",
      text: "A short description of the brief, your role and the result." }
  ]
};
