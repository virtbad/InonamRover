const rover: Rover = new Rover();
const finder: Finder = new Finder(rover);
const pathfinding: Maneuvers = new Maneuvers(config.size.width, config.size.length, config.maxEffectiveDegrees);
const queue: Queue = new Queue(rover, pathfinding);
let objects: Array<Instruction[]> = [];

let test: number = 1;

brick.buttonDown.onEvent(ButtonEvent.Pressed, () => {
  brick.setStatusLight(StatusLight.GreenPulse);
  if (rover.drive(DriveDirection.Forwards, Units.Rotations, 2, 10)) {
    console.log('arrived');
  }
});

brick.buttonUp.onEvent(ButtonEvent.Pressed, () => {
  rover.steer(SteerDirection.Left, 27, 20);
});

finder.onFind((coordinate: Point) => {
  if (test == 2) return;
  queue.addInstructions(pathfinding.findToObject(new Point(100, 40)));
  //queue.addInstructions(pathfinding.findToObject(new Point(coordinate.x, coordinate.y)));
  test = 2;
});

rover.onEvent((event: RoverEvent, distance: number, coordinate?: Point) => {
  switch (event) {
    case RoverEvent.DRIVE:
      if (!coordinate.isInField()) rover.stopAll();
      pathfinding.update(coordinate, rover.gyroDegrees);
      break;
    case RoverEvent.GYRO:
      break;
    case RoverEvent.STEER:
      break;
  }
});

function newPoint(point: Point) {
  queue.add(point);
}

/**
 * 67cm, 5 rot 61cm, 5 rot, 1806deg - 12.2cm/rot 1.2deg off/rot 61.5cm, 5 rot, 1807deg - 12.3cm/rot 1.4deg off/rot 62cm, 5 rot, 1813deg - 12.4cm/rot 2.6deg off/rot Average: 61.5cm/5rot, 12.3cm/rot, 1.73deg off/rot Average: 0.34mm/deg 0.0048deg off/deg
 */