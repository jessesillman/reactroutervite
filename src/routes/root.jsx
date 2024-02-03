// Importing hooks and components from react-router and local modules
import { useEffect } from "react";
import {
    Outlet,
    NavLink,
    useLoaderData,
    Form,
    redirect,
    useNavigation,
    useSubmit,
} from "react-router-dom";

import { getContacts, createContact } from "../contacts"; 

// Asynchronous function to handle the creation of a new contact
export async function action() {
    const contact = await createContact(); // Creating a new contact
    return redirect(`/contacts/${contact.id}/edit`); // Redirecting to the edit page of the new contact
  }

// Asynchronous loader function for pre-loading data
export async function loader({ request }) {
    const url = new URL(request.url); // Praising the request URL
    const q = url.searchParams.get("q"); // Extracting the search query
    const contacts = await getContacts(q); // Fetching contacts based on the search query
    return { contacts, q }; // Returning the fetched contact and the query
}

// The main Root component
export default function Root() {
  const { contacts, q } = useLoaderData(); // Using pre-loaded data (contacts and query)
  const navigation = useNavigation(); // Accessing navigation context
  const submit = useSubmit(); // Hook to submit forms programmatically

  // Determines if the current navigation involves a search query
  const searching = 
      navigation.location && 
      new URLSearchParams(navigation.location.search).has("q");

  // useEffect to update the search input's value
  useEffect(() => { 
      document.getElementById("q").value = q; // Set the search input value to the current query
  }, [q]);

  // JSX for rendering the component
  return (
      <>
          <div id="sidebar">
              <h1>React Router Contacts</h1>
              {/* Search form */}
              <div>
                  <Form id="search-form" role="search">
                      <input
                          id="q"
                          className={searching ? "loading" : ""}
                          aria-label="Search contacts"
                          placeholder="Search"
                          type="search"
                          name="q"
                          defaultValue={q}
                          onChange={(event) => {
                              const isFirstSearch = q == null;
                              submit(event.currentTarget.form, {
                                  replace: !isFirstSearch,
                              });
                          }}
                      />
                      <div id="search-spinner" aria-hidden hidden={!searching} />
                      <div className="sr-only" aria-live="polite"></div>
                  </Form>

                  {/* New contact button */}
                  <Form method="post">
                      <button type="submit">New</button>
                  </Form>
              </div>
              <nav>
                  {/* Dynamically rendering contact list */}
                  {contacts.length ? (
                      <ul>
                          {contacts.map((contact) => (
                              <li key={contact.id}>
                                  {/* Navigation link for each contact */}
                                  <NavLink to={`contacts/${contact.id}`} className={({ isActive, isPending }) =>
                                          isActive
                                          ? "active"
                                          : isPending
                                          ? "pending"
                                          : ""
                                      }>
                                      {/* Display contact name or a placeholder */}
                                      {contact.first || contact.last ? (
                                          <>
                                              {contact.first} {contact.last}
                                          </>
                                      ) : (
                                          <i>No Name</i>
                                      )}{" "}
                                      {/* Display a star for favorite contacts */}
                                      {contact.favorite && <span>★</span>}
                                  </NavLink>
                              </li>
                          ))}
                      </ul>
                  ) : (
                      <p>
                          <i>No contacts</i>
                      </p>
                  )}
              </nav>
          </div>
          <div 
              id="detail"
              className={
                  navigation.state === "loading" ? "loading" : ""
              }
          >
              {/* Outlet for rendering child routes */}
              <Outlet />
          </div>
      </>
  );
}
