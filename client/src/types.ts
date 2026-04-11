export interface Category {
  id: string;
  name: string;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  category_id?: string;
  category?: Category; // Join data
  image_url: string;
  description: string;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  review: string;
  created_at?: string;
}

export interface About {
  id: string;
  content: string;
  title: string;
  subtitle: string;
  caption: string;
  image_url?: string;
}


export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}
