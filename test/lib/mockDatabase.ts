import { init } from './seedDatabase';

const random = true

init({ random }).then((data) => {
    console.log("Database filled with data");
});
