export interface Asset {
  id: number;
  name: string;
  type: string;
  ownerId: number | null;
  ip: string | null;
  location: string | null;
  tags: string[];
}

export interface AssetRequest {
  name: string;
  type: string;
  ownerId: number | null;
  ip: string | null;
  location: string | null;
  tags: string[];
}
