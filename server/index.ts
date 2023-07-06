import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios, { AxiosInstance } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { AuthenticationApi, Configuration, OrderOption, ReleaseStatus, SortOption, WorldsApi } from "vrchat";
import fs from "fs";
import tough from "tough-cookie";
import totp from "totp-generator";
import rateLimit, { RateLimitedAxiosInstance } from "axios-rate-limit";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const configuration = new Configuration({
    username: process.env.USER,
    password: process.env.PASSWORD,
});

const axiosConfiguration: RateLimitedAxiosInstance = rateLimit(
    axios.create({
        headers: {
            "User-Agent": `${process.env.USER_AGENT}`,
        },
    }),
    {},
);

wrapper(axiosConfiguration);
axiosConfiguration.defaults.withCredentials = true;

async function initVRC() {
    try {
        // Step 2. VRChat consists of several API's (WorldsApi, UsersApi, FilesApi, NotificationsApi, FriendsApi, etc...)
        // Here we instantiate the Authentication API which is required for logging in.
        const authenticationApi = new AuthenticationApi(configuration, undefined, axiosConfiguration);

        let data = fs.readFileSync("./cookies.json", "utf-8");

        if (data !== "") {
            let cookies = JSON.parse(data);
            axiosConfiguration.defaults.jar = tough.CookieJar.fromJSON(cookies);
        } else {
            axiosConfiguration.defaults.jar = new tough.CookieJar();
        }

        axiosConfiguration.defaults.jar.setCookie(
            new tough.Cookie({
                key: "apiKey",
                value: "JlE5Jldo5Jibnk5O5hTx6XVqsJu4WJ26",
            }),
            "https://api.cloud",
        );

        // // Step 3. Calling getCurrentUser on Authentication API logs you in if the user isn't already logged in.
        let userResponse = await authenticationApi.getCurrentUser();

        if (!userResponse.data.displayName) {
            console.log("autenticating");
            const response = await authenticationApi.verify2FA({
                code: totp(process.env.VRC_2FA_SECRET!),
            });

            if (response.data.verified) {
                const cookies = JSON.stringify(axiosConfiguration.defaults.jar.toJSON());
                fs.writeFileSync("./cookies.json", cookies, "utf-8");
                userResponse = await authenticationApi.getCurrentUser();
            }
        }
        axiosConfiguration.setRateLimitOptions({ maxRequests: 1, perMilliseconds: 15000 });
        console.log(userResponse.data.displayName);
    } catch (e) {
        console.log(e);
    }
}

initVRC();

app.get("/api/currentUser", async (req: Request, res: Response) => {
    const authenticationApi = new AuthenticationApi(configuration, undefined, axiosConfiguration);
    let userResponse = await authenticationApi.getCurrentUser();

    res.send(userResponse.data.displayName);
});

const getSortOptionFromString = (sort: string | undefined) => {
    return sort !== null && Object.values(SortOption).includes(sort as SortOption)
        ? (sort as SortOption)
        : SortOption.Random;
};

app.get("/api/worlds", (req, res) => {
    const worldsApi = new WorldsApi(configuration, undefined, axiosConfiguration);
    const options = {
        featured: false,
        sort: getSortOptionFromString(req.query.sort?.toString()),
        user: undefined,
        userId: undefined,
        n: 100,
        order: OrderOption.Descending,
        offset: 0,
        search: req.query.q?.toString(),
        tag: undefined,
        notag: undefined,
        releaseStatus: ReleaseStatus.Public,
        maxUnityVersion: undefined,
        minUnityVersion: undefined,
        platform: undefined,
        options: undefined,
    };
    worldsApi
        .searchWorlds(
            options.featured,
            options.sort,
            options.user,
            options.userId,
            options.n,
            options.order,
            options.offset,
            options.search,
            options.tag,
            options.notag,
            options.releaseStatus,
            options.maxUnityVersion,
            options.minUnityVersion,
            options.platform,
            options.options,
        )
        .then((resp) => {
            const worlds = resp.data;

            res.send(worlds);
        })
        .catch((err) => {
            res.status(500).send(`Error: ${err.message}`);
        });
});

app.get("/api/world/:id", (req, res) => {
    const worldsApi = new WorldsApi(configuration, undefined, axiosConfiguration);
    const worldId = req.params.id;
    if (req.params.id) {
        worldsApi
            .getWorld(worldId)
            .then((resp) => {
                const worlds = resp.data;
                res.send(worlds);
            })
            .catch((err) => {
                res.status(500).send(`Error: ${err.message}`);
            });
    }
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
