const faker = require("faker");
const Seeder = require("mysql-db-seed").Seeder;

const seed = new Seeder(
    10,
    "localhost",
    "timeengc_hospital",
    "hospital123",
    "timeengc_hospital"
);

(async () => {
    await seed.seed(
        10,
        "Patient",
        {
            patient_id:faker.random.number,
            FN:  faker.name.firstName,
            LN:  faker.name.lastName,
            cardID: faker.random.number,
            phone: faker.random.number,
            insuranceCard: faker.random.number,
            address:faker.name.firstName,
        }
    )
    seed.exit();
    process.exit();
})();