import { API_URL } from "./configApi";

export async function getPeopleCrud(name = '') {
    let url = `${API_URL}/people`;
    
    if (name) {
        const where = {
            or: [
                { firstName: { contains: name } },
                { lastName: { contains: name } }
            ]
        };
          
        const queryString = new URLSearchParams({
            _where: JSON.stringify(where)
        }).toString();
          
        url += `?${queryString}`;
    }

    const response = await fetch(url);
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