import { google } from 'googleapis';
import supabase from './supabase';
// const { google } = require('googleapis');

// VARSITY_CALENDAR = 'unf92gqn4d6h2hpo4a7hgu26bo@group.calendar.google.com';
// JV_CALENDAR = 'pm01daa6v3kosk9a43c88v2epo@group.calendar.google.com';
// TEAM_CALENDAR = '6urfeejbvf98os9r16sf94eqdc@group.calendar.google.com';

const GOOGLE_CREDENTIALS = {
  type: 'service_account',
  project_id: 'hsdb-333821',
  private_key_id: '256f26bc6a6fb09fd0f8074811b93a7e0d195a81',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDqR+k3gSfF4Ool\njbThaXlSXtPGSjpFDGWGF7Q2pWa+tySn6GF+gDHdb3XqFKbG65KTg4p1FqWFX8wB\ndc2loAnqUky3wDqIZbBfNdb0OssYPWyedyRPAdorCHw1HF00EhMCJJtMbkhdGtvc\nmg1cMTKhwSJLcKReIPR7bwxr+3sr8hTorIngQbVEyEXv2NifS+r09cFFbSwbqaJC\n8NTVCCEd6Qnqeo2agt1HbdElU7r0YRZIvsEAPADiinOZJ3qv4SUlr6KRuSnWHXSb\n8+Yl3AKhoGI9EDM+MrZfCaMuBNqZ4lq6DNlNnwGRxcRYFov0WificlM1XcYV0Xxb\ne48vU0whAgMBAAECggEAClTFegceA+HZMXLASThnezRnTlUzoJvdVj5xWf+NOlfF\nLApZUkTA7izeHEZw3FDDE/I3BtbK0cjZrC7PtMAL7+NVMr0tV5p0Xp53Linxjs4W\nnh5O4ZUJU+B56bWofoVVhUCsAIDUfBaVH3NDp48b1no30u/Sr7vwTAknmRNr6RIc\nMpg8c/nCyB1DCHCoekCCYk2td+sVBL9hCWg0jBsEr6B+1QKUhlhmpF4FhB8WX0Pk\n2wQhi+ujQlvxMYLGIB556LVKBjxpmZ7X0baKguuFbnUl0lZjGMBQOz7PoX8aqLzA\nW7rD+eG+Ng7EI1puZUXwnCQQY773cJ/Gt8/ffNwqyQKBgQD7gWja1Ct6nApQ4iIm\nfFEPCUGLzZNcuE+xfY3iBgZsmTOLe4Uj4VPXws8cZmgbzk80H0hEly9RMw6+rizx\nh2bMkHmXSNrTut8qAPCzlo1C/NyheLbNKkE7YfSqFb4KVSnk4HQxUZqFxRMni9hj\nuL4m23AtZS/VfB0+rI/lbFL6EwKBgQDud7O8I3QO6TmxOggb/9B1+u85Zstgf9bb\n+S9l79H6cMMYQSAmfytkDgoTsTm06JIjdFCzU4IKZJ065rrKGQLvmQCnOtV+JGqh\nuGO7My4emsrQlH8vO9ts2swU4dKUwX7JEuW/fV8BZdtXsZ4zmPHC1g1DD9Z+XeR8\nyia4ZrrnewKBgQDSI9BedsRVT6d26VqrWVfI/mzbyMqFwCImJMe1wF8BwgfFVVFr\nJ0wMjOLL0ezOvtSCsliJpuCMMeLyA0neDMohxd0yQFdGbW8lA2AaTYJ+JBScfeYP\nCm0ylqf8rOn6bCny6G9s/cfkWUOl2TzWJXgLs3HJHDCZaXht83TPtnCmLQKBgQCQ\ncb9UGaGGGq1QdZdN5nFN1XasLWDJjgYGbnTQaSima0ExYtlnmCYfUAW4keQjebBz\ne1Qam12sj+9RK0s/eVD28pWbth51bveMB9WZIdIwxZBOMXSslrQ9xnZRu8vDQUVb\n5G93wygV/62R+8uY826VlvSnh2NkXdk14Xj8v3U9GwKBgGR9kBjOjT4IpoqX92MH\nJTNKIg+4w7P2YSmD7AcTIdZs6HrybJ9Sit33KqeWo31fn9GkanPrG2FFTeOBsQve\n7RT+3gX7/JujGjZvQnM96h3xM4FRRWrDzwVuQPJITcyhHQzJ+o5DeRrUnKckup8s\nKvEZhmnFse/2lOAe3K55WpXa\n-----END PRIVATE KEY-----\n',
  client_email: 'testingapps@hsdb-333821.iam.gserviceaccount.com',
  client_id: '104992998182689683553',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/testingapps%40hsdb-333821.iam.gserviceaccount.com',
};

const GOOGLE_API = 'AIzaSyAbbRFxdeJw2t-7U3cKe6eRdfS5a9JtnKI';
const GOOGLE_CLIENT_ID =
  '644051975299-9j1jovi8htfeivvmod78rqb9qvo9mep0.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com//auth/calendar.calendars',
  'https://www.googleapis.com/auth/calendar.events.owned',
  'https://www.googleapis.com/auth/calendar.events',
];
const GOOGLE_REFRESH_TOKEN =
  '1//04BmyTWGu8N2tCgYIARAAGAQSNwF-L9IrXe3NFPCJ_ltFthGjx6dUBSBH4aaKN0lbz0qCsN_iwwLCLnqdUk5kV6EC9Z3tu_hY0XU';

// //** declare calendar instance */
const CREDENTIALS = JSON.parse(GOOGLE_CREDENTIALS);
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
];
const privateKey = CREDENTIALS.private_key.replace(/\\n/g, '\n');
const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  privateKey,
  SCOPES
);
export async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/spreadsheets',
      ],

      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  console.log(data);
}

// async function googleSignIn() {
//   const { error } = await supabaseClient.auth.signInWithOAuth({
//     provider: 'google',
//     options: {
//       scopes: [
//         'https://www.googleapis.com/auth/calendar',
//         'https://www.googleapis.com/auth/spreadsheets',
//       ],
//     },
//   });
//   if (error) {
//     alert('Error logging in to Google provider with Supabase');
//     console.log(error);
//   }
// }

export async function logoutGoogle() {
  const { error } = await supabase.auth.signOut();
}
export const calendar = google.calendar({ version: 'v3', auth });
