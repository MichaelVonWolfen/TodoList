const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const { UserOne, UserOneID, setUpDB } = require("./fixtures/db");
beforeEach(setUpDB);

test("Should signUp a new user", async () => {
	const response = await request(app)
		.post("/users")
		.send({
			name: "Andrew",
			password: "test123",
			email: "andrew@example.com",
		})
		.expect(201);
	//Assertion

	const user = await User.findById(response.body.user._id);
	expect(user).not.toBeNull();
	expect(response.body).toMatchObject({
		user: {
			name: "Andrew",
			email: "andrew@example.com",
		},
		token: user.tokens[0].token,
	});
	expect(user.password).not.toBe(UserOne.password);
});
test("Should login existing user", async () => {
	let response = await request(app)
		.post("/users/login")
		.send({
			email: UserOne.email,
			password: UserOne.password,
		})
		.expect(200);
	let user = await User.findById(response.body.user._id);
	let token = user.tokens.find((tok) => {
		return tok === response.body.token;
	});
	expect(token).not.toBeNull();
});
test("Should not login non-existing user", async () => {
	await request(app)
		.post("/users/login")
		.send({
			email: UserOne.email,
			password: "soigjn",
		})
		.expect(400);
});
test("Should get profile for user", async () => {
	await request(app)
		.get("/users/me")
		.set("Authorization", `Bearer ${UserOne.tokens[0].token}`)
		.send()
		.expect(200);
});
test("Should not get profile for user", async () => {
	await request(app).get("/users/me").send().expect(401);
});
test("Should delete authenticated user", async () => {
	let response = await request(app)
		.delete("/users/me")
		.set("Authorization", `Bearer ${UserOne.tokens[0].token}`)
		.expect(200);
	let user = await User.findById(UserOne._id);
	expect(user).toBeNull();
});
test("Should not delete unauthenticated user", async () => {
	await request(app).delete("/users/me").expect(401);
});
test("Should Upload image", async () => {
	await request(app)
		.post("/users/me/avatar")
		.set("Authorization", `Bearer ${UserOne.tokens[0].token}`)
		.attach("avatar", "tests/fixtures/profile-pic.jpg")
		.expect(200);
	let user = await User.findById(UserOneID);
	expect(user.avatar).toEqual(expect.any(Buffer));
});
