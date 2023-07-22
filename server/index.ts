import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { AuthenticationApi, Configuration, OrderOption, ReleaseStatus, SortOption, WorldsApi } from "vrchat";
import fs from "fs";
import tough from "tough-cookie";
import totp from "totp-generator";
import rateLimit, { RateLimitedAxiosInstance } from "axios-rate-limit";
import path from "path";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

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
// Need https://github.com/aishek/axios-rate-limit/issues/21 for abort controller to work with rate limit
let controller: AbortController | null = null;

async function initVRC() {
    try {
        let data = fs.readFileSync("./cookies.json", "utf-8");
        if (data !== "") {
            let cookies = JSON.parse(data);
            axiosConfiguration.defaults.jar = tough.CookieJar.fromJSON(cookies);
        } else {
            axiosConfiguration.defaults.jar = new tough.CookieJar();
        }
    } catch (e) {
        console.log(e);
        axiosConfiguration.defaults.jar = new tough.CookieJar();
    }
    try {
        const authenticationApi = new AuthenticationApi(configuration, undefined, axiosConfiguration);

        axiosConfiguration.defaults.jar.setCookie(
            new tough.Cookie({
                key: "apiKey",
                value: "JlE5Jldo5Jibnk5O5hTx6XVqsJu4WJ26",
            }),
            "https://api.cloud",
        );

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

type WorldsQuery = {
    q: string;
    sort: string;
    tags: string[];
};

app.get("/api/worlds", (req: Request<{}, {}, {}, WorldsQuery>, res) => {
    req.on("close", () => {
        console.log("close");
        if (controller) {
            console.log("closed");
            controller.abort();
        }
    });

    controller = new AbortController();
    axiosConfiguration.defaults.signal = controller.signal;
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
        tag: req.query.tags?.join(),
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
            console.log("worlds", req.query);
            controller = null;
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
                console.log("world", req.params.id);
                res.send(worlds);
            })
            .catch((err) => {
                res.status(500).send(`Error: ${err.message}`);
            });
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
