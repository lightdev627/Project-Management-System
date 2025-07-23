import * as msal from "@azure/msal-browser";
import axios from "axios";

import {useUserStore} from "../store/index";
// --- Azure AD App Config ---
const TENANT_ID = "893c3206-7236-4ab1-82b5-d8d51b82ac12";
const CLIENT_ID = "b3aed150-5011-4b6f-9143-77658825ab99";
const sharepointSiteUrl = "https://e1aoa.sharepoint.com/sites/Project-Management";

const headers = {
  Authorization: null,
  "X-RequestDigest": null,
  "Content-Type": "application/json;odata=verbose",
  "If-Match": "*",
  Accept: "application/json;odata=nometadata",
};

const useLocalStorage = false;

export async function loadAccessToken() {
  headers.Authorization = window.localStorage.getItem("Authorization");

  if (useLocalStorage) return;

  // MSAL instance for Azure AD authentication
  const msalInstance = new msal.PublicClientApplication({
    auth: {
      clientId: CLIENT_ID,
      authority: "https://login.microsoftonline.com/" + TENANT_ID,
      redirectUri: window.location.origin,
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: false,
    },
  });

  await msalInstance.initialize();

  // Login and get access token
  const { tokenType, accessToken } = await msalInstance.loginPopup({
    scopes: ["https://e1aoa.sharepoint.com/.default"],
  });
  
  headers.Authorization = tokenType + " " + accessToken;
  window.localStorage.setItem("Authorization", headers.Authorization);
  
}

// --- Get SharePoint request digest and user info ---
export async function loadRequestDigest() {

  const userStore = useUserStore();

  // Get request digest for SharePoint API
  const res = await axios.post(
    `${sharepointSiteUrl}/_api/contextinfo`,
    {},
    { headers }
  );
  const data = await res.data;

  if (data.error_description) {
    throw new Error(data.error_description);
  }

  headers["X-RequestDigest"] = data.FormDigestValue;

  // Fetch current user and commit to store
  (async function getCurrentUser() {
    const res = await axios.get(
      `${sharepointSiteUrl}/_api/web/currentuser`,
      { headers }
    );
    const data = await res.data;
    userStore.setUser(data);
  })();

  // Fetch all site users and commit to store
  (async function getSiteusers() {
    const res = await axios.get(
      `${sharepointSiteUrl}/_api/web/siteusers`,
      { headers }
    );
    const data = await res.data;

    userStore.setSiteUsers(data.value.filter((it) => it.PrincipalType == 1 && it.Email));
  })();
}

export async function axiosRequest(method, ListName, details = null, body = null) {

  let res = {};

  if(method == 'get' || method == "delete") {
    res = await axios[method](
      `${sharepointSiteUrl}/_api/web/lists/getbytitle('${ListName}')/items` + (details || ""),
      {headers }
    );
  } else {
    res = await axios[method](
      `${sharepointSiteUrl}/_api/web/lists/getbytitle('${ListName}')/items` + (details || ""),
      body,
      { headers }
    );
  }

  if (res.status == 401) {
    alert("Unauthorized");
    return window.location.reload();
  }

  if (method == "put" || method == "delete") return;

  const data = await res.data;

  return method == "get" ? data.value : data;
}