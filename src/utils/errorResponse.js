export class CustomError {
    constructor(message, success = false) {
        this.message = message;
        this.success = success;
    }
}