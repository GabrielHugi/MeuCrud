import { API_URL } from "./configApi";

export async function getPeopleCrud() {
    const response = await fetch(`${API_URL}/people`);
    const data = await response.json();
    return data;
}

export async function createPersonCrud(person) {
    const response = await fetch(`${API_URL}/people`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(person)
    });

    return response.json();
}

export async function updatePersonCrud(id, person) {
    const response = await fetch(`${API_URL}/people/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(person)
    });

    return response.json();
}

export async function deletePersonCrud(id) {
    await fetch(`${API_URL}/people/${id}`, {
        method: "DELETE"
    });
}