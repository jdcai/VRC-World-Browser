import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios, { AxiosInstance } from "axios";
import vrchat from "vrchat";

dotenv.config();

async function main() {
  // const app: Express = express();
  // const port = process.env.PORT;

  const configuration = new vrchat.Configuration({
    username: process.env.USER,
    password: process.env.PASSWORD,
  });

  const axiosConfiguration: AxiosInstance = axios.create({
    headers: {
      "User-Agent": `${process.env.USER_AGENT}`,
    },
  });

  // Step 2. VRChat consists of several API's (WorldsApi, UsersApi, FilesApi, NotificationsApi, FriendsApi, etc...)
  // Here we instantiate the Authentication API which is required for logging in.
  const AuthenticationApi = new vrchat.AuthenticationApi(
    configuration,
    undefined,
    axiosConfiguration
  );

  // // Step 3. Calling getCurrentUser on Authentication API logs you in if the user isn't already logged in.
  AuthenticationApi.getCurrentUser().then((resp: { data: any }) => {
    console.log(resp);
    const currentUser = resp.data;
    console.log(`Logged in as: ${currentUser.displayName}`);
  });
}

main();
// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });

// app.listen(port, () => {
//   console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
// });
