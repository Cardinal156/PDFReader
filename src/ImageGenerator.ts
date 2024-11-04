import type { TextItem, PDFPageProxy } from 'pdfjs-dist/types/src/display/api';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf';
import { createCanvas } from 'canvas';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

class ImageGenerator {
    private pages: PDFPageProxy[] = [];

    private constructor() { };

    public static async create(pdfPath: string, pageRange: [number, number]): Promise<ImageGenerator> {
        if (pageRange[0] > pageRange[1]) throw new Error(chalk.red(`The 1st page of the page range is higher than the 2nd page of the range! That does not make sense! Pages ${pageRange[0]}-${pageRange[1]}`));

        const instance = new ImageGenerator();

        const data = new Uint8Array(fs.readFileSync(pdfPath));
        const pdfDoc = await getDocument({ data }).promise;


        for (let pageIndex = pageRange[0]; pageIndex < pageRange[1]; pageIndex++) {
            const page = await pdfDoc.getPage(pageIndex + 1);
            instance.pages.push(page);
        }

        return instance;
    }

    public async convertPdfToImages(): Promise<void> {
        const scale = 2;

        for (let pageIndex = 0; pageIndex < this.pages.length; pageIndex++) {
            const page = this.pages[pageIndex];
            const viewport = page.getViewport({ scale });

            // Create a canvas with the page dimensions
            const canvas = createCanvas(viewport.width, viewport.height);
            const context = canvas.getContext('2d');

            // Render the page onto the canvas
            const renderContext: any = {
                canvasContext: context,
                viewport: viewport,
            };

            await page.render(renderContext).promise;

            // Extract text content
            const textContent = await page.getTextContent();
            //@ts-ignore
            const textItems: TextItem[] = textContent.items;

            // Iterate through text items to find the highlight text
            for (const textItem of textItems) {
                const words = textItem.str.split(' '); // Split text into words

                for (const word of words) {
                    if (word === "testcross") {
                        const x = textItem.transform[4] * scale; // x coordinate
                        const y = viewport.height - textItem.transform[5] * scale; // y coordinate (flip y-axis)

                        // Set the fill style to yellow for highlighting
                        context.fillStyle = 'rgba(255, 255, 0, 0.5)'; // Semi-transparent yellow
                        context.fillRect(x, y - textItem.height * scale, textItem.width * scale, textItem.height * scale); // Draw highlight rectangle

                    }
                }
            }

            // Save the canvas as an image
            const outputPath = `${path.resolve(__dirname, "../output/")}/page-${pageIndex + 1}.png`;
            const out = fs.createWriteStream(outputPath);
            const stream = canvas.createPNGStream();
            stream.pipe(out);
            out.on('finish', () => console.log(`Saved image: ${outputPath}`));
        }
    }
}

export { ImageGenerator };
