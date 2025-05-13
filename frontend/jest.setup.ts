import '@testing-library/jest-dom/extend-expect';


if (typeof global.structuredClone !== "function") {
    global.structuredClone = (obj: any) => {
        if (obj === undefined) return undefined;
        return JSON.parse(JSON.stringify(obj));
    };
}

// Window matchMedia mock

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});