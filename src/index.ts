import { ImageGenerator } from "./ImageGenerator";
import { ProgressManager } from "./ProgressManager";
import { SetupManager } from "./SetupManager";

async function workerTask() {
    throw new Error("Not implemented yet!");
}

async function mainTask() {
    const progressManager = new ProgressManager();
    const setupManager = new SetupManager();

    process.stdout.write("PDF file: ");
    const pdf = await setupManager.requestPDF();
    console.log(pdf);



    process.stdout.write("Audio file: ");
    const audio = await setupManager.requestAudio();
    console.log(audio);

    const imageGenerator = await ImageGenerator.create(pdf, [0, 1]);
    imageGenerator.convertPdfToImages();

}

const isChildProcess = process.send !== undefined;

if (isChildProcess) {
    workerTask();
} else {
    mainTask();
}