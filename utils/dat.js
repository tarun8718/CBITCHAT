var usernamed;
var roomd;

function func(id, username, room) {
    const user = {id, username, room};

    users.push(user);

    return user;
}


module.exports = {
    func
};