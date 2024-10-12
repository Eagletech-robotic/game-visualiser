export type GameData = {
    startingPosition: Position
    actions: Array<Action>
}

export type Action = {
    timestamp: number // milliseconds
    type: 'move'
    endPosition: Position
}

export type Position = {
    x: number // millimeters
    y: number // millimeters
    angle: number // degrees
}
