

module.exports = {
    owner : "owner",
    administartor : "administartor",
    employee : "employee",
    canDoOperation(token, VAT) {
        if (token.role == this.owner || (token.role == this.administartor && token.company == VAT)) return true;
        return false;
    },
    roles(role) {
        if (role == this.owner) return [{ "value": this.owner }, { "value": this.administartor }, { "value": this.owner }];
        else if (role == this.administartor) return [{ "value": this.administartor }, { "value": this.employee }];
        return [];
    },
    isOwner(role){
        if (role == this.owner) return true;
        return false;
    }
}