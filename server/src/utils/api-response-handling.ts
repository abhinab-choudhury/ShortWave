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
    this.data = data;
    this.message = message;
    this.success = success;
  }
}

export default ApiResponse;
