db = db.getSiblingDB('tfg'); // switch to cafeteria DB

db.dimensiones.insertMany([
    {
        nombre: "Pequeño",
        ancho: 20,
        alto: 20,
        largo: 30,
        peso: 2
    },
    {
        nombre: "Mediano",
        ancho: 35,
        alto: 24,
        largo: 35,
        peso: 5
    },
    {
        nombre: "Grande",
        ancho: 40,
        alto: 37,
        largo: 40,
        peso: 10
    },
    {
        nombre: "Extra grande",
        ancho: 55,
        alto: 39,
        largo: 55,
        peso: 20
    }
]);
