class ApiResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: object;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    success: boolean = true,
    data: object = {},
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = success;
    this.data = data;
  }
}

export default ApiResponse;
