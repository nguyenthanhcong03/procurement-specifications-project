React App Setup and Run Guide

Prerequisites

Before running this project, make sure you have the following installed:

Node.js 18 (Download from Node.js official website)

npm (Comes with Node.js) or yarn

Install dependencies:

npm install
# or
yarn install

Running the Project

Start Development Server (Vite)

To start the development server using Vite, run:

npm run dev
# or
yarn dev

The app will be available at the URL displayed in the terminal (usually http://localhost:5173/).

Build for Production

To create an optimized production build, run:

npm run build
# or
yarn build

This will generate a dist/ folder with optimized static files.

Serve Production Build

To serve the built files locally:

npm install -g serve
serve -s dist

Then visit http://localhost:3000/.

Environment Variables

Create a .env file in the root directory to define environment variables:

VITE_API_URL=https://api.example.com

Access it in code using import.meta.env.VITE_API_URL.

Linting and Formatting

To check code style:

npm run lint
# or
yarn lint

To automatically fix formatting:

npm run format
# or
yarn format

Testing

Run tests with:

npm test
# or
yarn test

Additional Notes

Ensure your Node.js version is 18+ by running:

node -v

If you face permission issues, try running commands with sudo (Linux/macOS).

If using yarn, make sure it's installed globally:

npm install -g yarn

License

This project is licensed under the MIT License.

