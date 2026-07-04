export interface DesignStyle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  textStyle: string;
}

export interface SampleRoom {
  id: string;
  name: string;
  description: string;
  url: string;
}

export interface ShoppableItem {
  id: string;
  name: string;
  category: string;
  description: string;
  priceRange: string;
  searchUrl: string;
}

export const DESIGN_STYLES: DesignStyle[] = [
  {
    id: "scandinavian",
    name: "Scandinavian",
    tagline: "Light, airy, cozy & functional",
    description: "Features natural wood tones, a neutral color palette, cozy layered textiles, and clutter-free surfaces focused on natural light and serene comfort.",
    color: "from-stone-50 to-amber-50/10",
    textStyle: "text-amber-800 bg-amber-50/80 border-amber-200"
  },
  {
    id: "midcentury",
    name: "Mid-Century Modern",
    tagline: "Warm wood & organic curves",
    description: "Brings retro-chic warmth with tapered furniture legs, rich walnut and teak woods, mustard/teal accent colors, and iconic sculptural lamps.",
    color: "from-orange-50/20 to-amber-100/10",
    textStyle: "text-orange-800 bg-orange-50/80 border-orange-200"
  },
  {
    id: "industrial",
    name: "Industrial",
    tagline: "Exposed brick & dark steel",
    description: "Emphasizes raw, unfinished structures. Think weathered dark leather, black iron pipes, concrete flooring, exposed brick, and vintage Edison bulbs.",
    color: "from-zinc-50 to-slate-100/20",
    textStyle: "text-zinc-800 bg-zinc-100/80 border-zinc-200"
  },
  {
    id: "minimalist",
    name: "Minimalist",
    tagline: "Sleek, pristine & uncluttered",
    description: "Focuses on 'less is more'. Employs concealed storage, a strict monochromatic white/beige color palette, clean geometric lines, and maximum open space.",
    color: "from-slate-50 to-stone-50",
    textStyle: "text-slate-800 bg-slate-50/80 border-slate-200"
  },
  {
    id: "bohemian",
    name: "Boho Chic",
    tagline: "Vibrant plants, rugs & rattan",
    description: "A relaxed, expressive look featuring rich woven tapestries, layered exotic rugs, wicker or rattan seating, and cascading indoor potted plants.",
    color: "from-emerald-50/20 to-amber-50/10",
    textStyle: "text-emerald-800 bg-emerald-50/80 border-emerald-200"
  },
  {
    id: "artdeco",
    name: "Art Deco",
    tagline: "Opulent brass & rich velvet",
    description: "Oozes glamour and luxury with bold geometric shapes, gold or polished brass accents, rich jewel-toned velvet sofas, and glossy mirrored tables.",
    color: "from-purple-50/20 to-rose-50/10",
    textStyle: "text-purple-800 bg-purple-50/80 border-purple-200"
  }
];

export const SAMPLE_ROOMS: SampleRoom[] = [
  {
    id: "sample-1",
    name: "Modern Loft Living Room",
    description: "An open-plan modern living space with clean concrete and white walls.",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "sample-2",
    name: "Cozy Bedroom Studio",
    description: "A bright, airy bedroom awaiting a fresh decorative design theme.",
    url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "sample-3",
    name: "Plain Dining & Kitchen",
    description: "A functional, plain kitchen space that can be transformed.",
    url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80"
  }
];

// Fallbacks for Demo Mode (if Gemini key is missing)
export const DEMO_MAKEOVERS: Record<string, Record<string, { image: string; items: ShoppableItem[] }>> = {
  "sample-1": {
    "midcentury": {
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80",
      items: [
        {
          id: "m1",
          name: "Mid-Century Walnut Sideboard",
          category: "Storage",
          description: "Low-profile credenza with tapered legs and warm walnut grains.",
          priceRange: "$450 - $700",
          searchUrl: "https://www.wayfair.com/sd/?q=mid+century+walnut+sideboard"
        },
        {
          id: "m2",
          name: "Danish Modern Lounge Chair",
          category: "Seating",
          description: "An iconic armchair in textured tweed with sculptural arms.",
          priceRange: "$299 - $450",
          searchUrl: "https://www.wayfair.com/sd/?q=danish+modern+lounge+chair"
        },
        {
          id: "m3",
          name: "Brass Arc Floor Lamp",
          category: "Lighting",
          description: "A beautiful golden arc lamp that casts a warm overhead glow.",
          priceRange: "$120 - $190",
          searchUrl: "https://www.wayfair.com/sd/?q=mid+century+brass+arc+floor+lamp"
        }
      ]
    },
    "scandinavian": {
      image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
      items: [
        {
          id: "s1",
          name: "Minimalist Light Oak Coffee Table",
          category: "Tables",
          description: "Solid light oak coffee table with organic rounded corners.",
          priceRange: "$180 - $290",
          searchUrl: "https://www.wayfair.com/sd/?q=scandinavian+oak+coffee+table"
        },
        {
          id: "s2",
          name: "Cozy Wool Bouclé Sofa",
          category: "Seating",
          description: "A plush, cloud-like sofa upholstered in soft cream bouclé.",
          priceRange: "$800 - $1200",
          searchUrl: "https://www.wayfair.com/sd/?q=scandinavian+boucle+sofa"
        },
        {
          id: "s3",
          name: "Hand-Woven Neutral Area Rug",
          category: "Rugs",
          description: "Textured beige wool rug that grounds the room's airy feeling.",
          priceRange: "$150 - $300",
          searchUrl: "https://www.wayfair.com/sd/?q=scandinavian+wool+area+rug"
        }
      ]
    }
  },
  "sample-2": {
    "bohemian": {
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      items: [
        {
          id: "b1",
          name: "Wicker Hanging Chair",
          category: "Seating",
          description: "A playful, cozy swing chair made of natural woven rattan.",
          priceRange: "$199 - $320",
          searchUrl: "https://www.wayfair.com/sd/?q=rattan+hanging+egg+chair"
        },
        {
          id: "b2",
          name: "Macramé Textured Wall Hanging",
          category: "Decor",
          description: "Intricately detailed woven cotton art that adds visual warmth.",
          priceRange: "$35 - $60",
          searchUrl: "https://www.wayfair.com/sd/?q=macrame+boho+wall+hanging"
        },
        {
          id: "b3",
          name: "Terracotta Potted Monstera",
          category: "Decor",
          description: "A majestic split-leaf houseplant in an earthy clay pot.",
          priceRange: "$45 - $80",
          searchUrl: "https://www.wayfair.com/sd/?q=live+monstera+deliciosa+plant"
        }
      ]
    },
    "minimalist": {
      image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80",
      items: [
        {
          id: "mn1",
          name: "Low Platform Bed Frame",
          category: "Bedding",
          description: "A sleek, low-profile wooden bed frame in pale ash finish.",
          priceRange: "$300 - $550",
          searchUrl: "https://www.wayfair.com/sd/?q=minimalist+platform+bed+frame"
        },
        {
          id: "mn2",
          name: "Monochromatic Slate Bedding",
          category: "Bedding",
          description: "Breathable double-brushed microfiber sheets in deep slate gray.",
          priceRange: "$60 - $110",
          searchUrl: "https://www.wayfair.com/sd/?q=minimalist+grey+comforter+set"
        }
      ]
    }
  },
  "sample-3": {
    "industrial": {
      image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
      items: [
        {
          id: "i1",
          name: "Industrial Steel Barstools",
          category: "Seating",
          description: "Gunmetal stools with distressed elm wood seats.",
          priceRange: "$110 - $180",
          searchUrl: "https://www.wayfair.com/sd/?q=industrial+steel+barstools"
        },
        {
          id: "i2",
          name: "Edison Bulb Multi-Pendant Light",
          category: "Lighting",
          description: "Rustic iron bar fixture with exposed vintage filament lamps.",
          priceRange: "$80 - $150",
          searchUrl: "https://www.wayfair.com/sd/?q=industrial+edison+pendant+light"
        }
      ]
    }
  }
};
