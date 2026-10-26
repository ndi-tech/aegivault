export type Document = {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'flagged';
};