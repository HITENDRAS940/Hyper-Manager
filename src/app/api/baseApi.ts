export const BASE_URL = import.meta.env.VITE_API_URL;

interface ApiRequestOptions extends RequestInit {
    data?: any;
}

export async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const { data, headers, ...customConfig } = options;
    const token = localStorage.getItem('accessToken');

    const isFormData = data instanceof FormData;
    const config: RequestInit = {
        method: data ? 'POST' : 'GET',
        headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...headers,
        },
        ...customConfig,
    };

    if (data) {
        config.body = isFormData ? data : JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // Handle authentication errors globally
    if (response.status === 401) {
        localStorage.removeItem('accessToken');
        window.dispatchEvent(new Event('auth-unauthorized'));
        throw new Error('Your session has expired. Please log in again.');
    }

    // Check content type
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.indexOf("application/json") !== -1;

    if (!response.ok) {
        let errorData;
        if (isJson) {
            errorData = await response.json().catch(() => ({}));
        } else {
            const text = await response.text();
            errorData = { message: text };
        }
        throw new Error(errorData.message || 'Something went wrong');
    }

    // Handle empty responses
    if (response.status === 204) {
        return {} as T;
    }

    if (isJson) {
        return response.json();
    } else {
        const text = await response.text();
        return { message: text } as unknown as T;
    }
}
