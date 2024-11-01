export interface Link {
  id: number;
  user_id?: number;
  title: string;
  url: string;
  description?: string;
  type: string;
  position: number;
  click_count?: number;
}

export interface CreateLinkData {
  title: string;
  url: string;
  description?: string;
  icon?: string;
  type?: string;
}

export interface UpdateLinkData extends Partial<CreateLinkData> {
  position?: number;
} 