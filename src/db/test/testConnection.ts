import sequelize from "../sequelize.js";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos exitosa");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  } finally {
    await sequelize.close();
  }
})();
