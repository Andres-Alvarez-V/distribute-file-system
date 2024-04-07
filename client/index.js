const app = require("./app");
const config = require("./core/utils/config");
const logger = require("./core/utils/logger");

app.listen(config.PORT, () => {
  logger.info(`Client Server running on port ${config.PORT}`);
});
