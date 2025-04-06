-- CreateTable
CREATE TABLE "air_quality" (
    "sitename" TEXT,
    "humidity" DECIMAL(5,2),
    "temperature" DECIMAL(5,2),
    "noise" INTEGER,
    "pm2_5" DECIMAL(5,2),
    "pm10" DECIMAL(5,2),
    "receivedtime" TIMESTAMP(6),
    "reportedtime_utc" TIMESTAMP(6),
    "id" SERIAL NOT NULL,

    CONSTRAINT "air_quality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "water_quality" (
    "id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(6),
    "cond" DOUBLE PRECISION,
    "depth" DOUBLE PRECISION,
    "nlf" DOUBLE PRECISION,
    "odo_sat" DOUBLE PRECISION,
    "odo_cb" DOUBLE PRECISION,
    "odo" DOUBLE PRECISION,
    "pressure" DOUBLE PRECISION,
    "sal" DOUBLE PRECISION,
    "spcond" DOUBLE PRECISION,
    "tds" DOUBLE PRECISION,
    "turbidity" DOUBLE PRECISION,
    "tss" DOUBLE PRECISION,
    "wiper_position" DOUBLE PRECISION,
    "temp" DOUBLE PRECISION,
    "vertical_position" DOUBLE PRECISION,
    "battery" TEXT,
    "cable_pwr" TEXT,
    "payload" JSONB,
    "device_id" TEXT,
    "ip" TEXT,

    CONSTRAINT "water_quality_pkey" PRIMARY KEY ("id")
);
