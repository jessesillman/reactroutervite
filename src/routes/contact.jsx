// Importing necessary components and hooks from react-router-dom and local module
import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

// Asynchronous function for handling form submissions (actions)
export async function action({ request, params }) {
    let formData = await request.formData(); // Parsing form data from the request
    // Updating the contact's favorite status and returning the result
    return updateContact(params.contactId, {
      favorite: formData.get("favorite") === "true",
    });
}

// Loader function for fetching data before rendering the component
export async function loader({ params }) {
    const contact = await getContact(params.contactId); // Fetching contact data
    // If the contact doesn't exist, throw a 404 error
    if (!contact) {
      throw new Response("", {
        status: 404,
        statusText: "Not Found",
      });
    }
    return { contact }; // Returning the fetched contact
}

// Default function for the Contact component
export default function Contact() {
    const { contact } = useLoaderData(); // Retrieving pre-loaded contact data

    // JSX rendering the contact information
    return (
      <div id="contact">
        <div>
          {/* Display contact's avatar */}
          <img
            key={contact.avatar}
            src={contact.avatar || null}
          />
        </div>

        <div>
          {/* Display contact's name and favorite status */}
          <h1>
            {contact.first || contact.last ? (
              <>
                {contact.first} {contact.last}
              </>
            ) : (
              <i>No Name</i>
            )}{" "}
            <Favorite contact={contact} />
          </h1>

          {/* Display contact's Twitter link if available */}
          {contact.twitter && (
            <p>
              <a
                target="_blank"
                href={`https://twitter.com/${contact.twitter}`}
              >
                {contact.twitter}
              </a>
            </p>
          )}

          {/* Display contact's notes if available */}
          {contact.notes && <p>{contact.notes}</p>}

          {/* Edit and delete buttons */}
          <div>
            <Form action="edit">
              <button type="submit">Edit</button>
            </Form>
            <Form
              method="post"
              action="destroy"
              onSubmit={(event) => {
                // Confirm before deleting
                if (
                  !confirm(
                    "Please confirm you want to delete this record."
                  )
                ) {
                  event.preventDefault();
                }
              }}
            >
              <button type="submit">Delete</button>
            </Form>
          </div>
        </div>
      </div>
    );
}

// Component for managing favorite status
function Favorite({ contact }) {
  const fetcher = useFetcher(); // Hook to manage data fetching
  let favorite = contact.favorite; // Initial favorite status
  
  // Update favorite status if data is being fetched
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }
  // JSX for displaying and toggling favorite status
  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
