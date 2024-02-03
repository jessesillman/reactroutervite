// Importing React and ReactDOM for building and rendering the React application
import React from 'react';
import ReactDOM from 'react-dom/client';

// Importing specific components and functions from different modules
import ErrorPage from './error-page'; // Error page component
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from './routes/contact'; // Contact route component with its loader and action functions

import Root, { 
  loader as rootLoader,
  action as rootAction,
} from "./routes/root"; // Root component with loader and action

// Importing functionalities from react-router-dom for routing
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Importing CSS for styling
import "./index.css";

// Importing EditContact component and its action function
import EditContact, {
  action as editAction,
} from './routes/edit';

// Importing the Index component for the base route
import Index from './routes/index';

// Importing the action function for the destroy route
import { action as destroyAction } from "./routes/destroy";

// Creating a router with route configurations
const router = createBrowserRouter([
  {
    path: "/", // Route path
    element: <Root />, // Root element for this route
    loader: rootLoader, // Loader function for the root
    action: rootAction, // Action function for the root
    errorElement: <ErrorPage />, // Error element displayed for this route
    children: [
      {
        errorElement: <ErrorPage />, // Error element for child routes
        children: [
          { index: true, element: <Index /> }, // Default child route (index)
          {
            path: "contacts/:contactId", // Path for contact details
            element: <Contact />, // Contact component for this route
            loader: contactLoader, // Loader for contact details
            action: contactAction, // Action for contact details
          },
          {
            path: "contacts/:contactId/edit", // Path for editing contact
            element: <EditContact />, // EditContact component for this route
            loader: contactLoader, // Loader for editing contact
            action: editAction, // Action for editing contact
          },
          {
            path: "contacts/:contactId/destroy", // Path for deleting contact
            action: destroyAction, // Action for deleting contact
          },
        ],
      }
    ],
  },
]);

// Rendering the application with React.StrictMode and RouterProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>  
    <RouterProvider router={router} /> {/* Providing the router to the app */}
  </React.StrictMode> 
);
