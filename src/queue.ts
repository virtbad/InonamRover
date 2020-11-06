class Queue {
  private _queue: Array<Point>;
  private _currentInstructions: Array<Instruction>;
  private _rover: Rover;
  private _pathfinding: Maneuvers;
  constructor(rover: Rover, pathfinding: Maneuvers) {
    this._queue = [];
    this._currentInstructions = [];
    this._rover = rover;
    this._pathfinding = pathfinding
  }

  public add(point: Point) {
    this._queue.push(point);
  }

  public addInstructions(instructions: Instruction[]) {
    console.log("New Instructions");
    instructions.forEach((instruction: Instruction) => {
      this._currentInstructions.push(instruction);
    });
  }

  public toNewPoint(): boolean {
    if (this._queue.length != 0) {
      if (this._currentInstructions.length != 0) {
        const shift: Instruction[] = pathfinding.findToObject(this._queue.shift());
        shift.forEach((instruction: Instruction) => this._currentInstructions.push(instruction));
        return true;
      } else return false;
    } else return false;
  }

  public toStation(): void {}

  public shift(): Function {
    if (this._currentInstructions.length != 0) {
      const shift: Instruction = this._currentInstructions.shift();
      if (!shift.angle || shift.angle == 0) {
        //this.solveDriveInstruction(shift)
        console.log("drive started")
        motors.largeA.pauseUntilReady()
        // shift.length / config.fieldsPerDeg
        motors.largeA.run(20, shift.length / config.fieldsPerDeg, MoveUnit.Degrees); 
        console.log("drive ended")
      } else {
        //this.solveSteerInstruction(shift);
        console.log("steer started")
        let degrees: number = shift.angle;
        const steerPerDegree : number = config.maxSteerMotorDegrees / config.maxEffectiveDegrees;
        console.log("per d " + steerPerDegree);
        if (degrees > config.maxEffectiveDegrees) degrees = config.maxEffectiveDegrees;
        if(degrees < -config.maxEffectiveDegrees) degrees = -config.maxEffectiveDegrees;
        const real: number = degrees * steerPerDegree - motors.mediumD.angle()
        motors.mediumD.pauseUntilReady();
        motors.mediumD.run(20, real, MoveUnit.Degrees);
        motors.largeA.run(20, shift.length / config.fieldsPerDeg, MoveUnit.Degrees)
        motors.mediumD.run(-20, real, MoveUnit.Degrees);
        console.log("steer ended")
      }
    }

    pause(1000);
    
    return this.shift();
  }

  public solveDriveInstruction(instruction: Instruction) {
    console.log("Solving Drive Instruction");
    console.log("Amount to go: " + instruction.length);
    this._rover.drive(Units.Centimeters, instruction.length, 20);
    console.log("Finished Driving");
  }

  private solveSteerInstruction(instruction: Instruction) {
    console.log("Solving Steer Instruction");

    console.log("Amount to go: " + instruction.length);
    console.log("Amount to steer: " + instruction.angle);

    this._rover.steer(instruction.angle, 20);
    console.log("Driving in Steer Instruction");
    this._rover.drive(Units.Centimeters, instruction.length, 20);
    this._rover.steer(-instruction.angle, 20);
    console.log("Finished Steering");

  }
}
