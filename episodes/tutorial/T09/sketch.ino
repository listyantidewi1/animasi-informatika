#include <DHTesp.h>
#include <LiquidCrystal_I2C.h>

DHTesp sensor;
LiquidCrystal_I2C layar(0x27, 16, 2);
const int KIPAS = 4;
const float BATAS = 30.0;

void setup() {
  sensor.setup(15, DHTesp::DHT22);
  layar.init();
  layar.backlight();
  pinMode(KIPAS, OUTPUT);
}

void loop() {
  float suhu = sensor.getTemperature();
  layar.setCursor(0, 0);
  layar.print("Suhu: ");
  layar.print(suhu, 1);
  layar.print(" C  ");
  layar.setCursor(0, 1);
  if (suhu > BATAS) {
    digitalWrite(KIPAS, HIGH);
    layar.print("Kipas: NYALA");
  } else {
    digitalWrite(KIPAS, LOW);
    layar.print("Kipas: MATI ");
  }
  delay(1000);
}
