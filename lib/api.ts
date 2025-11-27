export default async function fetchDataFromAPI(url: string, method: string = "GET", body?: object, swrCall: boolean = false, cookie?: string) {
    const options: RequestInit = {
        cache: 'no-store',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookie || '',
        },
        method,
    }
    const methodRequiresBody = method === 'POST' || method === 'PUT' || method === 'PATCH';

    if (body && methodRequiresBody) {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, options);

    if (swrCall) {
        return response.json();
    }

    return response;
}