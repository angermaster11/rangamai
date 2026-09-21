import type { Client } from "@rangamai/shared";

/**
 * Seed clients (ProductDescription.md §9). Only `showPublicly: true` clients
 * appear under "Trusted By" on the public site. Logos are text-based
 * placeholders for now (Cloudinary uploads come in a later phase).
 */
export const clients: Client[] = [
  {
    id: "cl-mecfinders",
    companyName: "MecFinders",
    website: "https://mecfinders.example",
    industry: "Automotive services",
    description: "On-demand mechanic marketplace.",
    showPublicly: true,
    displayOrder: 1,
  },
  {
    id: "cl-onchikitsa",
    companyName: "Onchikitsa",
    website: "https://onchikitsa.example",
    industry: "Healthcare",
    description: "Telehealth and patient records platform.",
    showPublicly: true,
    displayOrder: 2,
  },
  {
    id: "cl-northwind",
    companyName: "Northwind Retail",
    industry: "Retail & e-commerce",
    description: "Workflow automation for store operations.",
    showPublicly: true,
    displayOrder: 3,
  },
  {
    id: "cl-lumen",
    companyName: "Lumen Analytics",
    industry: "Data & analytics",
    description: "AI systems for reporting and insight.",
    showPublicly: true,
    displayOrder: 4,
  },
];
