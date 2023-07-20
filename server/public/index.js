"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const axios_cookiejar_support_1 = require("axios-cookiejar-support");
const vrchat_1 = require("vrchat");
const fs_1 = __importDefault(require("fs"));
const tough_cookie_1 = __importDefault(require("tough-cookie"));
const totp_generator_1 = __importDefault(require("totp-generator"));
const axios_rate_limit_1 = __importDefault(require("axios-rate-limit"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
const configuration = new vrchat_1.Configuration({
    username: process.env.USER,
    password: process.env.PASSWORD,
});
const axiosConfiguration = (0, axios_rate_limit_1.default)(axios_1.default.create({
    headers: {
        "User-Agent": `${process.env.USER_AGENT}`,
    },
}), {});
(0, axios_cookiejar_support_1.wrapper)(axiosConfiguration);
axiosConfiguration.defaults.withCredentials = true;
function initVRC() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = fs_1.default.readFileSync("./cookies.json", "utf-8");
            if (data !== "") {
                let cookies = JSON.parse(data);
                axiosConfiguration.defaults.jar = tough_cookie_1.default.CookieJar.fromJSON(cookies);
            }
            else {
                axiosConfiguration.defaults.jar = new tough_cookie_1.default.CookieJar();
            }
        }
        catch (e) {
            console.log(e);
            axiosConfiguration.defaults.jar = new tough_cookie_1.default.CookieJar();
        }
        try {
            const authenticationApi = new vrchat_1.AuthenticationApi(configuration, undefined, axiosConfiguration);
            axiosConfiguration.defaults.jar.setCookie(new tough_cookie_1.default.Cookie({
                key: "apiKey",
                value: "JlE5Jldo5Jibnk5O5hTx6XVqsJu4WJ26",
            }), "https://api.cloud");
            let userResponse = yield authenticationApi.getCurrentUser();
            if (!userResponse.data.displayName) {
                console.log("autenticating");
                const response = yield authenticationApi.verify2FA({
                    code: (0, totp_generator_1.default)(process.env.VRC_2FA_SECRET),
                });
                if (response.data.verified) {
                    const cookies = JSON.stringify(axiosConfiguration.defaults.jar.toJSON());
                    fs_1.default.writeFileSync("./cookies.json", cookies, "utf-8");
                    userResponse = yield authenticationApi.getCurrentUser();
                }
            }
            axiosConfiguration.setRateLimitOptions({ maxRequests: 1, perMilliseconds: 15000 });
            console.log(userResponse.data.displayName);
        }
        catch (e) {
            console.log(e);
        }
    });
}
initVRC();
app.get("/api/currentUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticationApi = new vrchat_1.AuthenticationApi(configuration, undefined, axiosConfiguration);
    let userResponse = yield authenticationApi.getCurrentUser();
    res.send(userResponse.data.displayName);
}));
const getSortOptionFromString = (sort) => {
    return sort !== null && Object.values(vrchat_1.SortOption).includes(sort)
        ? sort
        : vrchat_1.SortOption.Random;
};
app.get("/api/worlds", (req, res) => {
    var _a, _b, _c;
    const worldsApi = new vrchat_1.WorldsApi(configuration, undefined, axiosConfiguration);
    const options = {
        featured: false,
        sort: getSortOptionFromString((_a = req.query.sort) === null || _a === void 0 ? void 0 : _a.toString()),
        user: undefined,
        userId: undefined,
        n: 100,
        order: vrchat_1.OrderOption.Descending,
        offset: 0,
        search: (_b = req.query.q) === null || _b === void 0 ? void 0 : _b.toString(),
        tag: (_c = req.query.tags) === null || _c === void 0 ? void 0 : _c.join(),
        notag: undefined,
        releaseStatus: vrchat_1.ReleaseStatus.Public,
        maxUnityVersion: undefined,
        minUnityVersion: undefined,
        platform: undefined,
        options: undefined,
    };
    worldsApi
        .searchWorlds(options.featured, options.sort, options.user, options.userId, options.n, options.order, options.offset, options.search, options.tag, options.notag, options.releaseStatus, options.maxUnityVersion, options.minUnityVersion, options.platform, options.options)
        .then((resp) => {
        const worlds = resp.data;
        console.log("worlds", req.query);
        res.send(worlds);
    })
        .catch((err) => {
        res.status(500).send(`Error: ${err.message}`);
    });
});
app.get("/api/world/:id", (req, res) => {
    const worldsApi = new vrchat_1.WorldsApi(configuration, undefined, axiosConfiguration);
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
    res.sendFile(path_1.default.join(__dirname, "index.html"));
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
