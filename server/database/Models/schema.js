const schema = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        passwordResetToken VARCHAR(255),
        profile VARCHAR(255) DEFAULT ''
    );
    
    CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        discountedPrice DECIMAL(10, 2) NOT NULL,
        thumbnail VARCHAR(255) NOT NULL,
        seller_id INT,
        FOREIGN KEY (seller_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quantity INT,
        product_id INT,
        user_id INT,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    
    CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT,
        reviewer_id INT,
        rating INT,
        title VARCHAR(255),
        description TEXT,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (reviewer_id) REFERENCES users(id)
    );
`;

module.exports = schema;