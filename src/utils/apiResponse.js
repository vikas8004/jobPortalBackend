export class ApiResponse {
    constructor(data, success = true) {
        this.data = data,
            this.success = success
    }
}