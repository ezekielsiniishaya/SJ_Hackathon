# SJ_Hackathon

Our project for Social Justice Hackthon

# Backend Directory Structure

sj_hackathon_backend/
├── controllers/ # Handles specific requests and logic
│ └── postController.js
│ └── userController.js
│ └── commentController.js  
├── models/ # Defines MongoDB schemas
│ └── postModel.js
│ └── userModel.js
│ └── commentModel.js  
├── routes/ # API routes for various resources
│ └── postRoutes.js
│ └── userRoutes.js
│ └── commentRoutes.js  
├── middleware/ # Middleware functions (e.g., auth)
├── config/ # Configuration files (e.g., DB config)
├── public/ # Publicly accessible static files (optional)
├── .env # Environment variables
├── .gitignore # Git ignore file
├── server.js # Entry point of the app
└── package.json # Dependencies and scripts
