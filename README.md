<h1>DigiShop - Ecommerce Marketplace 🛍️</h1>
<p>Welcome to <strong>Digishop</strong>, where buying and selling meet innovation. Our platform is a dynamic ecommerce marketplace, meticulously crafted with React, Node.js, GraphQL, and MySQL. Seamlessly integrated panels cater to both buyers and sellers, empowering individuals to explore a vast array of products or showcase their own offerings with ease. With a fully responsive design, users can engage in transactions effortlessly across various devices. Join us today and experience a revolutionized approach to online commerce, where buying and selling converge in a vibrant and intuitive marketplace environment.</p>
<h2>Technologies Used</h2>
<ul>
  <li>React</li>
  <li>Node.js & Express.js</li>
  <li>MySQL Database</li>
  <li>GraphQL</li>
  <li>Redux</li>
</ul>
<h2>Setting up the Environment Variables</h2>
<h3>Backend Environment Variables</h3>
<p>For the backend of the application, you will need to set the following environment variables:</p>
<ul>
  <li><code>FRONTEND_URL</code>: URL of the frontend application</li>
  <li><code>MYSQL_DATABASE</code>: Name of the MySQL database</li>
  <li><code>MYSQL_USER</code>: MySQL username</li>
  <li><code>MYSQL_PASSWORD</code>: MySQL password</li>
  <li><code>JWT_SECRET</code>: Secret key for JSON Web Tokens</li>
  <li><code>node_mailer_url</code>: Node mail host URL</li>
  <li><code>node_mailer_username</code>: Username for the Node mailer</li>
  <li><code>node_mailer_password</code>: Password for the Node mailer</li>
  <li><code>RECAPTCHA_SECRET_KEY</code>: Secret key for reCAPTCHA integration</li>
  <li><code>DEFAULT_PROFILE_FOR_USERS</code>: Default profile for users (string)</li>
</ul>
<h3>Frontend Environment Variables</h3>
<p>For the frontend of the application, you will need to set the following environment variables:</p>
<ul>
  <li><code>REACT_APP_BACKEND_URI</code>: URI of the backend API</li>
  <li><code>REACT_APP_RECAPTCHA_SITE_KEY</code>: Site key for reCAPTCHA integration</li>
  <li><code>REACT_APP_GOOGLE_API_CLIENT_ID</code>: Client ID for Google API integration</li>
</ul>
<p>Make sure to add these environment variables to your development and production environments accordingly.</p>
<h2>Setting up the Development Environment</h2>
<p>To set up the development environment for the DigiShop ecommerce website, follow these steps:</p>
<ol>
  <li>
    <p>Clone the repository:</p>
    <pre><div class="dark bg-gray-950 rounded-md"><div class="flex items-center relative text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md"></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-bash">git <span class="hljs-built_in">clone</span> https://github.com/TheRealKrishna/DigiShop
</code></div></div></pre>
  </li>
  <li>
    <p>Navigate to the project directory:</p>
    <pre><div class="dark bg-gray-950 rounded-md"><div class="flex items-center relative text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md"></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-bash"><span class="hljs-built_in">cd</span> DigiShop
</code></div></div></pre>
  </li>
  <li>
    <p>Install dependencies for both backend and frontend:</p>
    <pre><div class="dark bg-gray-950 rounded-md"><div class="flex items-center relative text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md"></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-bash"><span class="hljs-built_in">cd</span> server
npm install
<span class="hljs-built_in">cd</span> ../client
npm install
</code></div></div></pre>
  </li>

  <li>
    <p>Set up the environment variables as described above.</p>
  </li>

  <li>
    <p>Open two seperate terminals for client and server.</p>
  </li>

  <li>
    <p>Start the backend server:</p>
    <pre><div class="dark bg-gray-950 rounded-md"><div class="flex items-center relative text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md"></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-bash"><span class="hljs-built_in">cd</span> server
node index.js
</code></div></div></pre>
  </li>

  <li>
    <p>Start the frontend development server:</p>
    <pre><div class="dark bg-gray-950 rounded-md"><div class="flex items-center relative text-token-text-secondary bg-token-main-surface-secondary px-4 py-2 text-xs font-sans justify-between rounded-t-md"></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-bash"><span class="hljs-built_in">cd</span> client
npm start
</code></div></div></pre>
  </li>
  <li>
    <p>Access the application in your browser at the specified URL.</p>
  </li>
</ol>
<h2>Contributing 🎉</h2>
<p>We welcome contributions to improve and enhance the functionality of my DigiShop ecommerce website. If you'd like to
  contribute, please follow these steps:</p>
<ol>
  <li>Fork the repository on GitHub.</li>
  <li>Make your changes in a feature branch.</li>
  <li>Submit a pull request detailing your changes.</li>
</ol>
<h2>License 📄</h2>
<p>This project is licensed under the <a target="_new">MIT License</a>. Feel free to use, modify, and distribute the
  code as per the terms of the license.</p>
<p>Thank you for using the DigiShop ecommerce website! If you have any questions or feedback, please don't hesitate to
  contact us. 🚀</p>