#include <DHTesp.h>
#include <LiquidCrystal_I2C.h>

DHTesp sensor;
LiquidCrystal_I2C layar(0x27, 16, 2);

void setup() {
  sensor.setup(15, DHTesp::DHT22);
  layar.init();
  layar.backlight();
}

void loop() {
  float suhu = sensor.getTemperature();
  layar.setCursor(0, 0);
  layar.print("Suhu: ");
  layar.print(suhu, 1);
  layar.print(" C  ");
  delay(1000);
}