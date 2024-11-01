export interface CulturalTheme {
  name: string;
  icon: string;
  gradient: string;
  pattern: string;
}

export interface Theme {
  id: number;
  user_id: number;
  name: string;
  background_color: string;
  text_color: string;
  accent_color: string;
  is_active: boolean;
  cultural_theme?: string;
}

export interface CreateThemeData {
  name: string;
  background_color: string;
  text_color: string;
  accent_color: string;
  cultural_theme?: string;
}

export interface UpdateThemeData extends Partial<CreateThemeData> {
  is_active?: boolean;
} 