"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
// routes.use('/auth', auth)
router.get('/ping', (req, res) => {
    res.send('pong');
});
exports.default = router;
//# sourceMappingURL=index.js.map