"""50 Curated CV-Ready Robotics Project Ideas (25 Hardware, 25 Software).
Each is designed to utilize components from the club inventory and deliver high CV value."""

SEED_IDEAS = [
    # ─── HARDWARE PROJECTS (25) ───
    {
        "title": "Precision Autonomous Agricultural Rover",
        "category": "Hardware",
        "difficulty": "Advanced",
        "tech_stack": "ESP32, Soil Moisture Sensor, L298N Motor Driver, Water Pump, Chassis, BO Motors",
        "description": "An autonomous mobile agricultural rover that navigates a mock field using a differential drive chassis, samples soil moisture, and deploys a water pump dynamically to hydrate dry spots.",
        "learning_outcomes": "Closed-loop automation, analog sensor calibration, H-bridge motor driver, power systems"
    },
    {
        "title": "Ultrasonic LiDAR-Lite Spatial Obstacle Mapper",
        "category": "Hardware",
        "difficulty": "Intermediate",
        "tech_stack": "Arduino Uno, Ultrasonic Sensor, Servo Motor MG90S, OLED Display, Jumper Wires",
        "description": "Construct a 180-degree sweep radar system that rotates an ultrasonic sensor using a high-precision MG90S servo, maps distance points, and plots a live scatter plot of surrounding obstacles on an OLED.",
        "learning_outcomes": "Servo angular interpolation, polar to Cartesian mapping, high-speed SPI display rendering"
    },
    {
        "title": "Smart RFID Security Access Locker",
        "category": "Hardware",
        "difficulty": "Beginner",
        "tech_stack": "Arduino Uno, RFID Card Reader, Keypad Lock, Relay Module, LCD Display, Buzzer",
        "description": "Build an ultra-secure door or box locking mechanism featuring dynamic RFID card validation, secondary keypad authorization, and a high-current solenoid lock driven via a relay module with buzzer alarms for intrusion.",
        "learning_outcomes": "Access control security, SPI peripheral communication, debouncing logic, relay safety"
    },
    {
        "title": "Autonomous Fire-Extinguishing Combat Bot",
        "category": "Hardware",
        "difficulty": "Advanced",
        "tech_stack": "ESP32, Flame Sensor, Gas Sensor MQ-2, Water Pump, Relay Module, N60 Gear Motors, Chassis",
        "description": "Design an autonomous bot that patrols spaces for fire hazards. Upon detecting heat or gas, it tracks the flame source, triggers a buzzer, and activates a water pump spray aimed at the hazard.",
        "learning_outcomes": "Industrial sensor safety integration, high-torque motor drive, fail-safe architecture"
    },
    {
        "title": "Real-time GPS Fleet Asset & Health Tracker",
        "category": "Hardware",
        "difficulty": "Intermediate",
        "tech_stack": "ESP32, GPS module (neo-6m), Battery Pack, OLED Display, WiFi Protocol",
        "description": "Develop a rugged wearable or vehicle-mounted GPS logging device. It captures live NMEA strings from the Neo-6M sensor, extracts coordinates, and uploads real-time telemetry to a cloud database with local OLED feedback.",
        "learning_outcomes": "NMEA string parsing, asynchronous WiFi client protocols, low-power sleep state management"
    },
    {
        "title": "Industrial Gas Sentinel & Air Quality Hub",
        "category": "Hardware",
        "difficulty": "Beginner",
        "tech_stack": "Gas Sensor MQ-2, Arduino Uno, Buzzer, LCD Display, Relay Module, Fan Blade",
        "description": "Create an environmental monitor that tracks volatile organic gases. When safety thresholds are breached, the hub triggers physical alerts and fires up a 12V ventilation fan powered through a relay.",
        "learning_outcomes": "Gas threshold modeling, high-load DC fan actuation, safety-critical embedded systems"
    },
    {
        "title": "Peltier-Effect Solid State Micro-Refrigerator",
        "category": "Hardware",
        "difficulty": "Intermediate",
        "tech_stack": "Peltier Module, Aluminium Block, Fan Blade, ESP32, Relay Module, Soil Moisture/Temp Sensor",
        "description": "Build an active solid-state cooling system using the Peltier effect. A temperature probe monitors the hot/cold boundary, dynamically switching relays to trigger active fan cooling to prevent thermal runaway.",
        "learning_outcomes": "Thermoelectric dynamics, active heat sinks, heat exchange efficiency calculation"
    },
    {
        "title": "Gestural Teleoperation Glove for Robotic Arms",
        "category": "Hardware",
        "difficulty": "Advanced",
        "tech_stack": "Arduino Uno, Flex Sensors, MPU-6050 IMU, Battery Pack, MG90S Servos",
        "description": "Create a wearable glove containing flexible resistors and an IMU. Interfacing these allows direct real-time control over a multi-axis robotic arm, mirroring wrist rotation and finger pinches in real-time.",
        "learning_outcomes": "IMU sensor fusion, analog mapping, gesture filtering, multi-servo joint synchronization"
    },
    {
        "title": "Solar Harvesting Tracker with LDR Arrays",
        "category": "Hardware",
        "difficulty": "Intermediate",
        "tech_stack": "Arduino Uno, LDR Modules, MG90S Servos, Battery Pack, Breadboard",
        "description": "Design a solar tracker that dynamically rotates a platform on two axes to point directly at the brightest light source. Leverages light-dependent resistors configured in a bridge to drive MG90S micro servos.",
        "learning_outcomes": "Voltage dividers, dual-axis differential calculations, micro-servomotor precision tuning"
    },
    {
        "title": "ESP32-Cam Intelligent Face Verification Lock",
        "category": "Hardware",
        "difficulty": "Advanced",
        "tech_stack": "ESP-32 Cam Module, PIR Motion Sensor, Buzzer, Relay Module, Solenoid Lock",
        "description": "Create a security checkpoint. The PIR sensor wakes the ESP32-Cam upon movement detection, which captures and processes a face. A matching face triggers the relay to unlock the door with auditive buzzer feedback.",
        "learning_outcomes": "Low-power deep sleep sleep-to-wake, edge camera streaming, GPIO interrupt handling"
    },
    {
        "title": "Quadcopter Flight Controller & Stabilization Stack",
        "category": "Hardware",
        "difficulty": "Advanced",
        "tech_stack": "Flight Controller (SPF-3), BLDC ESC 30A, BLDC Propellers, MPU-6050 IMU, STM32",
        "description": "Assemble a quadcopter propulsion system using high-rpm BLDC motors and ESCs. Interfaced with an SPF-3 flight controller to configure attitude stabilization loops and ESC PWM throttle control.",
        "learning_outcomes": "BLDC commutation, ESC calibration, high-speed PWM signals, flight dynamics"
    },
    {
        "title": "STM32 Real-Time Operating System Control Board",
        "category": "Hardware",
        "difficulty": "Advanced",
        "tech_stack": "STM32, L298N Motor Driver, MPU-6050 IMU, OLED Display, FreeRTOS",
        "description": "Configure an STM32 ARM Cortex-M board using FreeRTOS to manage multiple concurrent tasks: sensor acquisition from MPU-6050, motor driver speed calculation via PWM, and screen updating.",
        "learning_outcomes": "ARM Cortex architecture, RTOS task scheduler, mutexes/semaphores, DMA data transfer"
    },
    {
        "title": "Conveyor Belt Defect & Color Sorting Gantry",
        "category": "Hardware",
        "difficulty": "Intermediate",
        "tech_stack": "IR Sensor, BO Motor, MG90S Servo, LDR Module, Buzzer, Chassis",
        "description": "An industrial sorting gantry that feeds items down a conveyor belt driven by BO motors. An IR sensor detects item arrival, LDR checks reflectivity, and an MG90S servo sweeps defective items off the track.",
        "learning_outcomes": "Industrial sequencing logic, micro-switch state machines, phototransistor calibration"
    },
    {
        "title": "Self-Balancing Dynamic Inverted Pendulum Segway",
        "category": "Hardware",
        "difficulty": "Advanced",
        "tech_stack": "STM32, MPU-6050 IMU, N60 Gear Motors, L298N Motor Driver, Chassis",
        "description": "A two-wheeled Segway rover that achieves upright equilibrium. Reads accelerometer/gyro scope rates from the MPU-6050 and runs an STM32 controller loop to drive high-torque N60 motors back and forth.",
        "learning_outcomes": "PID tuning, complementary filter design, dynamic stability modeling"
    },
    {
        "title": "Environmental Weather Station & Flood Alerter",
        "category": "Hardware",
        "difficulty": "Beginner",
        "tech_stack": "Rain Sensor, PIR Motion Sensor, ESP32, OLED Display, Buzzer",
        "description": "Deploy a safety monitor designed for harsh conditions. It measures precipitation via a rain sensor, tracks flood level thresholds, and sends out immediate high-frequency buzzer alarms upon flash flooding warnings.",
        "learning_outcomes": "ADC sensing thresholds, state machines, display buffer optimization"
    },
    {
        "title": "Custom Dual-Channel Motor Driver ESC Board",
        "category": "Hardware",
        "difficulty": "Advanced",
        "tech_stack": "STM32, Soldering Iron, XT-60 Connector, Relay Module, Buzzer, Multimeter",
        "description": "Design and solder a custom power control board to feed brushless or brushed DC motors. Integrates high-current XT-60 connectors and relays for emergency battery decoupling monitored with a multimeter.",
        "learning_outcomes": "Power electronics layout, soldering safety, high-current path isolation, thermal modeling"
    },
    {
        "title": "Solenoid-Actuated Braille Typist Printer",
        "category": "Hardware",
        "difficulty": "Intermediate",
        "tech_stack": "Arduino Uno, Keypad Lock, MG90S Servos, OLED Display, Switch",
        "description": "Develop an assistive Braille translation typing device that receives standard keyboard strings, translates them, and physically actuates micro servo pins to form physical embossed patterns.",
        "learning_outcomes": "Assistive engineering, text encoding, character parsing, multi-motor synchronization"
    },
    {
        "title": "Autonomous Maze-Solving Micromouse Rover",
        "category": "Hardware",
        "difficulty": "Advanced",
        "tech_stack": "Arduino Uno, IR Sensors, N60 Gear Motors, L298N Motor Driver, Battery Pack",
        "description": "Build an ultra-compact mouse rover that navigates physical grid mazes. Utilizes 3 high-precision IR distance sensors to determine wall layouts and run a dead-reckoning navigation path algorithm.",
        "learning_outcomes": "Dead reckoning, spatial search algorithms, differential drive physics"
    },
    {
        "title": "Smart Smart-Irrigation Hydroponics Cabinet",
        "category": "Hardware",
        "difficulty": "Beginner",
        "tech_stack": "Soil Moisture Sensor, ESP32, Relay Module, Water Pump, Fan Blade",
        "description": "Automate indoor cabinet growth environments by taking reading samples from soil moisture, driving a submersed pump through solid-state relays, and using fan blades to circulate fresh air.",
        "learning_outcomes": "Agricultural engineering, closed-loop feedback, load switching safety"
    },
    {
        "title": "Motion-Triggered Autonomous Camera Slider",
        "category": "Hardware",
        "difficulty": "Intermediate",
        "tech_stack": "PIR Motion Sensor, MG90S Servo, BO Motor, OLED Display, Arduino Uno",
        "description": "An interactive camera sliding gantry that slides on a belt track using BO motors. Upon detecting wildlife or motion via the PIR sensor, it locks focus using MG90S and slides smooth tracking patterns.",
        "learning_outcomes": "Linear slide mechanics, sensor-to-actuator latency, dynamic speed ramping"
    },
    {
        "title": "Hazardous Gas Safety Emergency Vent System",
        "category": "Hardware",
        "difficulty": "Beginner",
        "tech_stack": "Gas Sensor MQ-2, Flame Sensor, Buzzer, Relay Module, LCD Display, Fan Blade",
        "description": "Construct an automated emergency gas ventilation station. Upon detecting combustible gas, it raises an emergency alarm, displays alert text on an LCD, and engages exhaust fan blades via a relay.",
        "learning_outcomes": "Industrial hazard prevention, priority interrupts, solid state control switches"
    },
    {
        "title": "Robotic Finger with Haptic Flex Feedback",
        "category": "Hardware",
        "difficulty": "Intermediate",
        "tech_stack": "Flex Sensor, MG90S Servo, Buzzer, OLED Display, ESP32",
        "description": "Assemble a bionic prosthetic finger using a high-torque MG90S servo. Interfaced with flex sensors to calibrate finger bend tracking, providing audible buzzes when grasping limits are reached.",
        "learning_outcomes": "Haptic feedback, ergonomic design, biomechatronics calibration"
    },
    {
        "title": "Heavy-Duty Autonomous Logistics Rover",
        "category": "Hardware",
        "difficulty": "Advanced",
        "tech_stack": "Chassis, N60 Gear Motors, Ultrasonic Sensor, GPS module (neo-6m), L298N Motor Driver",
        "description": "Develop a prototype warehouse logistics robot using a rugged metal chassis. Guided by GPS coordinates for coarse positioning and ultrasonic sensor sweeps for precise close-range obstacle docking.",
        "learning_outcomes": "Sensor-data coordination, torque matching, outdoor mobile robotics integration"
    },
    {
        "title": "Multi-mode Digital Servo Parameter Tester",
        "category": "Hardware",
        "difficulty": "Beginner",
        "tech_stack": "Servo Tester, MG90S Servo, OLED Display, Battery Pack, Switch",
        "description": "Design an instrument dashboard that sweeps servomotors across custom speed curves and profiles, displaying voltage drops and angular positions dynamically on an OLED screen.",
        "learning_outcomes": "Instrument design, test bench creation, signal analysis"
    },
    {
        "title": "Water-Cooled Active Peltier Radiator",
        "category": "Hardware",
        "difficulty": "Advanced",
        "tech_stack": "Peltier Module, Aluminium Block, Fan Blade, Water Pump, Relay Module",
        "description": "A heavy-duty thermal solution that uses a water pump to circulate coolant across an aluminum block attached to a Peltier cooling module, governed by automated fan blade triggers.",
        "learning_outcomes": "Hydraulics, heat exchangers, solid state thermoelectric cooling loops"
    },

    # ─── SOFTWARE PROJECTS (25) ───
    {
        "title": "Real-Time ROS2 Robotic Fleet Coordinator",
        "category": "Software",
        "difficulty": "Advanced",
        "tech_stack": "ROS2, Python, C++, WebSockets, React Dashboard",
        "description": "Develop a centralized fleet management system for autonomous rovers. ROS2 node handles navigation, coordinates dynamic obstacle reports, and communicates robot status to a live web GUI over WebSockets.",
        "learning_outcomes": "ROS2 publishers/subscribers, asynchronous web interfaces, telemetry pipelines"
    },
    {
        "title": "Edge AI Facial Recognition Security Sentinel",
        "category": "Software",
        "difficulty": "Advanced",
        "tech_stack": "ESP-32 Cam Module, TensorFlow Lite Micro, OpenCV, C++",
        "description": "Develop a lightweight convolutional neural network optimized for microcontrollers to run on the ESP32-Cam. Performs real-time detection, feature extraction, and secure access verification.",
        "learning_outcomes": "CNN optimization, TensorFlow Lite compiler, embedded memory management"
    },
    {
        "title": "MPU-6050 Complementary/Kalman Sensor Fusion Pipeline",
        "category": "Software",
        "difficulty": "Advanced",
        "tech_stack": "STM32 HAL, C, MATLAB, MPU-6050 IMU, Linear Algebra",
        "description": "Develop a robust sensor calibration pipeline. Processes high-frequency accelerometer and gyroscope raw outputs from the MPU-6050, filters noises, and estimates accurate pitch/roll coordinates.",
        "learning_outcomes": "Kalman filtering, Complementary filter derivation, Matrix mathematics, DSP"
    },
    {
        "title": "Flight Controller Attitudinal PID Loop Solver",
        "category": "Software",
        "difficulty": "Advanced",
        "tech_stack": "SPF-3 Flight Controller, C, STM32 drivers, Control Systems",
        "description": "Implement a real-time quadcopter stabilization script. Gathers orientation angles and calculates necessary ESC BLDC throttle speeds using highly optimized proportional-integral-derivative algorithms.",
        "learning_outcomes": "PID tuning parameters, real-time interrupt handlers, aerodynamic control physics"
    },
    {
        "title": "Geofencing Mapping & Telemetry API Gateway",
        "category": "Software",
        "difficulty": "Intermediate",
        "tech_stack": "Python, FastAPI, Leaflet.js, GPS module (neo-6m), Firebase",
        "description": "Develop a microservice that parses raw NMEA GPS strings from a mobile asset, tracks coordinate limits within map geofences, and dispatches automated alerts if security limits are breached.",
        "learning_outcomes": "GIS mapping algorithms, API gateway creation, time-series data storage"
    },
    {
        "title": "PID Motor Speed Controller with Encoder Feedback",
        "category": "Software",
        "difficulty": "Intermediate",
        "tech_stack": "Arduino Uno, L298N Motor Driver, C++, Matplotlib Visuals",
        "description": "Build a controller that maintains motor speeds under variable physical loads. Captures raw wheel ticks, computes velocity errors, and updates PWM signals, plotting real-time convergence graphs.",
        "learning_outcomes": "Velocity calculations, encoder ticks parsing, closed loop tuning, plotting tools"
    },
    {
        "title": "SLAM Mapping & Pathplanning Sim Engine",
        "category": "Software",
        "difficulty": "Advanced",
        "tech_stack": "ROS2 Navigation Stack, Gazebo, LiDAR Simulation, A* Algorithm",
        "description": "Build a fully virtual navigation stack. Simulates a rover navigating a Gazebo warehouse environment using virtual LiDAR to dynamically compute SLAM maps and run A* pathfinding.",
        "learning_outcomes": "SLAM mapping concepts, path planning costmaps, Gazebo physics interfacing"
    },
    {
        "title": "ESP32-Cam Low-Latency Edge Tracker",
        "category": "Software",
        "difficulty": "Advanced",
        "tech_stack": "ESP-32 Cam Module, C++, OpenCV Centroids, WebSockets",
        "description": "A real-time image processing server hosted directly on the ESP32-Cam. Segments target color objects, calculates coordinate centroids on-chip, and streams coordinates with low-latency video.",
        "learning_outcomes": "Image segmentation, low-latency streaming protocols, on-chip video decoding"
    },
    {
        "title": "Multi-threaded RTOS Industrial Scheduler Engine",
        "category": "Software",
        "difficulty": "Advanced",
        "tech_stack": "FreeRTOS, STM32, C, SPI/I2C Protocols",
        "description": "Write a multi-tasking scheduler. Interlaces high-priority routines (IMU interrupts), medium routines (relays/motors), and low-priority routines (OLED rendering) using FreeRTOS semaphores.",
        "learning_outcomes": "Task preemptive scheduling, resource lock prevention, context switching mechanics"
    },
    {
        "title": "Pathfinding Visualizer: A* vs RRT Algorithmic Engine",
        "category": "Software",
        "difficulty": "Intermediate",
        "tech_stack": "Python, Pygame, Graph Theory, Algorithmic Complexity",
        "description": "An interactive educational dashboard that lets users draw custom barriers and visualizes path search differences between standard A* grids and Rapidly-exploring Random Trees (RRT).",
        "learning_outcomes": "Heuristic calculations, graph representations, algorithmic runtime optimization"
    },
    {
        "title": "3D Digital Twin Robotic Synchronizer Dashboard",
        "category": "Software",
        "difficulty": "Intermediate",
        "tech_stack": "React, Three.js, WebSockets, ESP32 Accelerometer",
        "description": "Develop a real-time web portal that visualizes physical asset positions. Interfaced with an ESP32 IMU to stream raw orientation vectors over WebSockets, updating a 3D Three.js mesh model.",
        "learning_outcomes": "3D Web Graphics, high-frequency serialization, coordinate system transforms"
    },
    {
        "title": "Floodfill Autonomous Maze-Solver Algorithm",
        "category": "Software",
        "difficulty": "Intermediate",
        "tech_stack": "C++, Arduino, State Machine Logic, IR Sensors",
        "description": "Write a robust flood-fill maze solver. Tracks grid locations, saves intersection decisions, and recalculates optimal routes to the center target in real-time as physical walls are discovered.",
        "learning_outcomes": "Graph search, flood-fill algorithm optimization, stack memory management"
    },
    {
        "title": "MQTT Campus Multi-Node IoT Sensor Telemetry Pipeline",
        "category": "Software",
        "difficulty": "Intermediate",
        "tech_stack": "ESP32, MQTT Broker, InfluxDB Time-Series, Grafana Metrics",
        "description": "Establish an asset tracking network. Multi-node ESP32 sensors broadcast metrics via MQTT, processed by a central ingestion engine and rendered dynamically on custom Grafana dashboards.",
        "learning_outcomes": "High-throughput messaging protocols, time-series data modeling, network topologies"
    },
    {
        "title": "Neural Network Hand Gesture Recognition Classifier",
        "category": "Software",
        "difficulty": "Intermediate",
        "tech_stack": "PyTorch, Python, Flex Sensors, MPU-6050, SVM Classifier",
        "description": "Train a neural network classifier to identify hand sign gestures. It reads analog flex arrays and IMU rotation rates, extracts feature patterns, and classifies gestures with 95% accuracy.",
        "learning_outcomes": "Feature engineering, dataset creation, supervised classifier tuning"
    },
    {
        "title": "ESP32-Cam Dynamic Frame HSV Mask Color Sorter",
        "category": "Software",
        "difficulty": "Intermediate",
        "tech_stack": "Python, OpenCV, HSV color spaces, serial triggers",
        "description": "Build an image parsing pipeline that receives ESP32-Cam video frames, converts them into HSV color spaces, masks specific colors, tracks contours, and dispatches serial sorting signals.",
        "learning_outcomes": "Color threshold masks, contour detection physics, serial communication links"
    },
    {
        "title": "Dynamic Low-Power ADC Battery Telemetry System",
        "category": "Software",
        "difficulty": "Beginner",
        "tech_stack": "C++, ESP32, Firebase Cloud, Sleep States",
        "description": "Write code to track and log battery usage patterns of rovers. Runs analog-to-digital conversions on voltage outputs, flags low thresholds, and triggers ESP32 deep-sleep modes between updates.",
        "learning_outcomes": "ADC scaling, non-volatile flash storage, sleep-to-wake logic"
    },
    {
        "title": "NLP Natural Language Home Assistant Bridge",
        "category": "Software",
        "difficulty": "Intermediate",
        "tech_stack": "Python, SpeechRecognition API, FastAPI Endpoint, ESP32 client",
        "description": "A smart gateway that records user speech commands, parses keywords, translates commands into structured JSON packets, and relays triggers to smart home switches.",
        "learning_outcomes": "Audio signal acquisition, NLP keyword extraction, network payload design"
    },
    {
        "title": "Collision-Free Multi-Agent Warehouse Fleet Planner",
        "category": "Software",
        "difficulty": "Advanced",
        "tech_stack": "Python, Priority Queues, Graph Theory, A-star planning",
        "description": "Simulate and optimize logistics pathways inside a crowded grid layout. Solves conflicts dynamically and prevents system deadlocks for up to 50 autonomous robots navigating simultaneously.",
        "learning_outcomes": "Grid collision prevention, dynamic reservation tables, scale optimization"
    },
    {
        "title": "Peltier Module Closed-Loop PID Temperature Controller",
        "category": "Software",
        "difficulty": "Intermediate",
        "tech_stack": "C++, Arduino, Peltier Module, PID Control Library",
        "description": "Implement a high-precision thermal control script. Regulates voltages based on continuous error feedback, achieving stable cooling curves for thermal stabilization setups.",
        "learning_outcomes": "Loop sampling tuning, heat dissipation balancing, thermal dynamics loops"
    },
    {
        "title": "Custom High-Reliability Serial Communication Protocol",
        "category": "Software",
        "difficulty": "Beginner",
        "tech_stack": "C++, Arduino Uno, STM32, CRC Checksum algorithms",
        "description": "Write a reliable custom serial framing protocol. Packages sensor arrays into clean byte frames containing headers, body sizes, payload data, and cyclic redundancy checksums (CRC) to prevent packet loss.",
        "learning_outcomes": "Packet framing structures, bitwise operators, error recovery methods"
    },
    {
        "title": "Hazard Emergency Telegram Notification API",
        "category": "Software",
        "difficulty": "Beginner",
        "tech_stack": "Python, Telegram API, Gas Sensor MQ-2, ESP32 Client",
        "description": "Develop a lightweight security script. The ESP32 monitors industrial gas leaks and triggers a central server to dispatch emergency notification updates directly to admin Telegram bots.",
        "learning_outcomes": "Webhook requests, API client scripting, asynchronous handlers"
    },
    {
        "title": "ESP32 BLE Mesh Spatial Node Topology Mapper",
        "category": "Software",
        "difficulty": "Advanced",
        "tech_stack": "ESP32 BLE Mesh Stack, C++, Graphviz Visualization",
        "description": "Deploy a multi-node BLE mesh topology that tracks signals and hops between ESP32 nodes, creating a live graph visualizer of local spatial signal pathways.",
        "learning_outcomes": "BLE Mesh stack, network graph visualization, packet routing optimization"
    },
    {
        "title": "3D Point Cloud Ground Plane Segmenter",
        "category": "Software",
        "difficulty": "Advanced",
        "tech_stack": "Python, Open3D library, RANSAC Model, NumPy",
        "description": "Develop a data parsing script for 3D LiDAR coordinate dumps. Fits ground planes using RANSAC mathematical models, separates soil points, and clusters elevated obstacle coordinates.",
        "learning_outcomes": "Mathematical plane fitting, voxel grid downsampling, clustering algorithms"
    },
    {
        "title": "Genetic Algorithm Biped Walk Optimization Solver",
        "category": "Software",
        "difficulty": "Advanced",
        "tech_stack": "Python, Pygame Visualizer, Genetic Algorithm Framework",
        "description": "An interactive learning visualizer that evolves stable gait kinematics over generations. Uses selection, crossover, and mutation weights to optimize walking speeds and dynamic equilibrium.",
        "learning_outcomes": "Evolutionary computing optimization, kinematics joint modeling, cost evaluations"
    },
    {
        "title": "STM32 DMA ADC Hardware Driver",
        "category": "Software",
        "difficulty": "Advanced",
        "tech_stack": "STM32 HAL, C, Direct Memory Access, Interrupt Registers",
        "description": "Write high-frequency analog hardware drivers from scratch. Configures the STM32 to automatically write ADC voltage buffers to RAM via DMA, eliminating CPU overhead for signal processing.",
        "learning_outcomes": "Hardware register mapping, DMA bus architectures, high-speed signal sampling"
    }
]
