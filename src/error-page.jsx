// Importing the useRouteError hook from react-router-dom
import { useRouteError } from "react-router-dom";

// Component for displaying an error page
export default function ErrorPage() {
  const error = useRouteError(); // Using the useRouteError hook to get the error that occurred during routing
  console.error(error); // Logging the error to the console for debugging purposes

  // JSX for rendering the error page
  return (
    <div id="error-page">
      <h1>Oops!</h1> {/* Displaying a header for the error page */}
      <p>Sorry, an unexpected error has occurred.</p> {/* A general apology message for the error */}
      {/* Displaying the error text or message */}
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
