import { GameData } from 'types'
import { Canvas } from './Canvas'
import { Game, GAME_HEIGHT, GAME_WIDTH } from './Game'

const canvasElement = document.getElementById('canvas') as HTMLCanvasElement
canvasElement.width = GAME_WIDTH / (GAME_HEIGHT / canvasElement.height)
canvasElement.height = GAME_HEIGHT / (GAME_HEIGHT / canvasElement.height)

const inputFile = document.getElementById('inputFile') as HTMLInputElement
inputFile.addEventListener('change', () => {
    const file = inputFile.files?.[0]
    if (file) handleFileSelect(file)
})

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
    newGame()
})

let GAMEDATA: GameData | null = null
let GAME: Game | null = null

let isPlaying: boolean = false

// Try to get saved file
const savedFileName = localStorage.getItem('savedFileName')
const savedFileContent = localStorage.getItem('savedFileContent')
if (savedFileName && savedFileContent) {
    const mockFile = new File([savedFileContent], savedFileName)
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(mockFile)
    inputFile.files = dataTransfer.files

    const event = new Event('change', { bubbles: true })
    inputFile.dispatchEvent(event)
}

function handleFileSelect(file: File) {
    const uploadedFileSpan = document.getElementById('uploadedFile') as HTMLSpanElement
    if (!file) {
        uploadedFileSpan.innerText = 'No file selected'
        return
    }

    uploadedFileSpan.innerText = file.name

    const reader = new FileReader()
    reader.onload = function () {
        try {
            const result = reader.result as string
            GAMEDATA = JSON.parse(result)
            localStorage.setItem('savedFileContent', result)
            localStorage.setItem('savedFileName', file.name)
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

        let startPosition = GAMEDATA.startingPosition

        for (const action of GAMEDATA?.actions) {
            await GAME.playAction(action, startPosition)

            startPosition = action.endPosition
        }
    }
}
