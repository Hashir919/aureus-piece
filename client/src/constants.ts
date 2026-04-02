import { Project, Testimonial } from './types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Ethereal Monolith',
    category: 'Architecture',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
    description: 'A study in brutalist architecture and light interplay. This project explores the relationship between concrete structures and natural shadows.',
    year: '2023'
  },
  {
    id: '2',
    title: 'Silent Rhythm',
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&q=80&w=1000',
    description: 'Capturing the unseen movements of the city at night. A series of long-exposure shots that reveal the hidden pulse of urban life.',
    year: '2023'
  },
  {
    id: '3',
    title: 'Minimalist Essence',
    category: 'Branding',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
    description: 'Rebranding for a high-end fashion label. The focus was on stripping away the unnecessary to reveal the core identity of the brand.',
    year: '2024'
  },
  {
    id: '4',
    title: 'Void & Form',
    category: 'Sculpture',
    image: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&q=80&w=1000',
    description: 'A collection of marble sculptures that play with the concept of negative space. Each piece is a dialogue between what is there and what is missing.',
    year: '2024'
  },
  {
    id: '5',
    title: 'Monochrome Dreams',
    category: 'Digital Art',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1000',
    description: 'Exploring surreal landscapes through a strictly black and white digital medium. A journey into the subconscious mind.',
    year: '2024'
  },
  {
    id: '6',
    title: 'Structured Chaos',
    category: 'Graphic Design',
    image: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80&w=1000',
    description: 'A series of posters that use grid systems to organize chaotic visual elements. A balance between order and entropy.',
    year: '2023'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Alexander Vance',
    role: 'Creative Director, V&O',
    content: 'Aureus Piece brings a level of sophistication and clarity to our projects that is rare in the industry. Their eye for detail is unmatched.'
  },
  {
    id: '2',
    name: 'Elena Rossi',
    role: 'Founder, Lume Studio',
    content: 'Working with Aureus was a transformative experience. They understood our vision perfectly and elevated it beyond our expectations.'
  },
  {
    id: '3',
    name: 'Julian Thorne',
    role: 'Architect',
    content: 'The minimal aesthetic of Aureus Piece is not just a style, but a philosophy. They create space for ideas to breathe.'
  }
];
