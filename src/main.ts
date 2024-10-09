import { Action, GameData } from 'types'
import { Canvas } from './Canvas'
import { Game, gameHeight, gameWidth } from './Game'

const canvasElement = document.getElementById('canvas') as HTMLCanvasElement
canvasElement.width = gameWidth / (gameHeight / canvasElement.height)
canvasElement.height = gameHeight / (gameHeight / canvasElement.height)

const inputFile = document.getElementById('inputFile') as HTMLInputElement
inputFile.addEventListener('change', handleFileSelect)

const startButton: HTMLElement = document.getElementById('start')!
const stopButton: HTMLElement = document.getElementById('stop')!
const resetButton: HTMLElement = document.getElementById('reset')!

startButton.addEventListener('click', () => {
    playGame()
})
stopButton.addEventListener('click', () => {
    GAME?.stop()
})
resetButton.addEventListener('click', () => {
    GAME?.stop()
    newGame()
})

let GAMEDATA: GameData | null = null
let GAME: Game | null = null

let isPlaying: boolean = false

function handleFileSelect() {
    const file = inputFile.files?.[0]
    const uploadedFileSpan = document.getElementById('uploadedFile') as HTMLSpanElement
    if (!file) {
        uploadedFileSpan.innerText = 'No file selected'
        return
    }

    uploadedFileSpan.innerText = file.name

    const reader = new FileReader()
    reader.onload = function () {
        try {
            GAMEDATA = JSON.parse(reader.result as string)
            newGame()
        } catch (e) {
            console.error('Error parsing JSON file:', e)
        }
    }

    reader.onerror = () => {
        console.error('Error reading file:', reader.error)
        inputFile.value = ''
        uploadedFileSpan.innerText = 'Please try again'
    }

    reader.readAsText(file)
}

function newGame() {
    GAME?.stop()
    isPlaying = false

    const canvas = new Canvas(canvasElement)
    if (GAMEDATA) {
        GAME = new Game(GAMEDATA, canvas)
    }
}

async function playGame() {
    GAME?.stop()
    isPlaying = true

    if (GAME && GAMEDATA) {
        if (!isPlaying) {
            GAME.stop()
            return
        }

        let startPosition = GAMEDATA.startPosition

        for (const action of GAMEDATA?.actions) {
            await GAME.playAction(action, startPosition)

            startPosition = action.endPosition
        }
    }
}
