import { Canvas } from 'Canvas'
import { Action, GameData, Position } from 'types'

export const gameHeight = 3000 // 3 meters
export const gameWidth = 4500 // 4.5 meters

export class Game {
    private gameData: GameData
    private canvas: Canvas
    private playerRadius = 150 // 15 cm

    constructor(gameData: GameData, canvas: Canvas) {
        this.gameData = gameData
        this.canvas = canvas
    }

    start() {
        this.canvas.clear()
        const startPosition = this.positionToPixels(this.gameData.startPosition)
        const playerRadius = this.millimetersToPixels(this.playerRadius)
        this.canvas.drawPosition(startPosition, playerRadius)

        let lastAction = this.gameData.actions[0]
        this.gameData.actions.forEach((action) => {
            setTimeout(() => {
                this.playAction(action, lastAction.endPosition)
            }, action.timestamp)
            lastAction = action
        })
    }

    private playAction(action: Action, startPosition: Position) {
        const playerRadius = this.millimetersToPixels(this.playerRadius)

        let time = action.timestamp
        while (time > 0) {
            this.canvas.clear()

            time -= 20 // 20 milliseconds
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

            this.canvas.drawPosition(this.positionToPixels(position), playerRadius)
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
