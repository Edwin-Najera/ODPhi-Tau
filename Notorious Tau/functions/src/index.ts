/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
// import {onRequest} from "firebase-functions/https";
// import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();

export const setUserRole = onCall( async (request) => {
    if(!request.auth){
        throw new Error("Must be loggen in.");
    }

    if(request.auth.token.role !== "admin"){
        throw new Error("Only admin can assign roles");
    }
    
    const {uid, role} = request.data as {
        uid: string;
        role: "admin" | "alumni" | "bro" | "active";
    };

    if(request.auth.token.role === ""){
        await admin.auth().setCustomUserClaims(uid, {});
        return {message: "Role removed"};
    }

    await admin.auth().setCustomUserClaims(uid, {role});

    return {message: `Role ${role} assigned successfully`};
});

export const listUser = onCall( async (request) => {
    if(!request.auth || request.auth.token.role !== "admin"){
        throw new Error("Only admins can can list users");
    }

    const list = await admin.auth().listUsers();

    return list.users.map((user) => ({
        uid: user.uid,
        email: user.email,
        role: user.customClaims?.role || "none"
    }));
});



// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
