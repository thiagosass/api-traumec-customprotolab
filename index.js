const express = require("express");
import cors from 'cors'
const userRoutes = require("./routes/users.js");
const selectOptionsRoutes = require("./routes/selectOptionsRoutes.js");
const casesRoutes = require("./routes/casesRoutes.js");
const timelineRoutes = require("./routes/timelineRoutes.js");

const app = express();

app.use(express.json());
app.use(cors());

// Rotas
app.use("/users", userRoutes);
app.use("/select-options", selectOptionsRoutes);
app.use("/cases", casesRoutes);
app.use("/timeline", timelineRoutes);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});