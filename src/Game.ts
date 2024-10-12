import { Canvas } from 'Canvas'
import { Action, GameData, Position } from 'types'

export const GAME_HEIGHT = 2000 // 3 meters
export const GAME_WIDTH = 3000 // 4.5 meters
const ROBOT_PERIMETER = 1200 // 30 cm

export const robotRadius = ROBOT_PERIMETER / (2 * Math.PI)

export class Game {
    private gameData: GameData
    private canvas: Canvas
    private intervalId: NodeJS.Timeout | null = null

    constructor(gameData: GameData, canvas: Canvas) {
        this.gameData = gameData
        this.canvas = canvas
        this.drawStartingPosition()
    }

    private drawStartingPosition() {
        this.canvas.clear()
        const startPosition = this.positionToPixels(this.gameData.startingPosition)
        const robotRadiusMm = this.millimetersToPixels(robotRadius)
        this.canvas.drawPosition(startPosition, robotRadiusMm)
    }

    playAction(action: Action, startPosition: Position): Promise<void> {
        return new Promise<void>((resolve) => {
            this.stop()

            console.log('playing action ' + action.timestamp + ' with start position:')
            console.log(startPosition)

            let time = action.timestamp
            const interval = 20 // 20 milliseconds
            this.intervalId = setInterval(() => {
                time -= interval

                if (time <= 0) {
                    clearInterval(this.intervalId!)
                    resolve()
                    return
                }

                const position = {
                    x:
                        startPosition.x +
                        (action.endPosition.x - startPosition.x) * (1 - time / action.timestamp),
                    y:
                        startPosition.y +
                        (action.endPosition.y - startPosition.y) * (1 - time / action.timestamp),
                    angle:
                        startPosition.angle +
                        (action.endPosition.angle - startPosition.angle) *
                            (1 - time / action.timestamp),
                }

                console.log('currently at position ' + JSON.stringify(position))
                console.log('action: ' + JSON.stringify(action.endPosition))
                console.log('start: ' + JSON.stringify(startPosition))

                this.canvas.clear()
                this.canvas.drawPosition(
                    this.positionToPixels(position),
                    this.millimetersToPixels(robotRadius)
                )
            }, interval)
        })
    }

    stop() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId)
            this.intervalId = null
        }
    }

    private positionToPixels(position: Position) {
        return {
            x: this.millimetersToPixels(position.x),
            y: this.millimetersToPixels(position.y),
            angle: position.angle,
        }
    }

    private millimetersToPixels(millimeters: number) {
        return (millimeters / GAME_HEIGHT) * this.canvas.height
    }
}
