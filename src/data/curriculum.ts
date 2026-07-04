import { Level } from '../types';

const staticCurriculum: Level[] = [
  {
    id: 1,
    title: {
      uz: "1-daraja: Robototexnika Asoslari",
      ru: "Уровень 1: Основы Робототехники",
      en: "Level 1: Robotics Basics"
    },
    subtitle: {
      uz: "Robotlar nima va ular qanday ishlaydi?",
      ru: "Что такое роботы и как они работают?",
      en: "What are robots and how do they work?"
    },
    description: {
      uz: "Robototexnika dunyosiga ilk qadam. Robotlar tarixi, turlari, sensorlar va aktuatorlar haqida umumiy tushunchalar.",
      ru: "Первый шаг в мир робототехники. Введение в историю роботов, их классификацию, датчики и актуаторы.",
      en: "First step into the robotics world. Intro to robot history, classification types, sensors, and actuators."
    },
    lessons: [
      {
        id: "l1_1",
        levelId: 1,
        title: {
          uz: "Robototexnikaga kirish va uning tarixi",
          ru: "Введение в робототехнику и история",
          en: "Introduction to Robotics & History"
        },
        description: {
          uz: "Robot nima, uning asosiy komponentlari va robototexnika qanday rivojlanganligi haqida dars.",
          ru: "Что такое робот, его основные компоненты и как развивалась робототехника.",
          en: "What is a robot, its core components, and how robotics evolved over time."
        },
        videoUrl: "https://www.youtube.com/embed/8wXal7gSClE",
        isPremium: false,
        simulationType: "code-only",
        content: {
          uz: "### Robototexnika nima?\nRobototexnika — bu robotlarni loyihalash, qurish va ulardan foydalanish bilan shug'ullanadigan muhandislik sohasi. Robot — bu tashqi muhitdan axborot olib, uni qayta ishlaydigan va belgilangan amallarni avtomatik bajaradigan mexanik qurilma.\n\n### Robotning 3 ta oltin qoidasi (Ayzek Azimov):\n1. Robot insonga zarar yetkazmasligi lozim.\n2. Inson buyruqlariga bo'ysunishi lozim.\n3. O'z xavfsizligini himoya qilishi lozim (agar 1 va 2-qoidalarga zid kelmasa).\n\n### Sensor va Aktuatorlar:\n* **Sensorlar (Datchiklar):** Atrof-muhitni his qilish uchun (Kamera, Ultratovush, Harorat).\n* **Aktuatorlar (Ijrochi a'zolar):** Harakatlanish uchun (Dvigatellar, Servo, LED displeylar).",
          ru: "### Что такое Робототехника?\nРобототехника — это прикладная наука, занимающаяся разработкой, конструированием и применением роботов. Робот — это механическое устройство, способное воспринимать окружающий мир, анализировать информацию и совершать действия в соответствии с заложенной программой.\n\n### 3 Закона Робототехники (Айзек Азимов):\n1. Робот не может причинить вред человеку.\n2. Робот должен повиноваться командам человека.\n3. Робот должен заботиться о своей безопасности (если это не противоречит 1 и 2 законам).\n\n### Сенсоры и Актуаторы:\n* **Сенсоры (Датчики):** Позволяют роботу чувствовать мир (Ультразвук, Камера, Кнопки).\n* **Актуаторы (Приводы):** Позволяют совершать действия (Моторы, Сервоприводы, Светодиоды).",
          en: "### What is Robotics?\nRobotics is an engineering field focused on designing, constructing, and operating robots. A robot is an automated mechanical device that senses its environment, processes information, and performs physically programmed actions.\n\n### Three Laws of Robotics (Isaac Asimov):\n1. A robot may not injure a human being.\n2. A robot must obey orders given by humans.\n3. A robot must protect its own existence unless it conflicts with the First or Second Law.\n\n### Sensors and Actuators:\n* **Sensors:** Input devices to read environmental parameters (Camera, Ultrasonic, Temp sensors).\n* **Actuators:** Output devices executing physical actions (DC Motors, Servos, Buzzer, LEDs)."
        },
        quiz: {
          id: "q1_1",
          title: { uz: "Robototexnika Asoslari Testi", ru: "Тест основ робототехники", en: "Robotics Basics Quiz" },
          questions: [
            {
              id: "q1_1_1",
              text: {
                uz: "Robotning 'ko'zi' va 'qulog'i' bo'lib xizmat qiladigan qism nima deb ataladi?",
                ru: "Какая часть робота служит его 'глазами' и 'ушами'?",
                en: "What component serves as the 'eyes' and 'ears' of a robot?"
              },
              options: [
                { uz: "Aktuator (Dvigatel)", ru: "Актуатор (Двигатель)", en: "Actuator (Motor)" },
                { uz: "Sensor (Datchik)", ru: "Сенсор (Датчик)", en: "Sensor" },
                { uz: "Akkumulyator", ru: "Аккумулятор", en: "Battery" },
                { uz: "Mikrokontroller", ru: "Микроконтроллер", en: "Microcontroller" }
              ],
              correctOptionIndex: 1,
              explanation: {
                uz: "Sensorlar atrof-muhitdagi fizik parametrlarni (masofa, yorug'lik) o'lchab, elektr signaliga aylantiradi.",
                ru: "Сенсоры измеряют физические параметры окружения и превращают их в электрический сигнал.",
                en: "Sensors measure environmental physical parameters and translate them into electrical signals."
              }
            },
            {
              id: "q1_1_2",
              text: {
                uz: "Ayzek Azimovning birinchi qonuni qaysi?",
                ru: "Какой первый закон робототехники Айзека Азимова?",
                en: "What is the First Law of Robotics by Isaac Asimov?"
              },
              options: [
                { uz: "Robot o'z xavfsizligini asrashi lozim", ru: "Робот должен защищать себя", en: "Robot must protect itself" },
                { uz: "Robot insonga zarar yetkazmasligi lozim", ru: "Робот не должен вредить человеку", en: "Robot must not harm humans" },
                { uz: "Robot har doim harakatlanishi shart", ru: "Робот должен всегда двигаться", en: "Robot must always move" },
                { uz: "Robot faqat internetda ishlashi lozim", ru: "Робот должен работать только в сети", en: "Robot must only work online" }
              ],
              correctOptionIndex: 1,
              explanation: {
                uz: "Birinchi qonunga ko'ra, eng asosiy vazifa — inson xavfsizligini ta'minlashdir.",
                ru: "Согласно первому закону, главная задача — обеспечить безопасность человека.",
                en: "According to the First Law, human safety is the highest priority."
              }
            }
          ]
        },
        homework: {
          id: "hw1_1",
          title: {
            uz: "Robot dizayni va algoritm",
            ru: "Проектирование робота и алгоритм",
            en: "Robot Design and Algorithm"
          },
          description: {
            uz: "Aqlli tozalovchi robot uchun oddiy algoritm yozing. Masalan: Agar sensor g'ovni aniqlasa -> to'xtasin va chapga burilsin.",
            ru: "Напишите простой алгоритм для робота-пылесоса. Например: Если датчик обнаружил препятствие -> остановиться и повернуть налево.",
            en: "Write a simple pseudo-code algorithm for a vacuum robot. Example: If sensor detects obstacle -> stop and turn left."
          },
          prompt: "Write a pseudo-code algorithm for a basic obstacle-avoiding robot. Specify sensor input and actuator output.",
          defaultCode: `// RoboMaster Vacuum Robot Pseudo-code
void setup() {
  // Initialize Distance Sensor and Left/Right Wheel Motors
}

void loop() {
  int distance = readSensor();
  if (distance < 20) {
    // Obstacle ahead! Write instructions to avoid it
    
  } else {
    // Path is clear! Go forward
    
  }
}`
        }
      }
    ]
  },
  {
    id: 2,
    title: {
      uz: "2-daraja: Elektronika Asoslari",
      ru: "Уровень 2: Основы Электроники",
      en: "Level 2: Electronics Fundamentals"
    },
    subtitle: {
      uz: "Elektr zanjirlari, LED va Rezistorlar",
      ru: "Электрические цепи, светодиоды и резисторы",
      en: "Electric circuits, LEDs, and Resistors"
    },
    description: {
      uz: "Kuchlanish, Tok va Qarshilik tushunchalari. Breadboard (maket plata) bilan ishlash, svetodiodlarni ulash va Om qonunini amalda qo'llash.",
      ru: "Напряжение, Ток и Сопротивление. Работа с макетной платой, подключение светодиодов и практическое применение закона Ома.",
      en: "Voltage, Current, and Resistance. Working with breadboards, wiring LEDs, and using Ohm's Law in practice."
    },
    lessons: [
      {
        id: "l2_1",
        levelId: 2,
        title: {
          uz: "Om Qonuni va LED ulash",
          ru: "Закон Ома и подключение светодиода",
          en: "Ohm's Law & LED Wiring"
        },
        description: {
          uz: "Svetodiodni yonib ketishdan himoyalash uchun rezistorni to'g'ri tanlash va zanjir yig'ish sirlari.",
          ru: "Как правильно выбрать резистор, чтобы светодиод не сгорел, и собрать первую цепь.",
          en: "How to correctly size a resistor to prevent your LED from burning out, and wire your first circuit."
        },
        videoUrl: "https://www.youtube.com/embed/8Xp_6kYf99o",
        isPremium: false,
        simulationType: "led",
        content: {
          uz: "### Om Qonuni (U = I * R):\n* **U — Kuchlanish (Volt):** Elektr zaryadini harakatlantiruvchi kuch.\n* **I — Tok kuchi (Amper):** Zaryadlarning oqim tezligi.\n* **R — Qarshilik (Om):** Tok oqimiga to'sqinlik qilish darajasi.\n\n### Nima uchun rezistor kerak?\nSvetodiodlar (LED) juda sezgir. Agar ularni to'g'ridan-to'g'ri 5V manbaga ulasangiz, yuqori oqim sababli yonib ketadi. Rezistor oqimni cheklab beradi.\n*Formula:* R = (U_manba - U_led) / I_led\nAgar manba 5V, LED 2V va ishchi to'k 20mA (0.02A) bo'lsa: R = (5 - 2) / 0.02 = 150 Om.",
          ru: "### Закон Ома (U = I * R):\n* **U — Напряжение (Вольт):** Сила, движущая электрический заряд.\n* **I — Сила тока (Ампер):** Скорость направленного движения зарядов.\n* **R — Сопротивление (Ом):** Мера сопротивления проводника току.\n\n### Зачем нужен резистор?\nСветодиоды чувствительны. Если подключить их напрямую к источнику 5В, они сгорят из-за слишком большого тока. Резистор ограничивает ток.\n*Формула:* R = (U_источника - U_диода) / I_диода\nЕсли источник 5В, светодиоду нужно 2В при токе 20мА (0.02А): R = (5 - 2) / 0.02 = 150 Ом.",
          en: "### Ohm's Law (V = I * R):\n* **V — Voltage (Volts):** The electromotive pressure pushing charges.\n* **I — Current (Amperes):** The flow rate of electrical charges.\n* **R — Resistance (Ohms):** The opposition to the flow of current.\n\n### Why do we need Resistors?\nLEDs are delicate semiconductor diodes. Directly powering an LED with 5V causes runaway current that burns it instantly. A resistor limits the current.\n*Calculation:* R = (V_source - V_led) / I_led\nIf your source is 5V, LED forward voltage is 2V, and optimal current is 20mA (0.02A): R = (5 - 2) / 0.02 = 150 Ohms."
        },
        quiz: {
          id: "q2_1",
          title: { uz: "Elektronika Kviz", ru: "Тест по электронике", en: "Electronics Quiz" },
          questions: [
            {
              id: "q2_1_1",
              text: {
                uz: "Kuchlanish 9V, qarshilik 300 Om bo'lgan zanjirdagi tok kuchini toping.",
                ru: "Найдите силу тока в цепи с напряжением 9В и сопротивлением 300 Ом.",
                en: "Calculate the current in a circuit with 9V voltage and 300 Ohms resistance."
              },
              options: [
                { uz: "0.03 A (30mA)", ru: "0.03 А (30мА)", en: "0.03 A (30mA)" },
                { uz: "3 A", ru: "3 А", en: "3 A" },
                { uz: "2700 mA", ru: "2700 мА", en: "2700 mA" },
                { uz: "30 A", ru: "30 А", en: "30 A" }
              ],
              correctOptionIndex: 0,
              explanation: {
                uz: "I = U / R formula bo'yicha: 9 / 300 = 0.03 Amper yoki 30 mA.",
                ru: "По формуле I = U / R: 9 / 300 = 0.03 Ампер или 30 мА.",
                en: "By formula I = V / R: 9 / 300 = 0.03 Amps or 30 mA."
              }
            }
          ]
        },
        homework: {
          id: "hw2_1",
          title: {
            uz: "LED zanjiri qarshiligini hisoblash",
            ru: "Расчет сопротивления цепи светодиода",
            en: "LED Circuit Resistor Calculation"
          },
          description: {
            uz: "12V kuchlanishli akkumulyatorga 3V va 20mA ishchi xususiyatlariga ega bo'lgan ko'k rangli LED ulamoqchisiz. Rezistor qiymatini hisoblang va kodda yozing.",
            ru: "Вы хотите подключить синий светодиод (3В, 20мА) к аккумулятору 12В. Вычислите необходимое сопротивление резистора и напишите ответ в коде.",
            en: "Calculate the required resistor when connecting a blue LED (3V, 20mA) to a 12V battery. Write down the answer and formulas."
          },
          prompt: "Calculate R = (V_source - V_led) / I_led where V_source = 12V, V_led = 3V, I_led = 20mA.",
          defaultCode: `// Ohm's Law Solver
void calculateResistor() {
  float v_source = 12.0;
  float v_led = 3.0;
  float i_led = 0.02; // 20mA in Amperes
  
  // Enter the correct formula for resistance
  float resistance = (v_source - v_led) / i_led;
  
  print("Required Resistor: " + resistance + " Ohms");
}`
        }
      }
    ]
  },
  {
    id: 3,
    title: {
      uz: "3-daraja: Arduino Dasturlash",
      ru: "Уровень 3: Программирование Arduino",
      en: "Level 3: Arduino Programming"
    },
    subtitle: {
      uz: "Mikrokontrollerlarni boshqarish va datchiklar",
      ru: "Управление микроконтроллерами и датчики",
      en: "Microcontrollers, inputs, and outputs"
    },
    description: {
      uz: "Arduino IDE o'rnatish. Raqamli kirish/chiqishlar (GPIO), analog datchiklar, servo motorlar va LCD displeylar bilan ishlash dasturlari.",
      ru: "Настройка Arduino IDE. Работа с цифровыми вводами/выводами (GPIO), аналоговыми датчиками, сервоприводами и ЖК-дисплеями.",
      en: "Setting up Arduino IDE. Working with digital GPIO, analog sensors, servo motors, and LCD displays."
    },
    lessons: [
      {
        id: "l3_1",
        levelId: 3,
        title: {
          uz: "Servo Motorni Arduino orqali boshqarish",
          ru: "Управление сервоприводом с Arduino",
          en: "Controlling Servo Motors with Arduino"
        },
        description: {
          uz: "Dastur orqali Servo motorni belgilangan burchakka (0 dan 180 darajagacha) burish va boshqarish darsi.",
          ru: "Урок по вращению и позиционированию сервопривода от 0 до 180 градусов с помощью кода.",
          en: "Learn how to rotate and position a servo motor from 0 to 180 degrees using digital PWM signals."
        },
        videoUrl: "https://www.youtube.com/embed/YI7S6h_O50I",
        isPremium: false,
        simulationType: "servo",
        content: {
          uz: "### Servo motorlar qanday ishlaydi?\nServo motorlar — bu burchak ostida aniq joylashishni boshqarish imkonini beruvchi dvigatellar. Ular PWM (Kenglik-Impuls Modulyatsiyasi) signallari orqali boshqariladi.\n\n### Kod tuzilishi:\nArduino loyihalarida kutubxonalardan foydalanish ishni osonlashtiradi.\n`#include <Servo.h>` yordamida servoni boshqarish obyektini yaratamiz.\n\n```cpp\n#include <Servo.h>\nServo myServo;\n\nvoid setup() {\n  myServo.attach(9); // Servo PIN 9 ga ulangan\n}\n\nvoid loop() {\n  myServo.write(90); // 90 darajaga burish\n  delay(1000);\n  myServo.write(180); // 180 darajaga burish\n  delay(1000);\n}\n```",
          ru: "### Как работают сервоприводы?\nСервопривод — это двигатель с обратной связью, позволяющий точно поворачивать вал на заданный угол (обычно 0-180 градусов) с помощью ШИМ (Широтно-Импульсной Модуляции).\n\n### Структура кода:\nИспользование библиотеки `#include <Servo.h>` сильно упрощает программирование.\n\n```cpp\n#include <Servo.h>\nServo myServo;\n\nvoid setup() {\n  myServo.attach(9); // Подключаем серво к 9-му пину\n}\n\nvoid loop() {\n  myServo.write(90); // Повернуть на 90 градусов\n  delay(1000);\n  myServo.write(180); // Повернуть на 180 градусов\n  delay(1000);\n}\n```",
          en: "### How do Servo Motors work?\nServos are closed-loop geared motors that allow high-precision rotational positioning (0-180 degrees) using PWM (Pulse Width Modulation) commands.\n\n### Arduino Code Pattern:\nUsing the built-in `#include <Servo.h>` library makes it extremely straightforward.\n\n```cpp\n#include <Servo.h>\nServo myServo;\n\nvoid setup() {\n  myServo.attach(9); // Attach servo signal to PWM pin 9\n}\n\nvoid loop() {\n  myServo.write(90); // Rotate servo shaft to exactly 90 degrees\n  delay(1000);\n  myServo.write(180); // Rotate to 180 degrees\n  delay(1000);\n}\n```"
        },
        quiz: {
          id: "q3_1",
          title: { uz: "Arduino va Servo Kviz", ru: "Тест: Arduino и сервопривод", en: "Arduino & Servo Quiz" },
          questions: [
            {
              id: "q3_1_1",
              text: {
                uz: "Servo motorni dasturlash uchun qaysi kutubxona ishlatiladi?",
                ru: "Какая библиотека используется для работы с сервоприводом в Arduino?",
                en: "Which library is used to program standard servos in Arduino?"
              },
              options: [
                { uz: "LiquidCrystal.h", ru: "LiquidCrystal.h", en: "LiquidCrystal.h" },
                { uz: "Wire.h", ru: "Wire.h", en: "Wire.h" },
                { uz: "Servo.h", ru: "Servo.h", en: "Servo.h" },
                { uz: "WiFi.h", ru: "WiFi.h", en: "WiFi.h" }
              ],
              correctOptionIndex: 2,
              explanation: {
                uz: "#include <Servo.h> kutubxonasi burchak buyruqlarini avtomatik PWM pulslariga aylantiradi.",
                ru: "#include <Servo.h> автоматически транслирует градусы в ШИМ-импульсы.",
                en: "#include <Servo.h> automatically maps angles to appropriate pulse-width signals."
              }
            }
          ]
        },
        homework: {
          id: "hw3_1",
          title: {
            uz: "Servo supurish dasturi (Sweep)",
            ru: "Программа плавного вращения серво (Sweep)",
            en: "Servo Sweep Code Task"
          },
          description: {
            uz: "Servoni 0 dan 180 darajaga qadar va keyin ortga 1 darajadan asta-sekin buradigan tsikl (for loop) dasturini tuzing.",
            ru: "Создайте цикл, который плавно поворачивает сервопривод от 0 до 180 градусов, а затем обратно с шагом в 1 градус.",
            en: "Write an Arduino script using a for-loop that sweeps the servo from 0 to 180 degrees, and then back smoothly."
          },
          prompt: "Write a complete Arduino loop() to sweep myServo from 0 to 180 degrees using a for loop with 15ms delays.",
          defaultCode: `#include <Servo.h>
Servo myServo;

void setup() {
  myServo.attach(9);
}

void loop() {
  // Write a loop to go from 0 to 180 degrees
  for (int pos = 0; pos <= 180; pos += 1) {
    myServo.write(pos);
    delay(15);
  }
  
  // Write a loop to return from 180 to 0 degrees
  for (int pos = 180; pos >= 0; pos -= 1) {
    myServo.write(pos);
    delay(15);
  }
}`
        }
      }
    ]
  },
  {
    id: 4,
    title: {
      uz: "4-daraja: ESP32 IoT Tizimlari",
      ru: "Уровень 4: ESP32 и Интернет вещей (IoT)",
      en: "Level 4: ESP32 Development & IoT"
    },
    subtitle: {
      uz: "Simsiz aloqa va Web Serverlar yaratish",
      ru: "Беспроводная связь и веб-серверы",
      en: "Wireless connection & IoT servers"
    },
    description: {
      uz: "ESP32 mikrokontrolleri xususiyatlari. WiFi tarmoqqa ulanish, datchiklar ma'lumotlarini real vaqtda bulutga yuborish va Web server qurish.",
      ru: "Характеристики микроконтроллера ESP32. Подключение к сети WiFi, отправка данных датчиков в облако и создание веб-сервера.",
      en: "ESP32 board pinouts. Linking to local WiFi, deploying local web servers, and sending real-time sensor streams to cloud brokers."
    },
    lessons: [
      {
        id: "l4_1",
        levelId: 4,
        title: {
          uz: "ESP32 da HTML Web Server Yaratish",
          ru: "Создание HTML Веб-Сервера на ESP32",
          en: "Building a Web Server on ESP32"
        },
        description: {
          uz: "ESP32 yordamida WiFi nuqtasi hosil qilish va brauzer orqali svetodiodlarni masofadan yoqib-o'chirish loyihasi.",
          ru: "Создание локальной точки доступа WiFi и управление светодиодами через браузер смартфона.",
          en: "Deploying a lightweight HTTP server on ESP32 to switch physical pins via mobile browser requests."
        },
        videoUrl: "https://www.youtube.com/embed/S_8b0D8O-c8",
        isPremium: true,
        simulationType: "iot-web",
        content: {
          uz: "### ESP32 va IoT:\nESP32 — integratsiyalashgan WiFi va Bluetooth drayverlariga ega bo'lgan 32-bitli kuchli mikrokontrollerdir.\n\n### WiFi ulanish kodi:\n`WiFi.h` kutubxonasi yordamida ESP32 ni uydagi WiFiga ulash mumkin:\n\n```cpp\n#include <WiFi.h>\nconst char* ssid = \"MeningWiFi\";\nconst char* password = \"parol1234\";\n\nvoid setup() {\n  Serial.begin(115200);\n  WiFi.begin(ssid, password);\n  while (WiFi.status() != WL_CONNECTED) {\n    delay(500);\n    Serial.print(\".\");\n  }\n  Serial.println(\"WiFi ulandi!\");\n  Serial.println(WiFi.localIP()); // IP manzilni olish\n}\n```",
          ru: "### ESP32 и IoT (Интернет вещей):\nESP32 — мощный 32-битный микроконтроллер со встроенными модулями WiFi и Bluetooth, идеальный для умного дома.\n\n### Подключение к WiFi:\nИспользуя библиотеку `WiFi.h`, подключаем плату к локальной сети:\n\n```cpp\n#include <WiFi.h>\nconst char* ssid = \"MyWiFi\";\nconst char* password = \"pass1234\";\n\nvoid setup() {\n  Serial.begin(115200);\n  WiFi.begin(ssid, password);\n  while (WiFi.status() != WL_CONNECTED) {\n    delay(500);\n    Serial.print(\".\");\n  }\n  Serial.println(\"Подключено к WiFi!\");\n  Serial.println(WiFi.localIP()); // Выводим IP адрес\n}\n```",
          en: "### ESP32 and IoT:\nESP32 is a powerful dual-core 32-bit microcontroller featuring fully integrated WiFi, Bluetooth, and advanced sleep-modes.\n\n### Connecting to WiFi Network:\nUsing the standard `WiFi.h` library, establish a station connection:\n\n```cpp\n#include <WiFi.h>\nconst char* ssid = \"YourNetworkSSID\";\nconst char* password = \"SecretPassword\";\n\nvoid setup() {\n  Serial.begin(115200);\n  WiFi.begin(ssid, password);\n  while (WiFi.status() != WL_CONNECTED) {\n    delay(500);\n    Serial.print(\".\");\n  }\n  Serial.println(\"WiFi Connected!\");\n  Serial.println(WiFi.localIP()); // Print local server IP Address\n}\n```"
        },
        quiz: {
          id: "q4_1",
          title: { uz: "ESP32 IoT Kviz", ru: "Тест по ESP32", en: "ESP32 IoT Quiz" },
          questions: [
            {
              id: "q4_1_1",
              text: {
                uz: "ESP32 mikrokontrollerida qaysi simsiz aloqa protokollari o'rnatilgan?",
                ru: "Какие беспроводные протоколы встроены в ESP32?",
                en: "Which wireless communication systems are natively built-into ESP32?"
              },
              options: [
                { uz: "Faqat Bluetooth", ru: "Только Bluetooth", en: "Only Bluetooth" },
                { uz: "Faqat WiFi", ru: "Только WiFi", en: "Only WiFi" },
                { uz: "WiFi va Bluetooth", ru: "WiFi и Bluetooth", en: "WiFi and Bluetooth" },
                { uz: "ZigBee va LoRa", ru: "ZigBee и LoRa", en: "ZigBee and LoRa" }
              ],
              correctOptionIndex: 2,
              explanation: {
                uz: "ESP32 ham Wi-Fi, ham Bluetooth (Classic va BLE) chiplariga ega.",
                ru: "ESP32 имеет встроенную поддержку как Wi-Fi, так и Bluetooth (Classic & BLE).",
                en: "ESP32 is fully equipped with both dual-mode Wi-Fi and Bluetooth standard/BLE engines."
              }
            }
          ]
        },
        homework: {
          id: "hw4_1",
          title: {
            uz: "IoT Relay kaliti algoritmi",
            ru: "Алгоритм реле для умного дома",
            en: "Smart Home Relay Switch Script"
          },
          description: {
            uz: "Brauzerdan '/on' yoki '/off' so'rovlari kelganda LED pinini yoqadigan yoki o'chiradigan HTTP server kodini yozing.",
            ru: "Напишите обработчик запросов для веб-сервера, который включает реле при переходе на '/on' и выключает на '/off'.",
            en: "Write an ESP32 web server request handler that toggles a relay state on '/on' and '/off' HTTP routes."
          },
          prompt: "Write ESP32 code to handle client requests for '/on' and '/off' targets using WiFiServer client handler.",
          defaultCode: `#include <WiFi.h>
WiFiServer server(80);
const int relayPin = 5;

void setup() {
  pinMode(relayPin, OUTPUT);
  // WiFi connection initialized here...
  server.begin();
}

void loop() {
  WiFiClient client = server.available();
  if (client) {
    String req = client.readStringUntil('\\r');
    if (req.indexOf("/on") != -1) {
      digitalWrite(relayPin, HIGH);
    } else if (req.indexOf("/off") != -1) {
      digitalWrite(relayPin, LOW);
    }
    client.flush();
  }
}`
        }
      }
    ]
  },
  {
    id: 5,
    title: {
      uz: "5-daraja: Robot Dasturlash (C++/Python)",
      ru: "Уровень 5: Программирование Роботов (C++/Python)",
      en: "Level 5: Robot Coding (C++/Python)"
    },
    subtitle: {
      uz: "Algoritmlar va Obyektga Yo'naltirilgan Dasturlash",
      ru: "Алгоритмы и Объектно-Ориентированное Программирование",
      en: "Algorithms & Object-Oriented Programming"
    },
    description: {
      uz: "Robot boshqarishda C++ va Python tillari farqi. Sinflar va obyektlar yaratish, robot harakat kinematikasini dasturlash asoslari.",
      ru: "Разница между C++ и Python в робототехнике. Создание классов и объектов, основы программирования кинематики движения.",
      en: "Comparing C++ and Python in robotics stack. Implementing custom classes, physical coordinate models, and OOP practices."
    },
    lessons: [
      {
        id: "l5_1",
        levelId: 5,
        title: {
          uz: "Robot Class yaratish (OOP)",
          ru: "Создание класса Робота (ООП)",
          en: "Creating a Robot Class (OOP)"
        },
        description: {
          uz: "Python tilida Robot klassini yozish va unga o'ngga, chapga yurish funksiyalarini (metod) bog'lash darsi.",
          ru: "Написание класса Робота на Python с методами движения вперед, назад и поворотов.",
          en: "Coding a clean Python Class describing a differential-drive robot with moving methods."
        },
        videoUrl: "https://www.youtube.com/embed/vK7EInEaHkQ",
        isPremium: true,
        simulationType: "code-only",
        content: {
          uz: "### Obyektga Yo'naltirilgan Dasturlash (OOP):\nRobototexnikada murakkab tizimlar ko'p bo'lganligi sababli, har bir robotni alohida ob'yekt sifatida yaratish foydalidir.\n\n### Python misol:\n\n```python\nclass Robot:\n    def __init__(self, name, model):\n        self.name = name\n        self.model = model\n        self.speed = 0\n        \n    def move_forward(self, speed_val):\n        self.speed = speed_val\n        print(f\"{self.name} {self.speed} tezlikda oldinga bormoqda!\")\n        \n    def stop(self):\n        self.speed = 0\n        print(f\"{self.name} to'xtadi.\")\n\n# Obyekt yaratish\nmy_robot = Robot(\"Al-Xorazmiy\", \"Rover-V1\")\nmy_robot.move_forward(50)\n```",
          ru: "### Объектно-Ориентированное Программирование (ООП):\nВ робототехнике робот описывается как объект с характеристиками (свойства) и действиями (методы).\n\n### Пример на Python:\n\n```python\nclass Robot:\n    def __init__(self, name, model):\n        self.name = name\n        self.model = model\n        self.speed = 0\n        \n    def move_forward(self, speed_val):\n        self.speed = speed_val\n        print(f\"Робот {self.name} движется вперед со скоростью {self.speed}!\")\n        \n    def stop(self):\n        self.speed = 0\n        print(f\"Робот {self.name} остановился.\")\n\n# Создание объекта\nmy_robot = Robot(\"Авиценна\", \"Rover-V1\")\nmy_robot.move_forward(50)\n```",
          en: "### Object-Oriented Programming (OOP):\nIn robotics, structuring programs into classes allows simple scaling when dealing with manifold sensory and driving sub-assemblies.\n\n### Python Implementation:\n\n```python\nclass Robot:\n    def __init__(self, name, model):\n        self.name = name\n        self.model = model\n        self.speed = 0\n        \n    def move_forward(self, speed_val):\n        self.speed = speed_val\n        print(f\"{self.name} moving forward at speed {self.speed}!\")\n        \n    def stop(self):\n        self.speed = 0\n        print(f\"{self.name} has stopped.\")\n\n# Instantiate object\nmy_robot = Robot(\"AlphaRover\", \"Rover-V1\")\nmy_robot.move_forward(50)\n```"
        },
        quiz: {
          id: "q5_1",
          title: { uz: "OOP va Robotlar Kviz", ru: "Тест по ООП в робототехнике", en: "OOP & Robotics Quiz" },
          questions: [
            {
              id: "q5_1_1",
              text: {
                uz: "Klas ichida yaratilgan funksiyalar nima deb ataladi?",
                ru: "Как называются функции, созданные внутри класса?",
                en: "What do we call functions declared inside a class?"
              },
              options: [
                { uz: "O'zgaruvchilar", ru: "Переменные", en: "Variables" },
                { uz: "Metodlar (Methods)", ru: "Методы", en: "Methods" },
                { uz: "Obyektlar", ru: "Объекты", en: "Objects" },
                { uz: "Importlar", ru: "Импорты", en: "Imports" }
              ],
              correctOptionIndex: 1,
              explanation: {
                uz: "Sinf (class) ichidagi funksiyalar ob'yektning xulq-atvorini ifodalovchi metodlar deyiladi.",
                ru: "Функции внутри класса называются методами и задают поведение объекта.",
                en: "Functions belonging to a class are called methods, specifying actions the object can execute."
              }
            }
          ]
        },
        homework: {
          id: "hw5_1",
          title: {
            uz: "Robotga 'Battery' xususiyatini qo'shish",
            ru: "Добавление заряда батареи в класс Робота",
            en: "Adding Battery charge variable to Robot Class"
          },
          description: {
            uz: "Python tilidagi Robot klasiga 'battery_level' atributini qo'shing va u yurgan sari zaryad darajasi kamaysin.",
            ru: "Добавьте в класс Робота атрибут 'battery_level' и списывайте по 5% энергии при каждом движении вперед.",
            en: "Extend the Python Robot Class with a 'battery_level' attribute. Decrease it by 5% every time move_forward is invoked."
          },
          prompt: "Write a python script extending the Robot class with a decrease_battery method checking current levels.",
          defaultCode: `class Robot:
    def __init__(self, name):
        self.name = name
        self.battery_level = 100
        
    def move_forward(self):
        if self.battery_level >= 5:
            self.battery_level -= 5
            print(f"{self.name} moved forward. Battery at {self.battery_level}%")
        else:
            print("Low battery! Cannot move.")`
        }
      }
    ]
  },
  {
    id: 6,
    title: {
      uz: "6-daraja: Sensorlar va Avtomatika",
      ru: "Уровень 6: Датчики и Автоматизация",
      en: "Level 6: Sensors & Automation"
    },
    subtitle: {
      uz: "Ultratovush, IQ va harakat datchiklari",
      ru: "Ультразвуковые, ИК и датчики движения",
      en: "Ultrasonic, Infrared, and Motion sensors"
    },
    description: {
      uz: "Ultratovush yordamida masofani o'lchash loyihalari. IQ (Infraqizil) datchiklari bilan chiziqlarni aniqlash, harakat datchiklari orqali uylarni avtomatlashtirish.",
      ru: "Измерение расстояния с помощью ультразвука. ИК-датчики для определения линий, датчики движения для домашней автоматизации.",
      en: "Ultrasonic HC-SR04 sonar wiring. Coding Infrared line detectors and PIR motion systems for automatic security triggers."
    },
    lessons: [
      {
        id: "l6_1",
        levelId: 6,
        title: {
          uz: "HC-SR04 Ultratovush Datchigi",
          ru: "Ультразвуковой датчик HC-SR04",
          en: "HC-SR04 Ultrasonic Sensor"
        },
        description: {
          uz: "Ultratovush to'lqinlari yuborish va qaytib kelish vaqtiga qarab masofani aniq santimetrlarda hisoblash.",
          ru: "Расчет точного расстояния в сантиметрах на основе времени отправки и возврата звуковой волны.",
          en: "Calculating exact target distance in centimeters using sonar echo response travel durations."
        },
        videoUrl: "https://www.youtube.com/embed/ZejQOXhy9pI",
        isPremium: false,
        simulationType: "ultrasonic",
        content: {
          uz: "### Ultratovush datchigi qanday ishlaydi?\nHC-SR04 datchigi tovush impulsini yuboradi (Trigger) va to'siqqa urilib qaytib kelgan to'lqinni qabul qiladi (Echo).\nTovush tezligi: 340 m/s (0.034 sm/mikrosekund).\n\n### Masofa formulasi:\n*Masofa = (Vaqt * 0.034) / 2* (tovush borib va qaytib kelgani uchun 2 ga bo'lamiz).\n\n```cpp\nconst int trigPin = 9;\nconst int echoPin = 10;\n\nvoid setup() {\n  pinMode(trigPin, OUTPUT);\n  pinMode(echoPin, INPUT);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  digitalWrite(trigPin, LOW);\n  delayMicroseconds(2);\n  digitalWrite(trigPin, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(trigPin, LOW);\n  \n  long duration = pulseIn(echoPin, HIGH);\n  float distance = duration * 0.034 / 2;\n  Serial.print(\"Masofa: \");\n  Serial.println(distance);\n  delay(200);\n}\n```",
          ru: "### Как работает ультразвуковой датчик?\nДатчик HC-SR04 излучает звуковой импульс (Trigger) и ждет отраженного эха (Echo).\nСкорость звука: 340 м/с (0.034 см/микросекунду).\n\n### Формула расчета:\n*Дистанция = (Время * 0.034) / 2* (делим на 2, так как звук идет туда и обратно).\n\n```cpp\nconst int trigPin = 9;\nconst int echoPin = 10;\n\nvoid setup() {\n  pinMode(trigPin, OUTPUT);\n  pinMode(echoPin, INPUT);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  digitalWrite(trigPin, LOW);\n  delayMicroseconds(2);\n  digitalWrite(trigPin, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(trigPin, LOW);\n  \n  long duration = pulseIn(echoPin, HIGH);\n  float distance = duration * 0.034 / 2;\n  Serial.print(\"Расстояние: \");\n  Serial.println(distance);\n  delay(200);\n}\n```",
          en: "### Sonar Mechanics:\nHC-SR04 sonar launches a high-frequency sound wave (Trigger) and times how long it takes for the bounce-back wave (Echo) to hit the receiver.\nSpeed of Sound: 340 m/s (approx. 0.034 cm/microsecond).\n\n### Formula:\n*Distance = (Time * 0.034) / 2* (divided by 2 since the sound travels to the object and back).\n\n```cpp\nconst int trigPin = 9;\nconst int echoPin = 10;\n\nvoid setup() {\n  pinMode(trigPin, OUTPUT);\n  pinMode(echoPin, INPUT);\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  digitalWrite(trigPin, LOW);\n  delayMicroseconds(2);\n  digitalWrite(trigPin, HIGH);\n  delayMicroseconds(10);\n  digitalWrite(trigPin, LOW);\n  \n  long duration = pulseIn(echoPin, HIGH);\n  float distance = duration * 0.034 / 2;\n  Serial.print(\"Distance: \");\n  Serial.println(distance);\n  delay(200);\n}\n```"
        },
        quiz: {
          id: "q6_1",
          title: { uz: "Ultratovush Kviz", ru: "Тест: Ультразвуковой датчик", en: "Ultrasonic Quiz" },
          questions: [
            {
              id: "q6_1_1",
              text: {
                uz: "HC-SR04 formulasida vaqt ko'rsatkichi nima uchun 2 ga bo'linadi?",
                ru: "Почему время в формуле HC-SR04 делится на 2?",
                en: "Why is echo time divided by 2 in the HC-SR04 distance formula?"
              },
              options: [
                { uz: "Xatolikni kamaytirish uchun", ru: "Чтобы снизить погрешность", en: "To decrease reading errors" },
                { uz: "Datchik ikkita bo'lakdan iboratligi uchun", ru: "Так как датчик состоит из двух частей", en: "Because the board has two transceivers" },
                { uz: "Tovush borish va qaytish yo'lini bosib o'tgani uchun", ru: "Так как звук проходит путь туда и обратно", en: "Because sound travels to the obstacle and back" },
                { uz: "Haroratni hisobga olish uchun", ru: "Чтобы учесть температуру", en: "To factor in temperature shifts" }
              ],
              correctOptionIndex: 2,
              explanation: {
                uz: "Impuls ob'yektgacha boradi va yana qaytib keladi. Bizga esa faqat bir tomonlama masofa kerak.",
                ru: "Импульс идет до преграды и возвращается обратно. Нам нужно только расстояние в одну сторону.",
                en: "The sound wave travels to the target and rebounds. We only require the one-way distance."
              }
            }
          ]
        },
        homework: {
          id: "hw6_1",
          title: {
            uz: "Masofaga qarab signal berish (Buzzer)",
            ru: "Зуммер предупреждения расстояния",
            en: "Proximity Alarm Buzzer Script"
          },
          description: {
            uz: "Agar o'lchangan masofa 10 sm dan kam bo'lsa, 8-pinga ulangan buzzer yorqin ovoz (HIGH) chiqarsin, aks holda o'chsin (LOW).",
            ru: "Напишите программу, которая включает пищалку на 8 пине (HIGH), если расстояние до объекта меньше 10 см.",
            en: "Program an Arduino to turn on a buzzer connected to pin 8 when ultrasonic distance falls below 10cm."
          },
          prompt: "Write a buzzer alarm condition inside an Arduino loop checking if distance < 10.",
          defaultCode: `const int buzzerPin = 8;
float distance = 12.5; // Simulated distance

void setup() {
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  // Read distance here...
  if (distance < 10) {
    // Turn buzzer on
    digitalWrite(buzzerPin, HIGH);
  } else {
    // Turn buzzer off
    digitalWrite(buzzerPin, LOW);
  }
}`
        }
      }
    ]
  },
  {
    id: 7,
    title: {
      uz: "7-daraja: Robot Konstruksiyalari",
      ru: "Уровень 7: Конструирование Роботов",
      en: "Level 7: Robot Construction"
    },
    subtitle: {
      uz: "Chiziq bo'ylab yuruvchi va Bluetooth robotlar",
      ru: "Роботы, следующие по линии, и Bluetooth-роботы",
      en: "Line follower and remote Bluetooth crawlers"
    },
    description: {
      uz: "Chassis (shassi) yig'ish, drayverlar (L298N) bilan motorlarni boshqarish. Chiziq bo'ylab yuradigan va aqlli uylarni boshqaradigan haqiqiy robotlar yasash.",
      ru: "Сборка шасси, управление моторами через драйвер L298N. Сборка роботов, следующих по линии и управляемых по Bluetooth.",
      en: "Assembling chassis kits, wiring L298N dual H-bridge motor drivers. Building active line followers and Bluetooth-controlled rovers."
    },
    lessons: [
      {
        id: "l7_1",
        levelId: 7,
        title: {
          uz: "Chiziq Bo'ylab Yuruvchi Robot Algoritmi",
          ru: "Алгоритм Робота, следующего по линии",
          en: "Line Follower Robot Algorithm"
        },
        description: {
          uz: "Ikki dona infraqizil datchik orqali qora chiziqni yo'qotmasdan harakatlanadigan robot dasturini yozish.",
          ru: "Использование двух ИК-датчиков для удержания траектории движения по черной линии на белом поле.",
          en: "Coding a two-sensor infrared system designed to steer left and right motors to stay tracked on a black tape line."
        },
        videoUrl: "https://www.youtube.com/embed/5DkaV_IqZ3U",
        isPremium: true,
        simulationType: "line-follower",
        content: {
          uz: "### Chiziq datchiklari:\nInfraqizil datchiklar yorug'lik qaytishini o'lchaydi. Oq sirt IQ nurni qaytaradi (datchik 0 beradi), qora chiziq esa nurni yutadi (datchik 1 beradi).\n\n### Oddiy mantiq (2 ta datchik uchun):\n* **Chap: OQ, O'ng: OQ** -> To'g'riga yurish\n* **Chap: QORA, O'ng: OQ** -> Chapga burilish\n* **Chap: OQ, O'ng: QORA** -> O'ngga burilish\n* **Chap: QORA, O'ng: QORA** -> To'xtash",
          ru: "### Датчики линии:\nИнфракрасные датчики измеряют отражение света. Белая поверхность отражает ИК-лучи (датчик выдает 0), черная поглощает свет (датчик выдает 1).\n\n### Алгоритм управления (2 датчика):\n* **Левый: БЕЛЫЙ, Правый: БЕЛЫЙ** -> Двигаться вперед\n* **Левый: ЧЕРНЫЙ, Правый: БЕЛЫЙ** -> Повернуть налево\n* **Левый: БЕЛЫЙ, Правый: ЧЕРНЫЙ** -> Повернуть направо\n* **Левый: ЧЕРНЫЙ, Правый: ЧЕРНЫЙ** -> Остановиться",
          en: "### Line Sensors Theory:\nInfrared reflectivity detectors are positioned underneath the nose of the chassis. White reflects IR light (returning digital LOW/0), while the black track line absorbs it (returning digital HIGH/1).\n\n### Differential Steering Logic:\n* **Left: WHITE, Right: WHITE** -> Keep moving forward\n* **Left: BLACK, Right: WHITE** -> Steer left (spin left wheel backward, right wheel forward)\n* **Left: WHITE, Right: BLACK** -> Steer right (spin right wheel backward, left wheel forward)\n* **Left: BLACK, Right: BLACK** -> Stop motors or execute intersection logic"
        },
        quiz: {
          id: "q7_1",
          title: { uz: "Chiziq robot Kviz", ru: "Тест: Робот по линии", en: "Line Follower Quiz" },
          questions: [
            {
              id: "q7_1_1",
              text: {
                uz: "IQ datchik nima sababdan qora chiziq ustida signal o'zgarishini ko'rsatadi?",
                ru: "Почему ИК-датчик срабатывает на черную линию?",
                en: "Why does the IR sensor trigger differently on a black line than a white background?"
              },
              options: [
                { uz: "Qora rang infraqizil nurlarni yutadi", ru: "Черный цвет поглощает ИК-излучение", en: "Black pigment absorbs infrared radiation" },
                { uz: "Qora rang nurni kuchli qaytaradi", ru: "Черный цвет сильно отражает свет", en: "Black pigment intensely reflects light" },
                { uz: "Qora rang sovuq bo'ladi", ru: "Черный цвет холоднее", en: "Black is colder than white" },
                { uz: "Datchik faqat metallarni aniqlaydi", ru: "Датчик реагирует только на металлы", en: "The sensor only senses metals" }
              ],
              correctOptionIndex: 0,
              explanation: {
                uz: "Qora sirt yorug'lik to'lqinlarini deyarli to'liq yutadi, shu sababli datchik qaytgan nurni sezmaydi.",
                ru: "Черный поглощает свет, поэтому датчик фиксирует падение уровня отраженного излучения.",
                en: "Dark colors absorb light spectrum, preventing the emitter's infrared beam from bouncing back to the receiver."
              }
            }
          ]
        },
        homework: {
          id: "hw7_1",
          title: {
            uz: "Dvigatel drayverini boshqarish",
            ru: "Код драйвера двигателей",
            en: "Differential Driving Motor Code"
          },
          description: {
            uz: "Arduino va L298N yordamida robot o'ngga burilishi uchun motor pinlarini (IN1, IN2, IN3, IN4) qanday o'rnatish lozimligini yozing.",
            ru: "Напишите, какие логические уровни нужно подать на пины драйвера (IN1, IN2, IN3, IN4), чтобы робот развернулся на месте вправо.",
            en: "Configure the H-Bridge driver inputs (IN1 to IN4) to drive the left wheel forward and right wheel backward for a tight right turn."
          },
          prompt: "Write Arduino digitalWrite commands for IN1, IN2, IN3, IN4 to steer right.",
          defaultCode: `// L298N Driver Pins
const int IN1 = 4; // Left wheel forward
const int IN2 = 5; // Left wheel backward
const int IN3 = 6; // Right wheel forward
const int IN4 = 7; // Right wheel backward

void steerRight() {
  // Write pin outputs to spin left wheel forward and right wheel backward
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, HIGH);
}`
        }
      }
    ]
  },
  {
    id: 8,
    title: {
      uz: "8-daraja: Ilg'or Robototexnika (AI & CV)",
      ru: "Уровень 8: Передовая Робототехника (AI & CV)",
      en: "Level 8: Advanced Robotics (AI & CV)"
    },
    subtitle: {
      uz: "Kompyuter ko'rishi, AI va Neyron tarmoqlar",
      ru: "Компьютерное зрение, ИИ и нейросети",
      en: "Computer Vision, Artificial Intelligence, and ML"
    },
    description: {
      uz: "Kameradan olingan rasmni tahlil qilish. OpenCV kutubxonasi yordamida ranglar va yuzlarni aniqlash, robotlarni sun'iy intellekt orqali boshqarish.",
      ru: "Анализ изображений с камеры. Библиотека OpenCV для распознавания цветов и лиц, управление роботами с помощью ИИ.",
      en: "Processing real-time video frames. Leveraging OpenCV to segment colors, detect obstacles, and run tiny neural networks."
    },
    lessons: [
      {
        id: "l8_1",
        levelId: 8,
        title: {
          uz: "OpenCV da Ranglarni aniqlash loyihasi",
          ru: "Распознавание цветов в OpenCV",
          en: "Color Segmentation with OpenCV"
        },
        description: {
          uz: "Python va OpenCV orqali qizil yoki yashil to'pni kamera kadrida aniqlash va koordinatalarini hisoblash.",
          ru: "Поиск красного или зеленого мяча в кадре камеры на Python с получением его точных координат.",
          en: "Isolating a colored ball in a camera feed using Python and custom HSV threshold masking."
        },
        videoUrl: "https://www.youtube.com/embed/ONYJ_6S9Ld4",
        isPremium: true,
        simulationType: "cv-grid",
        content: {
          uz: "### Sun'iy Intellekt va Kompyuter Ko'rishi:\nKompyuter ko'rishi (CV) robotga tasvirlarni ko'rish va ularni tushunish imkonini beradi. OpenCV (Open Source Computer Vision) eng keng tarqalgan kutubxonadir.\n\n### Python misol (Rasm o'qish va rang aniqlash):\n\n```python\nimport cv2\nimport numpy as np\n\n# Kamerani ishga tushirish\ncap = cv2.VideoCapture(0)\n\nwhile True:\n    ret, frame = cap.read()\n    # Rasmni HSV formatiga o'tkazish (ranglarni aniqlash osonroq)\n    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)\n    \n    # Qizil rang chegaralarini belgilash\n    lower_red = np.array([0, 120, 70])\n    upper_red = np.array([10, 255, 255])\n    \n    mask = cv2.inRange(hsv, lower_red, upper_red)\n    cv2.imshow('Masked Object', mask)\n    \n    if cv2.waitKey(1) & 0xFF == ord('q'):\n        break\n```",
          ru: "### ИИ и Компьютерное зрение (CV):\nКомпьютерное зрение дает роботам возможность 'видеть' и классифицировать объекты. Самой популярной библиотекой является OpenCV.\n\n### Пример на Python (Поиск по цвету):\n\n```python\nimport cv2\nimport numpy as np\n\n# Запуск камеры\ncap = cv2.VideoCapture(0)\n\nwhile True:\n    ret, frame = cap.read()\n    # Перевод в цветовое пространство HSV (так легче вырезать цвета)\n    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)\n    \n    # Диапазон красного цвета\n    lower_red = np.array([0, 120, 70])\n    upper_red = np.array([10, 255, 255])\n    \n    mask = cv2.inRange(hsv, lower_red, upper_red)\n    cv2.imshow('Masked Object', mask)\n    \n    if cv2.waitKey(1) & 0xFF == ord('q'):\n        break\n```",
          en: "### AI & CV Intro:\nComputer Vision allows autonomous robots to extract geometric and semantic knowledge from visual pixels. OpenCV is the industry-standard toolkit for this.\n\n### Python Sample (HSV Color Thresholding):\n\n```python\nimport cv2\nimport numpy as np\n\ncap = cv2.VideoCapture(0) # Open active camera\n\nwhile True:\n    ret, frame = cap.read()\n    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV) # Map BGR to HSV spectrum\n    \n    # Define Red boundary margins in HSV\n    lower_red = np.array([0, 120, 70])\n    upper_red = np.array([10, 255, 255])\n    \n    mask = cv2.inRange(hsv, lower_red, upper_red) # Filter out pixels outside red margin\n    cv2.imshow('Masked Object', mask)\n    \n    if cv2.waitKey(1) & 0xFF == ord('q'):\n        break\n```"
        },
        quiz: {
          id: "q8_1",
          title: { uz: "OpenCV Kviz", ru: "Тест по OpenCV", en: "OpenCV Quiz" },
          questions: [
            {
              id: "q8_1_1",
              text: {
                uz: "Ranglarni aniqlashda nima uchun BGR o'rniga HSV rang formati afzal ko'riladi?",
                ru: "Почему при поиске цвета HSV предпочтительнее формата BGR?",
                en: "Why is the HSV color space preferred over standard BGR for object color segmentation?"
              },
              options: [
                { uz: "HSV rasmni tezroq yuklaydi", ru: "HSV загружает быстрее", en: "HSV loads pixels much faster" },
                { uz: "HSV ranglarni yorug'lik o'zgarishidan mustaqil aniqlay oladi", ru: "HSV отделяет информацию о цвете от яркости и теней", en: "HSV isolates color information from brightness and shadows" },
                { uz: "BGR faqat qora-oq rasmlar uchun mos", ru: "BGR только для черно-белых снимков", en: "BGR can only represent greyscale frames" },
                { uz: "Hech qanday farqi yo'q", ru: "Разницы нет", en: "There is no functional advantage" }
              ],
              correctOptionIndex: 1,
              explanation: {
                uz: "HSV modelida rang ohangi (Hue) alohida ajratilgan bo'lib, soyalar va xonadagi yorug'lik o'zgarishi rangni aniqlashga to'sqinlik qilmaydi.",
                ru: "В HSV цветовой тон (Hue) отделен от насыщенности и яркости, что нивелирует влияние теней.",
                en: "HSV decouples chromaticity (Hue) from value/brightness, preventing shadows from breaking object recognition."
              }
            }
          ]
        },
        homework: {
          id: "hw8_1",
          title: {
            uz: "Ob'yektning markazini hisoblash",
            ru: "Вычисление центра объекта",
            en: "Calculating Centroids with Moments"
          },
          description: {
            uz: "Maskalangan kadrning momentlarini (cv2.moments) hisoblash orqali to'pning o'rtasidagi nuqta koordinatasini (cx, cy) topuvchi Python funksiyasini yozing.",
            ru: "Напишите фрагмент кода на Python, вычисляющий координаты центра (cx, cy) маскированного контура с помощью моментов cv2.moments.",
            en: "Write a Python script that calculates the (X, Y) pixel center of a detected contour mask using cv2.moments."
          },
          prompt: "Write Python code using cv2.moments to locate center coordinates cx, cy.",
          defaultCode: `import cv2

def find_centroid(mask):
    # Calculate moments of binary image
    M = cv2.moments(mask)
    if M["m00"] != 0:
        cx = int(M["m10"] / M["m00"])
        cy = int(M["m01"] / M["m00"])
        return (cx, cy)
    return (0, 0)`
        }
      }
    ]
  },
  {
    id: 9,
    title: {
      uz: "9-daraja: Professional Sanoat Loyihalari",
      ru: "Уровень 9: Профессиональные Проекты",
      en: "Level 9: Professional Projects"
    },
    subtitle: {
      uz: "Sanoat, yetkazib berish va qishloq xo'jaligi robotlari",
      ru: "Промышленные, логистические и сельхоз-роботы",
      en: "Industrial arms, logistics, and agribots"
    },
    description: {
      uz: "Sanoatda manipulyator robotlar, do'kon va omborlar uchun yuk tashuvchi (AGV) robotlar, hamda aqlli qishloq xo'jaligi texnologiyalarini qurish va boshqarish.",
      ru: "Промышленные роботы-манипуляторы, беспилотные погрузчики (AGV) для складов, а также разработка агророботов.",
      en: "Programming robotic arms (kinematics), configuring warehouse automatic guided vehicles (AGV), and agricultural drone mapping."
    },
    lessons: [
      {
        id: "l9_1",
        levelId: 9,
        title: {
          uz: "Omborxona AGV Roboti Kinematikasi",
          ru: "Кинематика складского робота AGV",
          en: "Warehouse AGV Kinematics"
        },
        description: {
          uz: "Sanoat korxonalarida yuklarni avtomatlashtirilgan holda manzilga yetkazadigan robotlarni loyihalash.",
          ru: "Проектирование колесной базы для беспилотных складских роботов-погрузчиков (AGV).",
          en: "Understanding inverse and forward kinematics equations for omnidirectional Mecanum industrial rovers."
        },
        videoUrl: "https://www.youtube.com/embed/F6kPz6S6mEw",
        isPremium: true,
        simulationType: "code-only",
        content: {
          uz: "### Sanoat Robotlari va AGV:\nAGV (Automated Guided Vehicle) — omborxona yoki zavodlar ichida yuklarni haydovchisiz tashiydigan mobil robot. Ular odatda lidar datchiklar yoki magnit chiziqlar orqali harakat qiladi.\n\n### Mekanum g'ildiraklari kinematics:\nMekanum g'ildiraklari robotga burilmasdan har tomonga (yonlama, diagonal, to'g'ri) siljish imkonini beradi. Buni hisoblash uchun har bir motor aylanish tezligini matritsalar yordamida boshqarish lozim.",
          ru: "### Промышленные роботы и AGV:\nAGV (Automated Guided Vehicle) — это автоматические колесные транспортные средства, перевозящие грузы на фабриках. Навигация чаще строится на лазерных лидарах.\n\n### Кинематика колес Меканум:\nКолеса Меканум позволяют платформе двигаться в любом направлении боком и по диагонали без разворотов за счет независимого изменения скорости вращения каждого колеса.",
          en: "### Industrial AGVs:\nAutomated Guided Vehicles (AGVs) navigate factory floors to transport heavy cargo pallets without human operators, using LiDAR mapping and grid navigation.\n\n### Mecanum Wheel Vector Kinematics:\nMecanum wheels have rollers angled at 45 degrees, meaning spin vectors combine to let the platform slide sideways, diagonally, or turn instantly."
        },
        quiz: {
          id: "q9_1",
          title: { uz: "AGV Robot Kviz", ru: "Тест по AGV системам", en: "AGV Systems Quiz" },
          questions: [
            {
              id: "q9_1_1",
              text: {
                uz: "Qaysi turdagi g'ildiraklar robotga o'z burchagini o'zgartirmasdan yon tomonga yurish imkonini beradi?",
                ru: "Какой тип колес позволяет роботу двигаться вбок без разворота?",
                en: "Which wheel layout permits a robot platform to slide laterally without turning its chassis?"
              },
              options: [
                { uz: "Oddiy pnevmatik g'ildiraklar", ru: "Обычные пневматические колеса", en: "Pneumatic wheels" },
                { uz: "Tasma (Gusenitsa)", ru: "Гусеничный привод", en: "Caterpillar tracks" },
                { uz: "Mekanum g'ildiraklari (Mecanum Wheels)", ru: "Колеса Меканум", en: "Mecanum wheels" },
                { uz: "Plastik g'ildiraklar", ru: "Пластиковые колеса", en: "Simple plastic wheels" }
              ],
              correctOptionIndex: 2,
              explanation: {
                uz: "Mekanum g'ildiraklari maxsus roliklarga ega bo'lib, har bir motor kuchi har xil yo'naltirilganda yonlama harakat yuzaga keladi.",
                ru: "Колеса Меканум снабжены роликами под углом 45 градусов, создавая боковой вектор тяги при разнонаправленном вращении.",
                en: "Mecanum rollers are angled at 45 degrees, synthesizing diagonal traction vectors that cancel out longitudinal slip."
              }
            }
          ]
        },
        homework: {
          id: "hw9_1",
          title: {
            uz: "Omborxona robotida yo'l tanlash",
            ru: "Поиск пути на промышленном складе",
            en: "Pathfinding Grid Solver"
          },
          description: {
            uz: "Omborxona to'ridagi (grid) to'siqlarni aylanib o'tuvchi oddiy A* (A-star) yoki Dejkstra algoritmining mantiqiy modelini tushuntiring va pseudo-kodda tasvirlang.",
            ru: "Опишите логическую блок-схему или алгоритм поиска кратчайшего пути Дейкстры на складской сетке с препятствиями.",
            en: "Describe a basic Dijkstra pathfinding algorithm to route an AGV around static shelving obstacles in a 2D grid representation."
          },
          prompt: "Write a routing loop outline that expands neighbor nodes on a grid.",
          defaultCode: `// AGV Routing Algorithm
void findShortestPath(int grid[10][10], int startX, int startY, int endX, int endY) {
  // 1. Initialize open list and closed lists
  // 2. Compute distance costs to neighboring grids
  // 3. Avoid grids filled with obstacles (value = 1)
  // 4. Return optimal coordinate array
}`
        }
      }
    ]
  },
  {
    id: 10,
    title: {
      uz: "10-daraja: Expert Robototexnika Muhandisi",
      ru: "Уровень 10: Эксперт-Инженер Робототехники",
      en: "Level 10: Expert Robotics Engineer"
    },
    subtitle: {
      uz: "Diplom ishi va Professional Sertifikatlash",
      ru: "Дипломная работа и профессиональная сертификация",
      en: "Capstone Project & Professional Certification"
    },
    description: {
      uz: "Akademiya yakuniy diplom imtihoni. To'liq robot tizimini loyihalashtirish va noldan amaliy dastur tuzish. Muhandislik sertifikatiga ega bo'lish.",
      ru: "Выпускной экзамен Академии. Комплексное проектирование полнофункционального робота. Получение официального диплома инженера.",
      en: "Academy final capstone examination. Comprehensive planning, wiring simulation, and programmatic testing to secure your official engineer diploma."
    },
    lessons: [
      {
        id: "l10_1",
        levelId: 10,
        title: {
          uz: "Yakuniy Diplom Imtihoni: Aqlli Avtonom Tizim",
          ru: "Выпускной проект: Умная автономная система",
          en: "Capstone Examination: Autonomous Cyber-Physical System"
        },
        description: {
          uz: "Barcha 10 ta darajadagi bilimlarni birlashtirib, avtonom aqlli tizim (Smart Home + Mobile Robot) loyihasini dasturlash.",
          ru: "Объединение всех знаний за 10 уровней в один проект: программирование мобильного робота с веб-контролем и сенсорами.",
          en: "Synthesizing full academy core-competencies into a single multi-sensor autonomous system with real-time analytics."
        },
        videoUrl: "https://www.youtube.com/embed/fWun0X794lE",
        isPremium: true,
        simulationType: "line-follower",
        content: {
          uz: "### RoboMaster Ekspert darajasi:\nSiz robototexnika sohasidagi barcha asosiy mavzularni (elektronika, dasturlash, IoT, sensorlar, kompyuter ko'rishi) muvaffaqiyatli o'rganib chiqdingiz. Yakuniy vazifa — haqiqiy muhandislik diplom loyihasidir.\n\n### Capstone talablari:\n1. Tizim har xil sensorlar (Ultratovush, Chiziq) ma'lumotlarini mustaqil qayta ishlashi.\n2. WiFi orqali veb-boshqaruv paneliga ega bo'lishi.\n3. Har qanday g'ovni 100% avtonom aylanib o'tishi va chiziqda yura olishi lozim.",
          ru: "### Выпускной экспертный уровень:\nВы успешно освоили все ключевые аспекты робототехники (электроника, программирование, Интернет вещей, компьютерное зрение). Финальным этапом является комплексная дипломная работа.\n\n### Требования к Дипломному проекту:\n1. Робот должен принимать решения на основе показаний нескольких датчиков.\n2. Иметь веб-интерфейс управления по Wi-Fi.\n3. Успешно следовать по линии и автоматически объезжать препятствия при их обнаружении.",
          en: "### Academy Expert Graduation:\nYou have successfully conquered electronics, embedded programming, industrial IoT, sonar automation, and computer vision. Your final target is the completion of our academy capstone portfolio exam.\n\n### Capstone Requirements:\n1. Multi-threaded sensor fusion (processing sonar distance warnings while following black paths).\n2. Real-time web-server analytics reporting metrics back to a browser dashboard.\n3. Graceful failure recovery routines (active homing, collision avoidance override cycles)."
        },
        quiz: {
          id: "q10_1",
          title: { uz: "Ekspert Muhandislik Imtihoni", ru: "Выпускной инженерный экзамен", en: "Expert Engineering Exam" },
          questions: [
            {
              id: "q10_1_1",
              text: {
                uz: "Robot tizimida 'Sensor Fusion' (Sensorlarni birlashtirish) deganda nima tushuniladi?",
                ru: "Что означает 'Sensor Fusion' (Объединение датчиков) в робототехнике?",
                en: "What does the term 'Sensor Fusion' describe in robotic architectures?"
              },
              options: [
                { uz: "Sensorlarni ketma-ket ulash", ru: "Последовательное соединение датчиков", en: "Wiring sensors in daisy-chain format" },
                { uz: "Bir necha sensor ma'lumotlarini birlashtirib, aniqroq xulosa olish", ru: "Объединение данных из разных источников для получения более точной информации", en: "Combining inputs from multiple sensors to achieve a more precise state estimate" },
                { uz: "Sensorlarni o'chirib qo'yish", ru: "Отключение датчиков в случае перегрузки", en: "Turning off redundant sensors to save battery" },
                { uz: "Datchiklar korpusini bir-biriga yopishtirish", ru: "Склеивание корпусов датчиков", en: "Glueing physical sensor shells together" }
              ],
              correctOptionIndex: 1,
              explanation: {
                uz: "Sensor Fusion yordamida, masalan, lidar va kamera ma'lumotlari birlashtirilib, datchiklarning alohida kamchiliklari bartaraf etiladi.",
                ru: "Sensor Fusion объединяет данные (например, лидара и камеры), чтобы нивелировать шумы каждого датчика в отдельности.",
                en: "Sensor Fusion merges complementary data streams (like camera + LiDAR) to construct highly robust environmental representations."
              }
            }
          ]
        },
        homework: {
          id: "hw10_1",
          title: {
            uz: "Yakuniy robot dasturiy arxitekturasi",
            ru: "Архитектура выпускного проекта",
            en: "Final Core-Loop Architecture"
          },
          description: {
            uz: "Avtonom robotning sensorlar o'qish, qaror qabul qilish va motorlarni boshqarish bosqichlarini qamrab olgan asosiy ko'p oqimli yoki tsiklli (main loop) tizim diagrammasini kod ko'rinishida tasvirlang.",
            ru: "Напишите законченную структуру основной функции loop() робота, включающую опрос ультразвукового датчика, датчиков линии и функции корректировки моторов.",
            en: "Write a highly robust, clean Arduino style main loop framework orchestrating sonar telemetry, line-follower sensor checks, and motor safety overrides."
          },
          prompt: "Write a complete integrated sketch showing sensor-fusion loops inside Arduino style setup/loop.",
          defaultCode: `// RoboMaster Expert Capstone Program
#include <Servo.h>

const int trigPin = 2;
const int echoPin = 3;
const int leftSensor = 11;
const int rightSensor = 12;

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(leftSensor, INPUT);
  pinMode(rightSensor, INPUT);
}

void loop() {
  // 1. Read sonar distance
  float distance = readDistance();
  
  // 2. If object too close, trigger emergency turn/stop
  if (distance < 15.0) {
    emergencyStop();
  } else {
    // 3. Otherwise, follow path using line sensors
    followLine();
  }
}

float readDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  return pulseIn(echoPin, HIGH) * 0.034 / 2.0;
}

void emergencyStop() {
  // Motor stop controls
}

void followLine() {
  // Read leftSensor and rightSensor and adjust motors
}`
        }
      }
    ]
  }
];

const dynamicCurriculum: Level[] = [];

const topics = [
  {
    topic: "Sanoat Manipulyatorlari",
    topicRu: "Промышленные Манипуляторы",
    topicEn: "Industrial Manipulators",
    sub: "6 o'qli robotlar va kinematika",
    subRu: "6-осевые роботы и кинематика",
    subEn: "6-axis robots and kinematics",
    desc: "Robot qo'llarini (manipulyator) boshqarish darslari. Koordinatalar tizimi va trayektoriya tuzish.",
    descRu: "Уроки управления роборуками (манипуляторами). Системы координат и планирование траектории.",
    descEn: "Lessons on controlling robotic arms (manipulators). Coordinate systems and trajectory planning."
  },
  {
    topic: "Dronlar va Kvadrokopterlar",
    topicRu: "Дроны и Квадрокоптеры",
    topicEn: "Drones and Quadcopters",
    sub: "Aerodinamika va parvoz kontrollerlari",
    subRu: "Аэродинамика и полетные контроллеры",
    subEn: "Aerodynamics and flight controllers",
    desc: "Parvoz qiluvchi robotlarni loyihalash, barqarorlashtirish va datchiklar (IMU, Gyroscope) bilan ishlash.",
    descRu: "Проектирование летающих роботов, их стабилизация и работа с гироскопами (IMU).",
    descEn: "Designing flying robots, stabilizing them, and working with IMU/gyroscope sensors."
  },
  {
    topic: "Gumanoid (Odamnsimon) Robotlar",
    topicRu: "Гуманоидные Роботы",
    topicEn: "Humanoid Robots",
    sub: "Ikki oyoqda muvozanat saqlash va yurish",
    subRu: "Балансировка и ходьба на двух ногах",
    subEn: "Two-legged balance and walking",
    desc: "Inson harakatlarini taqlid qiluvchi gumanoid robotlar arxitekturasi va muvozanat algoritmlari.",
    descRu: "Архитектура гуманоидных роботов, имитирующих человеческие движения, и алгоритмы баланса.",
    descEn: "Architecture of humanoid robots mimicking human motion and balance algorithms."
  },
  {
    topic: "Aqlli Qishloq Xo'jaligi (Agribots)",
    topicRu: "Умное Сельское Хозяйство",
    topicEn: "Smart Agriculture (Agribots)",
    sub: "Hosildorlik va tuproq tahlili avtomatizatsiyasi",
    subRu: "Автоматизация анализа почвы и урожайности",
    subEn: "Soil analysis and crop yield automation",
    desc: "Qishloq xo'jaligida ekinlarni ekish, sug'orish va begona o'tlarni aniqlash avtomatizatsiyasi.",
    descRu: "Автоматизация посадки, полива и распознавания сорняков в сельском хозяйстве.",
    descEn: "Automation of crop planting, watering, and weed detection in modern agriculture."
  },
  {
    topic: "Tibbiy va Jarrohlik Robotlari",
    topicRu: "Медицинские и Хирургические Роботы",
    topicEn: "Medical and Surgical Robots",
    sub: "Mikro-millimetrli aniqlik va masofadan boshqarish",
    subRu: "Микромиллиметровая точность и телеуправление",
    subEn: "Micro-millimeter precision and teleoperation",
    desc: "Tibbiyotda jarrohlik amaliyotlarini o'tkazishda qo'llaniladigan yuqori aniqlikdagi robotlar dasturi.",
    descRu: "Высокоточное программное обеспечение для медицинских роботов-хирургов.",
    descEn: "High-precision software models used in surgical medical operations."
  },
  {
    topic: "Kosmik Roverlar va Sun'iy Yo'ldoshlar",
    topicRu: "Космические Роверы и Спутники",
    topicEn: "Space Rovers and Satellites",
    sub: "Koinot va Mars sharoitida ishlash",
    subRu: "Работа в условиях космоса и Марса",
    subEn: "Space and Martian environmental operation",
    desc: "Mars yoki Oydagi avtonom roverlar uchun navigatsiya tizimlari va quyosh panellari boshqaruvi.",
    descRu: "Системы навигации для автономных марсоходов и управление солнечными панелями.",
    descEn: "Navigation systems for autonomous moon/mars rovers and solar panel controls."
  },
  {
    topic: "ROS (Robot Operating System) Tizimi",
    topicRu: "Система ROS (Robot Operating System)",
    topicEn: "ROS (Robot Operating System) Ecosystem",
    sub: "Tugunlar (Nodes), Mavzular (Topics) va Aloqa",
    subRu: "Ноды, топики и межпроцессное взаимодействие",
    subEn: "Nodes, topics, and inter-process message passing",
    desc: "Sanoatda eng ko'p ishlatiladigan robot operatsion tizimi - ROS asoslari va publish/subscribe arxitekturasi.",
    descRu: "Основы промышленной операционной системы роботов ROS и архитектура публикация/подписка.",
    descEn: "Foundations of ROS (Robot Operating System) and publish/subscribe architecture used in advanced systems."
  },
  {
    topic: "Minalardan Tozalash va Qutqaruv Robotlari",
    topicRu: "Роботы-Спасатели и Миноискатели",
    topicEn: "Rescue and Mine-Sweeping Robots",
    sub: "Ekstremal sharoitlarda navigatsiya",
    subRu: "Навигация в экстремальных условиях",
    subEn: "Extreme environment navigation",
    desc: "Favqulodda vaziyatlar, zilzilalar va xavfli hududlarda insonlar hayotini saqlash uchun robotlar.",
    descRu: "Роботы для зон бедствий, землетрясений и опасных зон для спасения жизней людей.",
    descEn: "Robotic platforms designed for disaster zones, earthquakes, and hazard remediation."
  },
  {
    topic: "Suv Osti Robotlari (ROV / AUV)",
    topicRu: "Подводные Роботы (ROV / AUV)",
    topicEn: "Underwater Robotics (ROV / AUV)",
    sub: "Gidrodinamika va chuqurlik datchiklari",
    subRu: "Гидродинамика и датчики глубины",
    subEn: "Hydrodynamics and depth sensors",
    desc: "Okean tubini o'rganish, suv osti quvurlarini tekshirish uchun gidrodinamik robotlar loyihalash.",
    descRu: "Проектирование гидродинамических роботов для исследования океана и подводных трубопроводов.",
    descEn: "Designing hydrodynamic marine crawlers and submersibles to map sea floors and oil rigs."
  },
  {
    topic: "Mashinali O'rganish va Neyron Tarmoqlar",
    topicRu: "Машинное Обучение и Нейросети",
    topicEn: "Machine Learning & Neural Networks",
    sub: "Robotlarda Edge AI va tasvirni klassifikatsiyalash",
    subRu: "Edge AI и классификация изображений на роботах",
    subEn: "Edge AI and image classification in robotics",
    desc: "Robotlarda neyron tarmoqlarni o'rnatish, to'siqlarni tasniflash va modelni optimallashtirish.",
    descRu: "Запуск нейросетей непосредственно на роботах, классификация препятствий и оптимизация.",
    descEn: "Deploying deep learning on resource-constrained microcontrollers for real-time edge processing."
  }
];

// Loop from 11 to 100 to dynamically generate intermediate and expert levels
for (let i = 11; i <= 100; i++) {
  const topicIndex = (i - 11) % topics.length;
  const topic = topics[topicIndex];
  
  // Custom unique simulationType to vary layouts
  const simTypes: ('led' | 'servo' | 'ultrasonic' | 'iot-web' | 'code-only' | 'line-follower' | 'cv-grid')[] = 
    ['code-only', 'servo', 'led', 'ultrasonic', 'iot-web', 'line-follower', 'cv-grid'];
  const simType = simTypes[i % simTypes.length];

  dynamicCurriculum.push({
    id: i,
    title: {
      uz: `${i}-daraja: ${topic.topic}`,
      ru: `Уровень ${i}: ${topic.topicRu}`,
      en: `Level ${i}: ${topic.topicEn}`
    },
    subtitle: {
      uz: topic.sub,
      ru: topic.subRu,
      en: topic.subEn
    },
    description: {
      uz: `${topic.desc} Ushbu darajani muvaffaqiyatli yakunlab professional muhandis darajasiga ko'tariling.`,
      ru: `${topic.descRu} Пройдите этот уровень, чтобы повысить свою квалификацию как профессиональный инженер.`,
      en: `${topic.descEn} Successfully complete this level to advance your core professional robotics engineering skills.`
    },
    lessons: [
      {
        id: `l${i}_1`,
        levelId: i,
        title: {
          uz: `Dars ${i}.1: Asosiy nazariya va amaliyot`,
          ru: `Урок ${i}.1: Основная теория и практика`,
          en: `Lesson ${i}.1: Core Theory & Practice`
        },
        description: {
          uz: `Ushbu mavzu bo'yicha eng muhim tushunchalar, formulalar va dasturlash qoliplari bilan tanishish.`,
          ru: `Изучение ключевых концепций, формул и шаблонов программирования по данной теме.`,
          en: `Overview of essential mathematical models, controller formulas, and script patterns.`
        },
        videoUrl: "https://www.youtube.com/embed/8wXal7gSClE",
        isPremium: i > 12, // Levels above 12 are premium
        simulationType: simType,
        content: {
          uz: `### ${topic.topic} darsiga xush kelibsiz!\n\nBu darsda siz ${topic.sub.toLowerCase()} mavzusida chuqurlashtirilgan bilim olasiz.\n\n### Asosiy qoidalar:\n* Avtomatlashtirish muhandisining eng muhim vazifasi - xavfsizlik va aniqlikdir.\n* Tizimdagi har bir sensor o'z vaqtida va aniq ma'lumot berishi lozim.\n* Tizimdagi harakatlarni boshqarish uchun PID kontroller algoritmlari qo'llaniladi.\n\n### Masala algoritmi:\n\`\`\`cpp\n// Harakatlarni boshqarish kodi\nvoid controlLoop() {\n  float error = getTarget() - getCurrent();\n  float output = Kp * error;\n  setActuator(output);\n}\n\`\`\``,
          ru: `### Добро пожаловать на урок: ${topic.topicRu}!\n\nВ этом уроке вы получите глубокие знания по теме ${topic.subRu.toLowerCase()}.\n\n### Ключевые правила:\n* Главная задача инженера автоматизации — безопасность и точность.\n* Каждый датчик в системе должен своевременно поставлять данные.\n* Для управления движениями часто используются PID-регуляторы.\n\n### Шаблон алгоритма:\n\`\`\`cpp\n// Код управления\nvoid controlLoop() {\n  float error = getTarget() - getCurrent();\n  float output = Kp * error;\n  setActuator(output);\n}\n\`\`\``,
          en: `### Welcome to Lesson: ${topic.topicEn}!\n\nIn this lesson, you will acquire deep understanding of ${topic.subEn.toLowerCase()}.\n\n### Key Regulations:\n* High precision and runtime safety are paramount for professional robotic installations.\n* Multiple sensory feeds must feed the central MCU with zero latency.\n* Feedback PID loops coordinate active correction algorithms.\n\n### Code Pattern:\n\`\`\`cpp\n// Closed-loop execution skeleton\nvoid controlLoop() {\n  float error = getTarget() - getCurrent();\n  float output = Kp * error;\n  setActuator(output);\n}\n\`\`\``
        },
        quiz: {
          id: `q${i}_1`,
          title: {
            uz: `${topic.topic} Mavzusi Testi`,
            ru: `Тест по теме ${topic.topicRu}`,
            en: `${topic.topicEn} Evaluation Quiz`
          },
          questions: [
            {
              id: `q${i}_1_1`,
              text: {
                uz: "Muhandislikda PID datchigidagi 'P' harfi nimani anglatadi?",
                ru: "Что означает буква 'P' в PID-регуляторе?",
                en: "What does the 'P' stand for in a closed-loop PID controller?"
              },
              options: [
                { uz: "Proportsional (Proportional)", ru: "Пропорциональный (Proportional)", en: "Proportional" },
                { uz: "Parallel (Parallel)", ru: "Параллельный (Parallel)", en: "Parallel" },
                { uz: "Passiv (Passive)", ru: "Пассивный (Passive)", en: "Passive" },
                { uz: "Pnevmatik (Pneumatic)", ru: "Пневматический (Pneumatic)", en: "Pneumatic" }
              ],
              correctOptionIndex: 0,
              explanation: {
                uz: "Proportsional koeffitsient xatoga proportsional ravishda boshqaruv signalini hisoblaydi.",
                ru: "Пропорциональный коэффициент рассчитывает управляющий сигнал прямо пропорционально ошибке.",
                en: "The proportional term drives the output proportionally to the current error state."
              }
            }
          ]
        },
        homework: {
          id: `hw${i}_1`,
          title: {
            uz: `${topic.topic} Amaliy Ishi`,
            ru: `Практическая работа: ${topic.topicRu}`,
            en: `Practical Project: ${topic.topicEn}`
          },
          description: {
            uz: "Mavzu bo'yicha deyarli barcha sensor va drayver sozlamalarini ko'rsatuvchi kodni sozlang.",
            ru: "Напишите или настройте базовый алгоритм управления по текущей теме.",
            en: "Configure the main control loop parameters and thresholds according to instructions."
          },
          prompt: "Write a complete simple control program.",
          defaultCode: `// ${topic.topicEn} Controller Config
void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  // Toggle control state
  digitalWrite(13, HIGH);
  delay(500);
  digitalWrite(13, LOW);
  delay(500);
}`
        }
      }
    ]
  });
}

export const curriculum: Level[] = [...staticCurriculum, ...dynamicCurriculum];

export const ALL_BADGES = [
  {
    id: "badge_l1",
    name: { uz: "Pioner Muhandis", ru: "Пионер-Инженер", en: "Pioneer Engineer" },
    description: { uz: "Robototexnika asoslarini o'rganib chiqdi", ru: "Освоил основы робототехники", en: "Mastered robotics fundamentals" },
    icon: "Cpu",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "badge_l2",
    name: { uz: "Tok Ustasi", ru: "Мастер Тока", en: "Master of Current" },
    description: { uz: "Svetodiodlar va Om qonunini o'rgandi", ru: "Освоил светодиоды и закон Ома", en: "Mastered LEDs and Ohm's law" },
    icon: "Zap",
    color: "from-yellow-400 to-amber-600"
  },
  {
    id: "badge_l3",
    name: { uz: "Arduino dasturchi", ru: "Разработчик Arduino", en: "Arduino Coder" },
    description: { uz: "Servomatorlarni PWM orqali boshqardi", ru: "Программировал сервоприводы по ШИМ", en: "Controlled servo motors via PWM" },
    icon: "Code",
    color: "from-teal-400 to-emerald-600"
  },
  {
    id: "badge_l4",
    name: { uz: "IoT Gurusi", ru: "IoT Гуру", en: "IoT Guru" },
    description: { uz: "ESP32 yordamida simsiz server qurdi", ru: "Создал беспроводной сервер на ESP32", en: "Created a wireless server on ESP32" },
    icon: "Wifi",
    color: "from-purple-500 to-pink-600"
  },
  {
    id: "badge_l6",
    name: { uz: "Sonar Mutaxassisi", ru: "Специалист Сонаров", en: "Sonar Specialist" },
    description: { uz: "HC-SR04 datchigi formulasini amalda qo'lladi", ru: "Применил датчик HC-SR04 в симуляции", en: "Utilized HC-SR04 sonar sensor in simulation" },
    icon: "Activity",
    color: "from-cyan-400 to-blue-600"
  },
  {
    id: "badge_l7",
    name: { uz: "Trek Dizayneri", ru: "Дизайнер Трека", en: "Track Master" },
    description: { uz: "Chiziqda harakatlanuvchi robot tuzdi", ru: "Собрал робота, следующего по линии", en: "Built a line following autonomous rover" },
    icon: "Route",
    color: "from-orange-500 to-red-600"
  },
  {
    id: "badge_l8",
    name: { uz: "Kamera Ko'zi", ru: "Око Камеры", en: "Camera Eye" },
    description: { uz: "OpenCV va sun'iy intellekt darslarini yakunladi", ru: "Завершил уроки по OpenCV и ИИ", en: "Completed OpenCV and AI classes" },
    icon: "Eye",
    color: "from-indigo-500 to-purple-600"
  }
];
