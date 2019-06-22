module.exports = {
    ok() {
        return {
            status: 200,
            message: "Successfully accomplished operation"
        };
    },
    badrequest() {
        return {
            status: 400,
            message: "Bad request"
        };
    },
    unauthorized() {
        return {
            status: 401,
            message: "Incorrect email or password"
        };
    },
    forbidden() {
        return {
            status: 403,
            message: "No token provided"
        };
    },
    notFound() {
        return {
            status: 404,
            message: "Not found"
        };
    },
    notacceptable() {
        return {
            status: 406,
            message: "Not acceptable, password is too short, min: 4 characters"
        };
    },
    conflictEmail() {
        return {
            status: 409,
            message: "Conflict, email already exists"
        };
    },
    conflictCompanies(){
        return {
            status: 409,
            message: "Conflict, VAT already exists"
        };
    },
    internalServerError() {
        return {
            status: 500,
            message: "Internal Server Error"
        };
    }
}