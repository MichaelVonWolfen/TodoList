const users = [];

//add user
const addUser = ({ id, username, room }) => {
	//Clean the data
	username = username.trim().toLowerCase();
	room = room.trim().toLowerCase();

	//validate data
	if (!username || !room) {
		return {
			error: "Username and room are required!",
		};
	}
	//Check for eisting user

	let existingUser = users.find((user) => {
		return user.username === username && user.room === room;
	});
	if (existingUser) {
		return {
			error: "Username is in use!",
		};
	}
	//store user
	let user = {
		id,
		username,
		room,
	};
	users.push(user);
	return { user };
};

//remove user
const removeUser = (id) => {
	let index = users.findIndex((user) => {
		return user.id === id;
	});
	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
};

//getUser
const getUser = (id) => {
	return users.find((user) => user.id === id);
};

//getUsersInRoom
const getUsersInRoom = (room) => {
	return users.filter((user) => user.room === room);
};

module.exports = {
	addUser,
	removeUser,
	getUsersInRoom,
	getUser,
};
