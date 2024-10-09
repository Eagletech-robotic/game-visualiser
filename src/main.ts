import { Canvas } from './Canvas'
import { Game, gameHeight, gameWidth } from './Game'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
canvas.width = gameWidth / (gameHeight / canvas.height)
canvas.height = gameHeight / (gameHeight / canvas.height)

const inputFile = document.getElementById('inputFile') as HTMLInputElement
inputFile.addEventListener('change', handleFileSelect)

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
            const gameData = JSON.parse(reader.result as string)
            const CANVAS = new Canvas(canvas)
            const GAME = new Game(gameData, CANVAS)
            GAME.start()
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
