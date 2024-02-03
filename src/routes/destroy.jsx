// Importing necessary functionalities from react-router-dom and a local module
import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

// Asynchronous function to handle the action of deleting a contact
export async function action({ params }) {
    await deleteContact(params.contactId); // Calling the deleteContact function with the contact ID
    return redirect("/"); // Redirecting to the home page after deletion
}
