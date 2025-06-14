export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface FAQResponse {
  faqs: FAQ[];
}
