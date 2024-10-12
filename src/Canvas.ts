import { Position } from 'types'

export class Canvas {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    width: number
    height: number

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')!
        this.width = canvas.width
        this.height = canvas.height
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }

    drawPosition(position: Position, robotRadius: number) {
        this.ctx.beginPath()
        this.ctx.arc(position.x, position.y, robotRadius, 0, Math.PI * 2)
        this.ctx.fillStyle = 'blue'
        this.ctx.fill()
        this.ctx.closePath()

        this.ctx.beginPath()
        this.ctx.moveTo(position.x, position.y)
        this.ctx.lineTo(
            position.x + Math.cos((position.angle * Math.PI) / 180) * robotRadius,
            position.y + Math.sin((position.angle * Math.PI) / 180) * robotRadius
        )
        this.ctx.strokeStyle = 'red'
        this.ctx.lineWidth = 3
        this.ctx.stroke()
        this.ctx.closePath()
    }
}
