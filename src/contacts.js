// Importing dependencies for data storage and manipulation
import localforage from "localforage"; // For local data storage
import { matchSorter } from "match-sorter"; // For filtering and sorting data
import sortBy from "sort-by"; // Utility for sorting arrays

// Function to retrieve contacts, optionally filtered by a query
export async function getContacts(query) {
  await fakeNetwork(`getContacts:${query}`); // Simulating network delay
  let contacts = await localforage.getItem("contacts"); // Retrieving contacts from local storage
  if (!contacts) contacts = []; // Default to an empty array if no contacts are found
  // Filter contacts based on the query using matchSorter
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  // Sorting contacts by last name and then by creation date
  return contacts.sort(sortBy("last", "createdAt"));
}

// Function to create a new contact
export async function createContact() {
  await fakeNetwork(); // Simulating network delay
  let id = Math.random().toString(36).substring(2, 9); // Generating a random ID
  let contact = { id, createdAt: Date.now() }; // Creating a new contact object
  let contacts = await getContacts(); // Retrieving existing contacts
  contacts.unshift(contact); // Adding the new contact to the beginning of the contacts array
  await set(contacts); // Updating the contacts in local storage
  return contact; // Returning the newly created contact
}

// Function to retrieve a single contact by ID
export async function getContact(id) {
  await fakeNetwork(`contact:${id}`); // Simulating network delay
  let contacts = await localforage.getItem("contacts"); // Retrieving contacts from local storage
  let contact = contacts.find(contact => contact.id === id); // Finding the contact with the given ID
  return contact ?? null; // Returning the contact or null if not found
}

// Function to update a contact
export async function updateContact(id, updates) {
  await fakeNetwork(); // Simulating network delay
  let contacts = await localforage.getItem("contacts"); // Retrieving contacts from local storage
  let contact = contacts.find(contact => contact.id === id); // Finding the contact to update
  if (!contact) throw new Error("No contact found for", id); // Throwing an error if the contact is not found
  Object.assign(contact, updates); // Merging the updates into the contact object
  await set(contacts); // Updating the contacts in local storage
  return contact; // Returning the updated contact
}

// Function to delete a contact by ID
export async function deleteContact(id) {
  let contacts = await localforage.getItem("contacts"); // Retrieving contacts from local storage
  let index = contacts.findIndex(contact => contact.id === id); // Finding the index of the contact to delete
  if (index > -1) {
    contacts.splice(index, 1); // Removing the contact from the array if found
    await set(contacts); // Updating the contacts in local storage
    return true; // Returning true to indicate successful deletion
  }
  return false; // Returning false if the contact was not found
}

// Helper function to update contacts in local storage
function set(contacts) {
  return localforage.setItem("contacts", contacts);
}

// Utility function to simulate network delay and cache results
let fakeCache = {}; // Cache to store network request results

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {}; // Resetting cache if no key is provided
  }
  if (fakeCache[key]) {
    return; // Returning early if the result is already cached
  }
  fakeCache[key] = true; // Marking the result as cached
  // Simulating a network delay
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}
