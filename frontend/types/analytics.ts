export interface ClickHistory {
  clicked_at: string;
  referrer: string;
}

export interface LinkStats {
  id: number;
  title: string;
  url: string;
  description?: string;
  click_count: number;
  total_clicks: number;
  unique_visitors: number;
  click_history: ClickHistory[];
} 