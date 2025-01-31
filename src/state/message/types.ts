import { Message } from '@/types';

export interface MessageState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}
