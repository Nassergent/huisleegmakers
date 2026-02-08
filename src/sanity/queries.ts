// Homepage content
export const homepageQuery = `*[_type == "homepage"][0]{
  seoTitle,
  seoDescription,
  heroTitle,
  heroSubtitle,
  heroImage,
  telefoon,
  email,
  adres,
  openingstijden,
  ogImage
}`;

// Diensten gesorteerd op volgorde
export const dienstenQuery = `*[_type == "dienst"] | order(volgorde asc){
  _id,
  titel,
  beschrijving,
  icon,
  kenmerken,
  volgorde
}`;

// Reviews gesorteerd op volgorde
export const reviewsQuery = `*[_type == "review"] | order(volgorde asc){
  _id,
  naam,
  locatie,
  score,
  tekst
}`;

// FAQ gesorteerd op volgorde
export const faqQuery = `*[_type == "faq"] | order(volgorde asc){
  _id,
  vraag,
  antwoord
}`;
