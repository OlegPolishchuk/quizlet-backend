export interface BaseResponse<T> {
  success: boolean;
  data: T;
}

export interface BaseErrorResponse {
  data: {
    success: boolean;
    error?: string;
  };
  status: number;
}

export interface ListResponse<ItemsType> {
  total: number;
  limit: number;
  page: number;
  items: ItemsType[];
}
