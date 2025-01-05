# *🌐 ChatSphere*
## *Welcome to ChatApp, a modern and sleek real-time chat application built with React and Node.js. Connect with friends, family, and colleagues seamlessly with our intuitive interface and robust backend.*

# *Preview*
## *[Start Chatting](https://chatsphere-oepd.onrender.com/#/)*

## *🚀 Features*

### *Real-time Messaging:*
*Experience instant messaging with WebSocket technology.*

### *User Authentication:*
*Secure login and registration with JWT.*

### *Responsive Design:*
*Optimized for both desktop and mobile devices.*

### *User Profiles:*
*Customize your profile with avatars and status messages.*

### *Group Chats:*
*Create and join group chats with multiple participants.*

### *Message History:* 
*Access your chat history anytime.*

## *🛠️ Tech Stack*

### *Frontend:*
*React, Axios, Socket.io-client, JWT-decode*

### *Backend:*
*Node.js, Express, MongoDB, Mongoose, Socket.io*

### *Styling:*
*CSS, Flexbox*

### *Authentication:*
*JWT (JSON Web Tokens)*

## *📦 Installation*

### *Clone the repository:*

```
git clone https://github.com/Sujan2332/ChatSphere.git
cd ChatSphere
```

### *Install dependencies:*

*For the server*

```
cd Server
npm install
```

*For the client*

```
cd ../Client
npm install
```

### *Set up environment variables:*

*Create a .env file in the Server directory and add the following:*

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### *Run the application:*

*Start the server*

```
cd Server
npm start
```

*Start the client*

```
cd ../Client
npm start
```

### *Access the application: Open your browser and navigate to* 

```
http://localhost:5173.
```

## *File Structure*

```
ChatSphere/
├── Client/
│   ├── public/
│   │   ├── index.html
│   │   └── ...
│   ├── src/
│   │   ├── assets/
│   │   │   ├── profile.jpg
│   │   │   └── ...
│   │   ├── components/
│   │   │   ├── ContactList.jsx
│   │   │   ├── ChatRoom.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── ...
│   │   ├── SocketContext.jsx
│   │   │   └── ...
│   │   ├── styles/
│   │   │   ├── ContactList.css
│   │   │   ├── ChatRoom.css
│   │   │   ├── Login.css
│   │   │   ├── Register.css
│   │   │   ├── Profile.css
│   │   │   └── ...
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── ...
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── ...
├── Server/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── chat.controller.js
│   │   ├── user.controller.js
│   │   └── ...
│   ├── models/
│   │   ├── chat.model.js
│   │   ├── user.model.js
│   │   └── ...
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── chat.routes.js
│   │   ├── user.routes.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── ...
│   ├── .env
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── ...
├── README.md
└── ...
```

## *📚 Usage*

### *Register:*
*Create a new account or log in with your existing credentials.*

### *Profile Setup:*
*Customize your profile with an avatar.*

### *Contacts:*
*Add contacts and see who is available to chat.*

### *Chat:*
*Start a conversation or join a chat. Enjoy real-time messaging!*

## *🤝 Contributing*

### *We welcome contributions! Please follow these steps:*

### *Fork the repository.*

### *Create a new branch*

```
git checkout -b feature/your-feature
```

### *Commit your changes*

```
git commit -m 'Add some feature'
```

### *Push to the branch*

```
git push origin feature/your-feature
```

### *Open a pull request.*

## *🛡️ License*

### *This project is licensed under the MIT License. See the LICENSE file for details.*

## *📧 Contact*

### *Have questions or feedback? Reach out to us at saisujan.s03@gmail.com.*

Thank you for using ChatSphere! We hope you enjoy your chatting experience. 🚀
