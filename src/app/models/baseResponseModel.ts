export class BaseResponseModel {
    data: any;
    message?: String;
    success: boolean;

    constructor(data: any, message: String, success: boolean) {
        this.data = data;
        this.message = message;
        this.success = success;
    }
}