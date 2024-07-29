export const msalConfig = {
    auth: {
        clientId: "66e8ab85-95de-4bda-97c0-78b2d010373e",
        authority: "https://login.microsoftonline.com/1014faf0-9950-4ab7-94af-5e630cd0e56d",
        redirectUri: "http://localhost:3000",
        postLogoutRedirectUri: "http://localhost:3000",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

export const loginRequest = {
    scopes: ["User.Read", "Group.Read.All"]
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
    graphOrganizationEndpoint: "https://graph.microsoft.com/v1.0/me/memberOf"
};
