const mongoose = require("mongoose");
const CounterAllocation = require("../src/models/Counter");
import "dotenv/config";

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const ops = [];
  for (let i = 1; i <= 13; i++) ops.push({ side: "A", number: i });
  for (let i = 1; i <= 21; i++) ops.push({ side: "B", number: i });

  for (const c of ops) {
    await CounterAllocation.updateOne(
      { side: c.side, number: c.number },
      { $setOnInsert: c },
      { upsert: true }
    );
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
