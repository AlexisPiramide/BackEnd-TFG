import app from "./app";

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Application started on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Servidor Corriendo");
});