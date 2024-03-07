const dbPool = require("../../../database/dbPool");
const errorHandler = require("../../../handlers/error_handler")
const validator = require("email-validator");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const JWT_SECRET = process.env.JWT_SECRET
const resetPasswordMail = require("../middleware/resetPasswordMail")
const randomstring = require("randomstring");
const axios = require("axios")

const handleError = (error, reject) => {
	errorHandler(error);
	return reject(new GraphQLError("An Internal Server Error Occurred!"));
};

const maximumQuantityPerProductPerOrder = 6

const userMutation = {
	createAccount: async (parent, { name, email, password, cart }) => {
		return new Promise(async (resolve, reject) => {
			try {
				// basic checks
				if (name.length < 3) {
					return reject(new GraphQLError("Name must have atleast 3 characters!"))
				}
				if (password.length < 8) {
					return reject(new GraphQLError("Password must have atleast 8 characters!"))
				}
				if (!validator.validate(email)) {
					return reject(new GraphQLError("Please enter a valid email address!"))
				}
				// checking if user already exist with that email
				dbPool.query(`SELECT * FROM users WHERE email = '${email}'`, async (error, results) => {
					if (error) {
						return handleError(error, reject);
					}
					if (results && results.length > 0) {
						return reject(new GraphQLError("A user already exists with that email!"))
					}
					else {
						// encrypting password
						const securePassword = bcrypt.hashSync(password, 10);

						// creating a user with those credentials                    
						dbPool.query(
							`INSERT INTO users (name, email, password, profile) VALUES ('${name}', '${email}', '${securePassword}', '${process.env.DEFAULT_PROFILE_FOR_USERS}')`
							, (error, results) => {
								if (error) {
									return handleError(error, reject);
								}
								const userId = results.insertId;
								const auth_token = jwt.sign({ id: userId }, JWT_SECRET)
								const userCart = cart && JSON.parse(cart);
								if (userCart && userCart.cartItems.length > 0 && userCart.total > 0) {
									userCart.total = 0;
									let completedQueries = 0;
									userCart.cartItems.forEach((cartItem, i) => {
										if (cartItem.quantity > 0 && cartItem.quantity <= maximumQuantityPerProductPerOrder) {
											dbPool.query(`SELECT * FROM products WHERE id = '${cartItem.product_id}'`, (error, products) => {
												if (error) {
													errorHandler(error)
													userCart.cartItems.splice(i, 1);
												} else if (products && products.length > 0) {
													dbPool.query(`INSERT INTO cart (quantity, product_id, user_id) VALUES (${cartItem.quantity}, ${cartItem.product_id}, ${userId})`, (error) => {
														if (error) {
															errorHandler(error)
															userCart.cartItems.splice(i, 1);
														} else {
															userCart.total += products[0].discountedPrice * cartItem.quantity;
														}
														completedQueries++;

														if (completedQueries === userCart.cartItems.length) {
															return resolve({
																id: userId,
																name,
																email,
																profile: process.env.DEFAULT_PROFILE_FOR_USERS,
																auth_token,
																cart: userCart
															});
														}
													});
												} else {
													userCart.cartItems.splice(i, 1);
													completedQueries++;

													if (completedQueries === userCart.cartItems.length) {
														return resolve({
															id: userId,
															name,
															email,
															profile: process.env.DEFAULT_PROFILE_FOR_USERS,
															auth_token,
															cart: userCart
														});
													}
												}
											});
										} else {
											userCart.cartItems.splice(i, 1);
											completedQueries++;

											if (completedQueries === userCart.cartItems.length) {
												return resolve({
													id: userId,
													name,
													email,
													profile: process.env.DEFAULT_PROFILE_FOR_USERS,
													auth_token,
													cart: userCart
												});
											}
										}
									});
								} else {
									return resolve({
										id: userId,
										name,
										email,
										profile: process.env.DEFAULT_PROFILE_FOR_USERS,
										auth_token,
										cart: {
											cartItems: [],
											total: 0
										}
									});
								}
							})
					}
				})
			}
			catch (error) {
				return handleError(error, reject);
			}
		})
	},

	login: async (parent, { email, password }) => {
		return new Promise(async (resolve, reject) => {
			try {
				// basic checks
				if (!email) {
					return reject(new GraphQLError("An Email is required!"))
				}
				if (!password) {
					return reject(new GraphQLError("A Password is required!"))
				}
				//check if user exists or not
				dbPool.query(`
                SELECT
                u.*,
                CONCAT(
                    '{ "cartItems": ',
                    '[',
                    GROUP_CONCAT(
                        DISTINCT JSON_OBJECT(
                            'product_id', p.id,
                            'quantity', c.quantity
                        )
                        SEPARATOR ','
                    ),
                    ']',
                    ', "total": ',
                    COALESCE(
                        (
                            SELECT SUM(p.discountedPrice * c.quantity)
                            FROM products p
                            JOIN cart c ON p.id = c.product_id
                            WHERE c.user_id = u.id
                        ),
                        0
                    ),
                    '}'
                ) AS cart
            FROM
                users u
            LEFT JOIN cart c ON u.id = c.user_id
            LEFT JOIN products p ON p.id = c.product_id
            WHERE
                u.email = '${email}'
            GROUP BY
                u.id;         
                    `, (error, results) => {
					if (error) {
						return handleError(error, reject);
					}
					else if (results && results.length > 0) {
						const user = results[0];
						if (!user.password) {
							return reject(new GraphQLError("Invalid Credentials!"));
						}
						if (!bcrypt.compareSync(password, user.password)) {
							return reject(new GraphQLError("Invalid Credentials!"));
						}
						user.cart = JSON.parse(user.cart)
						if (!user.cart.cartItems[0].product_id) {
							user.cart.cartItems.splice(0, 1);
						}
						delete user.password
						delete user.passwordResetToken
						const auth_token = jwt.sign({ id: user.id }, JWT_SECRET)
						return resolve({ ...user, auth_token });
					}
					else {
						return reject(new GraphQLError("Invalid Credentials!"));
					}
				})
			}
			catch (error) {
				return handleError(error, reject);
			}
		})
	},
	loginGoogle: async (parent, { cart }, context) => {
		const accessToken = context.access_token
		return new Promise(async (resolve, reject) => {
			try {
				axios.get("https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos,", {
					headers: {
						"Authorization": `Bearer ${accessToken}`,
					}
				}).then(async (response) => {
					const name = response.data.names[0].displayName
					const email = response.data.emailAddresses[0].value
					const profile = response.data.photos[0].url

					//checking if user exists or not
					dbPool.query(`
                    SELECT
                    u.*,
                    CONCAT(
                        '{ "cartItems": ',
                        '[',
                        GROUP_CONCAT(
                            DISTINCT JSON_OBJECT(
                                'product_id', p.id,
                                'quantity', c.quantity
                            )
                            SEPARATOR ','
                        ),
                        ']',
                        ', "total": ',
                        COALESCE(
                            (
                                SELECT SUM(p.discountedPrice * c.quantity)
                                FROM products p
                                JOIN cart c ON p.id = c.product_id
                                WHERE c.user_id = u.id
                            ),
                            0
                        ),
                        '}'
                    ) AS cart
                FROM
                    users u
                LEFT JOIN cart c ON u.id = c.user_id
                LEFT JOIN products p ON p.id = c.product_id
                WHERE
                    u.email = '${email}'
                GROUP BY
                    u.id;
                        `, (error, results) => {
						if (error) {
							return handleError(error, reject);
						}
						else if (results && results.length > 0) {
							const user = results[0];
							user.cart = JSON.parse(user.cart)
							if (!user.cart.cartItems[0].product_id) {
								user.cart.cartItems.splice(0, 1);
							}
							delete user.password
							delete user.passwordResetToken
							const auth_token = jwt.sign({ id: user.id }, JWT_SECRET)
							return resolve({ ...user, auth_token });
						}
						else {
							dbPool.query(
								`INSERT INTO users (name, email, profile) VALUES ('${name}', '${email}', '${profile}')`
								, (error, results) => {
									if (error) {
										return handleError(error, reject);
									}
									// making a JWT
									// const auth_token = jwt.sign({ id: results.insertId }, JWT_SECRET)
									// return resolve({ id: results.insertId, name, email, profile, auth_token, cart: { cartItems: [], total: 0 } })

									const userId = results.insertId;
									const auth_token = jwt.sign({ id: userId }, JWT_SECRET)
									const userCart = cart && JSON.parse(cart);
									if (userCart && userCart.cartItems.length > 0 && userCart.total > 0) {
										userCart.total = 0;
										let completedQueries = 0;
										userCart.cartItems.forEach((cartItem, i) => {
											if (cartItem.quantity > 0 && cartItem.quantity <= maximumQuantityPerProductPerOrder) {
												dbPool.query(`SELECT * FROM products WHERE id = '${cartItem.product_id}'`, (error, products) => {
													if (error) {
														errorHandler(error)
														userCart.cartItems.splice(i, 1);
													} else if (products && products.length > 0) {
														dbPool.query(`INSERT INTO cart (quantity, product_id, user_id) VALUES (${cartItem.quantity}, ${cartItem.product_id}, ${userId})`, (error) => {
															if (error) {
																errorHandler(error)
																userCart.cartItems.splice(i, 1);
															} else {
																userCart.total += products[0].discountedPrice * cartItem.quantity;
															}
															completedQueries++;

															if (completedQueries === userCart.cartItems.length) {
																return resolve({
																	id: userId,
																	name,
																	email,
																	profile: process.env.DEFAULT_PROFILE_FOR_USERS,
																	auth_token,
																	cart: userCart
																});
															}
														});
													} else {
														userCart.cartItems.splice(i, 1);
														completedQueries++;

														if (completedQueries === userCart.cartItems.length) {
															return resolve({
																id: userId,
																name,
																email,
																profile: process.env.DEFAULT_PROFILE_FOR_USERS,
																auth_token,
																cart: userCart
															});
														}
													}
												});
											} else {
												userCart.cartItems.splice(i, 1);
												completedQueries++;

												if (completedQueries === userCart.cartItems.length) {
													return resolve({
														id: userId,
														name,
														email,
														profile: process.env.DEFAULT_PROFILE_FOR_USERS,
														auth_token,
														cart: userCart
													});
												}
											}
										});
									} else {
										return resolve({
											id: userId,
											name,
											email,
											profile: process.env.DEFAULT_PROFILE_FOR_USERS,
											auth_token,
											cart: {
												cartItems: [],
												total: 0
											}
										});
									}
								})
						}
					})
				})
			}
			catch (error) {
				return handleError(error, reject);
			}
		})
	},
	forgotPassword: async (parent, { email, reCaptchaToken }) => {
		return new Promise(async (resolve, reject) => {
			try {
				const captchaResponse = await axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${reCaptchaToken}`)
				if (!captchaResponse.data.success) {
					return reject(new GraphQLError("Invalid Captcha Response!"))
				}
				// basic checks
				if (email.length < 1) {
					return reject(new GraphQLError("An Email is required!"))
				}
				dbPool.query(`SELECT * FROM users WHERE email = '${email}'`, (error, results) => {
					if (error) {
						return handleError(error, reject);
					}
					else if (results && results.length > 0) {
						const passwordResetToken = results[0].id + randomstring.generate()
						dbPool.query(`UPDATE users SET passwordResetToken = '${passwordResetToken}' WHERE email='${email}'`, (error, results) => {
							if (error) {
								return handleError(error, reject);
							}
							if (results) {
								const success = resetPasswordMail(email, passwordResetToken);
								if (success) {
									return resolve({ message: "Password reset mail sent!", success: true })
								}
								else if (!success) {
									return reject(new GraphQLError("An Internal Server Error Occured!"))
								}
							}
						})
					}
					else {
						return reject(new GraphQLError("We could not find your account!"));
					}
				})
			}
			catch (error) {
				return handleError(error, reject);
			}
		})
	},
	changePassword: async (parent, { password, confirmPassword }, context) => {
		return new Promise(async (resolve, reject) => {
			try {
				const passwordResetToken = context.passwordresettoken
				// basic checks
				if (password.length < 8) {
					return reject(new GraphQLError("Password must have atleast 8 characters!"))
				}
				if (password !== confirmPassword) {
					return reject(new GraphQLError("Password and confirm password do not match!"))
				}

				dbPool.query(`SELECT * FROM users WHERE passwordResetToken = '${passwordResetToken}'`, (error, results) => {
					if (error) {
						return handleError(error, reject);
					}
					else if (results && results.length > 0) {
						// making new password hash
						const securePassword = bcrypt.hashSync(password, 10);
						dbPool.query(`UPDATE users SET password = '${securePassword}', passwordResetToken = NULL WHERE passwordResetToken='${passwordResetToken}'`, (error) => {
							if (error) {
								return handleError(error, reject);
							}
							return resolve({ message: "Password changed successfully!", success: true })
						})
					}
					else {
						return reject(new GraphQLError("Your password changing request is expired!"));
					}
				})
			}
			catch (error) {
				return handleError(error, reject);
			}
		})
	},
	updateCart: async (parent, { product_id, quantity }, context) => {
		return new Promise(async (resolve, reject) => {
			try {
				// basic checks
				if (!product_id) {  // a product id is necessary
					return reject(new GraphQLError("Invalid Product Id!"))
				}
				if (typeof (quantity) !== 'number' || quantity < 0 || quantity > maximumQuantityPerProductPerOrder) {
					return reject(new GraphQLError("Invalid Quantity!"))
				}
				const auth_token = context.auth_token
				if (!auth_token) {
					return reject(new GraphQLError("Invalid Request!"));
				}
				jwt.verify(auth_token, JWT_SECRET, (error, decoded) => {
					if (error) {
						return reject(new GraphQLError("Your session has expired, Please refresh the page!"));
					}
					dbPool.query(`SELECT * FROM users WHERE id = '${decoded.id}'`, (error, users) => {
						if (error) {
							return handleError(error, reject);
						}
						else if (users && users.length > 0) {
							const user = users[0];
							dbPool.query(`SELECT * FROM products WHERE id = '${product_id}'`, (error, products) => {
								if (error) {
									return handleError(error, reject);
								}
								else if (products && products.length > 0) {
									const product = products[0]
									//check if product already exist in cart!
									dbPool.query(`SELECT * FROM cart WHERE product_id = '${product.id}' AND user_id = '${user.id}'`, (error, results) => {
										if (error) {
											return handleError(error, reject);
										}
										else if (results && results.length > 0) {
											if (quantity < 1) {
												dbPool.query(`DELETE FROM cart WHERE product_id = '${product.id}' AND user_id = '${user.id}'`, (error) => {
													if (error) {
														return handleError(error, reject);
													}
													return resolve({ success: true, message: "Cart Successfully Updated!" });
												})
											}
											else {
												dbPool.query(`UPDATE cart SET quantity = ${quantity} WHERE product_id = '${product.id}' AND user_id = '${user.id}'`, (error) => {
													if (error) {
														return handleError(error, reject);
													}
													return resolve({ success: true, message: "Cart Successfully Updated!" });
												})
											}
										}
										else {
											dbPool.query(`INSERT INTO cart (product_id, user_id, quantity) VALUES ('${product.id}', '${user.id}', ${quantity})`, (error) => {
												if (error) {
													return handleError(error, reject);
												}
												return resolve({ success: true, message: "Cart Successfully Updated!" });
											})
										}
									})
								}
								else {
									return reject(new GraphQLError("Product Does Not Exist!"));
								}
							})
						}
						else {
							return reject(new GraphQLError("User Does Not Exist!"));
						}
					})
				})
			}
			catch (error) {
				return handleError(error, reject);
			}
		})
	},
};

module.exports = userMutation;
