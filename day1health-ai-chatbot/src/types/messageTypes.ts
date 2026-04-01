// Message type definitions for structured AI responses

export type MessageType = 
  | 'carousel' 
  | 'comparison' 
  | 'card' 
  | 'text' 
  | 'quick_replies' 
  | 'list' 
  | 'progress'
  | 'form_input';

export interface CarouselItem {
  planName: string;
  price: string;
  highlights: string[];
  color: string;
  cta?: string;
}

export interface CarouselContent {
  title?: string;
  items: CarouselItem[];
  actionButtons?: string[];
}

export interface ComparisonPlan {
  name: string;
  price: string;
  gpVisits?: string;
  hospital?: string;
  chronic?: string;
  dental?: string;
  [key: string]: string | undefined;
}

export interface ComparisonContent {
  title?: string;
  plans: ComparisonPlan[];
}

export interface CardContent {
  title: string;
  subtitle?: string;
  color: string;
  image_url?: string;
  price?: string;
  text?: string[];
  buttons?: Array<{
    type: string;
    title: string;
    payload: string;
  }>;
  // Legacy format support
  plan?: {
    name: string;
    tagline?: string;
    price: string;
    color: string;
    benefits: string[];
    limitations?: string[];
    buttons?: Array<{
      text: string;
      action: string;
    }>;
  };
}

export interface QuickRepliesContent {
  text: string;
  quickReplies: string[];
}

export interface ListItem {
  icon?: string;
  label?: string;
  text: string;
  color?: string;
}

export interface ListContent {
  title?: string;
  items: ListItem[];
}

export interface ProgressContent {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    label: string;
    status: 'complete' | 'active' | 'pending';
  }>;
}

export interface TextContent {
  text: string;
}

export interface FormInputContent {
  text: string;
  inputType: 'text' | 'email' | 'tel' | 'number';
  placeholder: string;
  fieldName: string;
  validation?: string;
}

export interface StructuredMessage {
  messageType: MessageType;
  content: 
    | CarouselContent 
    | ComparisonContent 
    | CardContent 
    | QuickRepliesContent 
    | ListContent 
    | ProgressContent 
    | TextContent
    | FormInputContent;
}
