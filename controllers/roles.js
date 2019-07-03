

module.exports = {
    owner : "owner",
    admin : "admin",
    employee : "employee",
    canDoOperation(token, VAT) {
        if (token.role == this.owner) return 2;
        else if (token.role == this.admin && token.company == VAT) return 1;
        
        return 0;
    },
    roles(role) {
        if (role == this.owner) return [{ "value": this.owner }, { "value": this.admin }, { "value": this.employee }];
        else if (role == this.admin) return [{ "value": this.admin }, { "value": this.employee }];
        return [];
    }
}