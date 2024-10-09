import { Canvas } from 'Canvas'
import { Action, GameData, Position } from 'types'

export const gameHeight = 3000 // 3 meters
export const gameWidth = 4500 // 4.5 meters
export const playerRadius = 150 // 15 cm

export class Game {
    private gameData: GameData
    private canvas: Canvas
    private intervalId: number | null = null
    private isRunning = false

    constructor(gameData: GameData, canvas: Canvas) {
        this.gameData = gameData
        this.canvas = canvas
        this.drawStartPosition()
    }

    private drawStartPosition() {
        this.canvas.clear()
        const startPosition = this.positionToPixels(this.gameData.startPosition)
        const playerRadiusMm = this.millimetersToPixels(playerRadius)
        this.canvas.drawPosition(startPosition, playerRadiusMm)
    }

    playAction(action: Action, startPosition: Position): Promise<void> {
        return new Promise<void>((resolve) => {
            this.stop()
            this.isRunning = true

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
                        ((action.endPosition.x - startPosition.x) * time) / action.timestamp,
                    y:
                        startPosition.y +
                        ((action.endPosition.y - startPosition.y) * time) / action.timestamp,
                    angle:
                        startPosition.angle +
                        ((action.endPosition.angle - startPosition.angle) * time) /
                            action.timestamp,
                }

                console.log('currently at position ' + JSON.stringify(position))

                this.canvas.clear()
                this.canvas.drawPosition(
                    this.positionToPixels(position),
                    this.millimetersToPixels(playerRadius)
                )
            }, interval)
        })
    }

    stop() {
        this.isRunning = false
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
        return (millimeters / gameHeight) * this.canvas.height
    }
}
