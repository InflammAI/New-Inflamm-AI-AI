"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const vytap_1 = __importDefault(require("./routes/vytap"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// ---------- Middleware ----------
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ---------- Routes ----------
app.use("/api/vytap", vytap_1.default);
// ---------- Health Check ----------
app.get("/", (req, res) => {
    res.json({ message: "Inflamm AI API is running!" });
});
// ---------- Error Handler ----------
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});
// ---------- Start Server ----------
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
